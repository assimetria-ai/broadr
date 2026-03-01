'use strict'

const fs = require('fs')
const path = require('path')

async function up(db) {
  const sql = fs.readFileSync(
    path.join(__dirname, '../../schemas/@custom/channels.sql'),
    'utf8',
  )
  await db.none(sql)
  console.log('[migrate] applied schema: channels + posts')
}

async function down(db) {
  await db.none('DROP TABLE IF EXISTS posts CASCADE')
  await db.none('DROP TABLE IF EXISTS channels CASCADE')
  console.log('[migrate] rolled back schema: channels + posts')
}

module.exports = { up, down }
