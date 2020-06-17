const supertest = require('supertest')
const app = require('./../../../index')
const request = supertest(app)

describe('Health check', () => {
  it('GET healthz it should response with 200', async () => {
    const res = await request.get('/_healthz')
    expect(res.statusCode).toEqual(200)
  })
})
