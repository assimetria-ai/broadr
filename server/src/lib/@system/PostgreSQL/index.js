const pgp = require('pg-promise')()

const db = pgp(process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/product_template_dev')

module.exports = db
