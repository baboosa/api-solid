import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase
describe('Search gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'gym-title-1',
      description: 'Gym description',
      phone: null,
      latitude: -23.5505,
      longitude: -46.6333,
    })

    await gymsRepository.create({
      title: 'gym-title-2',
      description: 'Gym description',
      phone: null,
      latitude: -23.5505,
      longitude: -46.6333,
    })

    const { gyms } = await sut.execute({
      query: 'gym-title-1',
      page: 1,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym-title-1' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym-title-${i}`,
        description: 'Gym description',
        phone: null,
        latitude: -23.5505,
        longitude: -46.6333,
      })
    }

    const { gyms } = await sut.execute({
      query: 'gym-title',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-title-21' }),
      expect.objectContaining({ title: 'gym-title-22' }),
    ])
  })
})
