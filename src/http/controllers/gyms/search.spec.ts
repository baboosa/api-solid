import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { describe, beforeAll, afterAll, expect, it } from 'vitest'
import request from 'supertest'

describe('SearchGyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to Search a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Java title',
        description: 'Description',
        phone: '123456789',
        latitude: -23.5505,
        longitude: -46.6333,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym title',
        description: 'Gym Description',
        phone: '123456789',
        latitude: -23.5567,
        longitude: -46.6389,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Java title',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Java title',
        description: 'Description',
      }),
    ])
  })
})
