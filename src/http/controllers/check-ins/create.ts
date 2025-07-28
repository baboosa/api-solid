import { makeCheckInUseCase } from '@/usecases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    gymId: z.string(),
  })

  const bodySchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })

  const { gymId } = paramsSchema.parse(request.params)

  const { latitude, longitude } = bodySchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()
  await checkInUseCase.execute({
    userId: request.user.sub,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
