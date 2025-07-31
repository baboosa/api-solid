import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { describe, beforeAll, afterAll, expect, it } from 'vitest'
import request from 'supertest'

describe('NearbyGyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to nearby a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'gym-title-1',
        description: 'Gym description',
        phone: null,
        latitude: -23.5963676,
        longitude: -46.4555587,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'gym-title-2',
        description: 'Gym description',
        phone: null,
        latitude: -23.6094231,
        longitude: -46.5746364,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.596367,
        longitude: -46.455558,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'gym-title-1',
      }),
    ])
  })
})
