import { makeValidateCheckInUseCase } from '@/usecases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    checkInId: z.string(),
  })

  const { checkInId } = paramsSchema.parse(request.params)

  const validateUseCase = makeValidateCheckInUseCase()
  await validateUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
