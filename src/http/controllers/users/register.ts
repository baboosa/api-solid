import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/usecases/errors/invalid-credentials-error'
import { makeRegisterUseCase } from '@/usecases/factories/make-register-use-case'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(409).send({ message: error.message })
    }

    throw error
  }

  return res.status(201).send('User created successfully')
}
