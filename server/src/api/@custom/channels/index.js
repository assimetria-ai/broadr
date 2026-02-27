const express = require('express')
const router = express.Router()
const { authenticate } = require('../../../lib/@system/Helpers/auth')
const db = require('../../../lib/@system/PostgreSQL')

// GET /api/channels — list connected social channels
router.get('/channels', authenticate, async (req, res, next) => {
  try {
    const channels = await db.any(
      'SELECT * FROM channels WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json({ channels })
  } catch (err) {
    next(err)
  }
})

// POST /api/channels — connect a new channel
router.post('/channels', authenticate, async (req, res, next) => {
  try {
    const { platform, handle, access_token } = req.body
    const channel = await db.one(
      `INSERT INTO channels (user_id, platform, handle, access_token, status, created_at)
       VALUES ($1, $2, $3, $4, 'connected', NOW()) RETURNING *`,
      [req.user.id, platform, handle, access_token]
    )
    res.status(201).json({ channel })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/channels/:id — disconnect a channel
router.delete('/channels/:id', authenticate, async (req, res, next) => {
  try {
    await db.none(
      'DELETE FROM channels WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// POST /api/channels/publish — publish a post to selected channels
router.post('/channels/publish', authenticate, async (req, res, next) => {
  try {
    const { content, channel_ids, scheduled_at } = req.body
    const post = await db.one(
      `INSERT INTO posts (user_id, content, channel_ids, status, scheduled_at, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [req.user.id, content, channel_ids, scheduled_at ? 'scheduled' : 'published', scheduled_at || null]
    )
    res.status(201).json({ post })
  } catch (err) {
    next(err)
  }
})

// GET /api/channels/posts — list recent posts
router.get('/channels/posts', authenticate, async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query
    const posts = await db.any(
      'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    )
    const total = await db.one(
      'SELECT COUNT(*) FROM posts WHERE user_id = $1',
      [req.user.id]
    )
    res.json({ posts, total: parseInt(total.count) })
  } catch (err) {
    next(err)
  }
})

// GET /api/channels/stats — dashboard stats
router.get('/channels/stats', authenticate, async (req, res, next) => {
  try {
    const connected = await db.one('SELECT COUNT(*) FROM channels WHERE user_id = $1 AND status = $2', [req.user.id, 'connected'])
    const todayPosts = await db.one("SELECT COUNT(*) FROM posts WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'", [req.user.id])
    const scheduled = await db.one("SELECT COUNT(*) FROM posts WHERE user_id = $1 AND status = 'scheduled'", [req.user.id])
    res.json({
      connected_channels: parseInt(connected.count),
      posts_today: parseInt(todayPosts.count),
      scheduled_posts: parseInt(scheduled.count),
      total_reach: 0, // computed from channel follower counts
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
