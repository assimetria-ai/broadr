const express = require('express')
const router = express.Router()
const { authenticate } = require('../../lib/@system/Helpers/auth')
const UserRepo = require('../../db/repos/@system/UserRepo')
const bcrypt = require('bcryptjs')

// POST /api/users — register
router.post('/users', async (req, res, next) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const existing = await UserRepo.findByEmail(email)
    if (existing) return res.status(409).json({ message: 'Email already in use' })

    const password_hash = await bcrypt.hash(password, 12)
    const user = await UserRepo.create({ email, name, password_hash })
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    next(err)
  }
})

// GET /api/users/me — profile
router.get('/users/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

// PATCH /api/users/me — update profile
router.patch('/users/me', authenticate, async (req, res, next) => {
  try {
    const { name } = req.body
    const updated = await UserRepo.update(req.user.id, { name })
    res.json({ user: updated })
  } catch (err) {
    next(err)
  }
})

module.exports = router
