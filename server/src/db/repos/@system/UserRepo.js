const db = require('../../lib/@system/PostgreSQL')

const UserRepo = {
  async findById(id) {
    return db.oneOrNone('SELECT * FROM users WHERE id = $1', [id])
  },

  async findByEmail(email) {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
  },

  async findAll() {
    return db.any('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC')
  },

  async create({ email, name, password_hash, role = 'user' }) {
    return db.one(
      'INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [email.toLowerCase(), name, password_hash, role],
    )
  },

  async update(id, fields) {
    const sets = Object.entries(fields)
      .filter(([, v]) => v !== undefined)
      .map(([k], i) => `${k} = $${i + 2}`)
      .join(', ')
    const values = Object.values(fields).filter((v) => v !== undefined)
    if (!sets) return this.findById(id)
    return db.one(`UPDATE users SET ${sets}, updated_at = now() WHERE id = $1 RETURNING id, email, name, role`, [id, ...values])
  },
}

module.exports = UserRepo
