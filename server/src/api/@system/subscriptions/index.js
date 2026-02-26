const express = require('express')
const router = express.Router()
const { authenticate } = require('../../lib/@system/Helpers/auth')

// GET /api/subscriptions/me
router.get('/subscriptions/me', authenticate, async (req, res, next) => {
  try {
    // TODO: fetch from DB
    res.json({ subscription: null })
  } catch (err) {
    next(err)
  }
})

module.exports = router
