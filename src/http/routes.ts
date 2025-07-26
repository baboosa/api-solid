import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { register } from './controllers/register'
import { FastifyInstance } from 'fastify'
import { verifyJWT } from './middleware/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // authenticated routes
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
