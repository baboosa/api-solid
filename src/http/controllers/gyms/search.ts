import { makeSearchGymsUseCase } from '@/usecases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchSchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchSchema.parse(request.query)

  const searchGym = makeSearchGymsUseCase()
  const { gyms } = await searchGym.execute({
    query: q,
    page,
  })

  return reply.status(200).send({ gyms })
}
