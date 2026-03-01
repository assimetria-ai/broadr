'use strict'

const fs = require('fs')
const path = require('path')

async function up(db) {
  const sql = fs.readFileSync(
    path.join(__dirname, '../../schemas/@custom/webhooks.sql'),
    'utf8',
  )
  await db.none(sql)
  console.log('[migrate] applied schema: webhooks')
}

async function down(db) {
  await db.none('DROP TABLE IF EXISTS webhooks CASCADE')
  console.log('[migrate] rolled back schema: webhooks')
}

module.exports = { up, down }
