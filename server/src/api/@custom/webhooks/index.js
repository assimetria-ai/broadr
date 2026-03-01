// @custom — Broadr webhook notifications API
const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const { authenticate } = require('../../../lib/@system/Helpers/auth')
const db = require('../../../lib/@system/PostgreSQL')

const VALID_EVENTS = ['post.published', 'post.failed', 'post.scheduled', 'channel.connected', 'channel.disconnected']

function generateSecret() {
  return 'whsec_' + crypto.randomBytes(24).toString('hex')
}

// GET /api/webhooks — list webhooks
router.get('/webhooks', authenticate, async (req, res, next) => {
  try {
    const webhooks = await db.any(
      'SELECT id, url, events, active, last_triggered_at, last_status, failure_count, created_at FROM webhooks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json({ webhooks })
  } catch (err) {
    next(err)
  }
})

// POST /api/webhooks — register a webhook
router.post('/webhooks', authenticate, async (req, res, next) => {
  try {
    const { url, events } = req.body
    if (!url) return res.status(400).json({ message: 'url is required' })

    let parsedUrl
    try { parsedUrl = new URL(url) } catch {
      return res.status(400).json({ message: 'Invalid URL' })
    }
    if (!['https:', 'http:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ message: 'URL must be http or https' })
    }

    const eventsArr = Array.isArray(events) ? events : VALID_EVENTS
    const invalid = eventsArr.filter(e => !VALID_EVENTS.includes(e))
    if (invalid.length > 0) {
      return res.status(400).json({ message: `Invalid events: ${invalid.join(', ')}` })
    }

    const secret = generateSecret()
    const webhook = await db.one(
      `INSERT INTO webhooks (user_id, url, secret, events, created_at, updated_at)
       VALUES ($1,$2,$3,$4,NOW(),NOW()) RETURNING id, url, events, active, created_at`,
      [req.user.id, url, secret, JSON.stringify(eventsArr)]
    )
    // Return secret only on creation — never again
    res.status(201).json({ webhook: { ...webhook, secret } })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/webhooks/:id — update webhook (toggle active, change events)
router.patch('/webhooks/:id', authenticate, async (req, res, next) => {
  try {
    const webhook = await db.oneOrNone('SELECT * FROM webhooks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    if (!webhook) return res.status(404).json({ message: 'Webhook not found' })

    const { active, events } = req.body
    const updated = await db.one(
      `UPDATE webhooks SET
        active = COALESCE($1, active),
        events = COALESCE($2, events),
        updated_at = NOW()
       WHERE id = $3 RETURNING id, url, events, active, last_triggered_at, failure_count`,
      [active ?? null, events ? JSON.stringify(events) : null, webhook.id]
    )
    res.json({ webhook: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/webhooks/:id
router.delete('/webhooks/:id', authenticate, async (req, res, next) => {
  try {
    const webhook = await db.oneOrNone('SELECT id FROM webhooks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    if (!webhook) return res.status(404).json({ message: 'Webhook not found' })
    await db.none('DELETE FROM webhooks WHERE id = $1', [webhook.id])
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// POST /api/webhooks/:id/test — send a test ping
router.post('/webhooks/:id/test', authenticate, async (req, res, next) => {
  try {
    const webhook = await db.oneOrNone('SELECT * FROM webhooks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    if (!webhook) return res.status(404).json({ message: 'Webhook not found' })

    const payload = JSON.stringify({ event: 'test.ping', timestamp: new Date().toISOString(), webhook_id: webhook.id })
    const signature = 'sha256=' + crypto.createHmac('sha256', webhook.secret).update(payload).digest('hex')

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Broadr-Signature': signature,
          'X-Broadr-Event': 'test.ping',
        },
        body: payload,
        signal: controller.signal,
      })
      clearTimeout(timeout)
      await db.none(
        'UPDATE webhooks SET last_triggered_at = NOW(), last_status = $1, failure_count = CASE WHEN $2 THEN 0 ELSE failure_count + 1 END, updated_at = NOW() WHERE id = $3',
        [response.status, response.ok, webhook.id]
      )
      res.json({ ok: response.ok, status: response.status })
    } catch (fetchErr) {
      await db.none('UPDATE webhooks SET failure_count = failure_count + 1, updated_at = NOW() WHERE id = $1', [webhook.id])
      res.json({ ok: false, error: fetchErr.message })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
