import { makeFetchUserCheckInsHistoryUseCase } from '@/usecases/factories/make-fetch-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const searchSchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = searchSchema.parse(request.params)

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()
  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
