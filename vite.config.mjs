import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['src/http/**', './prisma/vitest-environment-prisma'],
    ],
  },
})
