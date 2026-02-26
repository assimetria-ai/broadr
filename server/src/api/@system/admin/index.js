const express = require('express')
const router = express.Router()
const { authenticate, requireAdmin } = require('../../lib/@system/Helpers/auth')
const UserRepo = require('../../db/repos/@system/UserRepo')

// GET /api/admin/users
router.get('/admin/users', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const users = await UserRepo.findAll()
    res.json({ users })
  } catch (err) {
    next(err)
  }
})

module.exports = router
