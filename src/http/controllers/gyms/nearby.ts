import { makeFetchNearbyGymsUseCase } from '@/usecases/factories/make-fetch-nearby-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  })

  const { latitude, longitude } = schema.parse(request.query)

  const nearbyGym = makeFetchNearbyGymsUseCase()
  const { gyms } = await nearbyGym.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
