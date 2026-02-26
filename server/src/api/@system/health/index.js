const express = require('express')
const router = express.Router()
const db = require('../../lib/@system/PostgreSQL')

router.get('/health', async (req, res) => {
  try {
    await db.one('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', message: err.message })
  }
})

module.exports = router
