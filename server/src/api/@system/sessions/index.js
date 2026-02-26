const express = require('express')
const router = express.Router()
const { authenticate } = require('../../lib/@system/Helpers/auth')
const UserRepo = require('../../db/repos/@system/UserRepo')
const { signToken, verifyToken } = require('../../lib/@system/Helpers/jwt')
const bcrypt = require('bcryptjs')

// POST /api/sessions — login
router.post('/sessions', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const user = await UserRepo.findByEmail(email)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken({ userId: user.id })
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    next(err)
  }
})

// GET /api/sessions/me — current user
router.get('/sessions/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

// DELETE /api/sessions — logout
router.delete('/sessions', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

module.exports = router
