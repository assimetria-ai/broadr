const db = require('../../lib/@system/PostgreSQL')
const fs = require('fs')
const path = require('path')

async function run() {
  const schemas = ['users', 'subscriptions']
  for (const schema of schemas) {
    const sql = fs.readFileSync(
      path.join(__dirname, '../../schemas/@system', `${schema}.sql`),
      'utf8',
    )
    await db.none(sql)
    console.log(`[migrate] applied schema: ${schema}`)
  }
  console.log('[migrate] done')
  process.exit(0)
}

run().catch((err) => {
  console.error('[migrate] error', err)
  process.exit(1)
})
