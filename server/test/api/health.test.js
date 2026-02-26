const request = require('supertest')
const app = require('../../src/app')

describe('GET /api/ping', () => {
  it('returns pong', async () => {
    const res = await request(app).get('/api/ping')
    expect(res.status).toBe(200)
    expect(res.body.pong).toBe(true)
  })
})
