import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import { handleTmdbRequest } from './server/tmdb.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      {
        name: 'tmdb-api-development',
        configureServer(server) {
          server.middlewares.use(async (request, response, next) => {
            const url = new URL(request.url ?? '/', 'http://localhost')

            if (url.pathname !== '/api/tmdb') {
              next()
              return
            }

            try {
              const result = await handleTmdbRequest(
                request.method,
                Object.fromEntries(url.searchParams.entries()),
                env.TMDB_READ_ACCESS_TOKEN,
              )

              response.statusCode = result.status
              for (const [name, value] of Object.entries(result.headers)) {
                response.setHeader(name, value)
              }
              response.setHeader('Content-Type', 'application/json; charset=utf-8')
              response.end(JSON.stringify(result.body))
            } catch (error) {
              next(error)
            }
          })
        },
      },
    ],
  }
})
