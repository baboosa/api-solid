import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from 'generated/prisma/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
describe('CheckIn Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-1',
      title: 'Gym 1',
      description: '',
      phone: '',
      latitude: new Decimal('-23.5874622'),
      longitude: new Decimal('-46.4536415'),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to CheckIn', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -23.5874622,
      userLongitude: -46.4536415,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -23.5874622,
      userLongitude: -46.4536415,
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitude: -23.5874622,
        userLongitude: -46.4536415,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0))

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -23.5874622,
      userLongitude: -46.4536415,
    })

    vi.setSystemTime(new Date(2023, 0, 2, 12, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -23.5874622,
      userLongitude: -46.4536415,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-1',
      title: 'Gym 1',
      description: '',
      phone: '',
      latitude: new Decimal('-23.596653'),
      longitude: new Decimal('-46.452844'),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitude: -23.5963627,
        userLongitude: -46.4555587,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
