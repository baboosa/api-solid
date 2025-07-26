import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from '././get-user-profile'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase
describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to user profile', async () => {
    await usersRepository.create({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 10),
      created_at: new Date(),
    })

    const { user } = await sut.execute({
      userId: 'user-1',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to user profile with wrong userId', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 10),
      created_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-2',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
