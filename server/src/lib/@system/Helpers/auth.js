const { verifyToken } = require('./jwt')
const UserRepo = require('../../db/repos/@system/UserRepo')

async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token ?? req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const payload = verifyToken(token)
    const user = await UserRepo.findById(payload.userId)
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    req.user = { id: user.id, email: user.email, name: user.name, role: user.role }
    next()
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
  next()
}

module.exports = { authenticate, requireAdmin }
