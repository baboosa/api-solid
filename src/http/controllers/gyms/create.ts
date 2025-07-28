import { InvalidCredentialsError } from '@/usecases/errors/invalid-credentials-error'
import { makeCreateGymUseCase } from '@/usecases/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  try {
    const createGym = makeCreateGymUseCase()

    await createGym.execute({
      title,
      description,
      phone,
      latitude,
      longitude,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
  return reply.status(201).send('Gym created successfully')
}
