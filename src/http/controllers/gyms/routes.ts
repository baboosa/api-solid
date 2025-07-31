import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'
import { nearby } from './nearby'
import { create } from './create'
import { search } from './search'
import { verifyUserRole } from '@/http/middleware/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)

  app.get('/gyms/nearby', nearby)
  app.get('/gyms/search', search)
}
