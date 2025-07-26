import { randomUUID } from 'crypto'
import { Environment } from 'vitest/environments'
import 'dotenv/config'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in the environment variables')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    const schema = randomUUID()

    console.log(generateDatabaseURL(schema))

    return {
      async teardown() {
        console.log('Teardown')
      },
    }
  },
}
