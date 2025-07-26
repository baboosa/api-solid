import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase
describe('Fetch nearby gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'gym-title-1',
      description: 'Gym description',
      phone: null,
      latitude: -23.5963676,
      longitude: -46.4555587,
    })

    await gymsRepository.create({
      title: 'gym-title-2',
      description: 'Gym description',
      phone: null,
      latitude: -23.6094231,
      longitude: -46.5746364,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.5963676,
      userLongitude: -46.4555587,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym-title-1' })])
  })
})
