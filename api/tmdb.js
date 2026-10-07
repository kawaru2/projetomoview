import process from "node:process"
import { handleTmdbRequest } from "../server/tmdb.js"

export default async function handler(request, response) {
  const result = await handleTmdbRequest(
    request.method,
    request.query,
    process.env.TMDB_READ_ACCESS_TOKEN,
  )

  for (const [name, value] of Object.entries(result.headers)) {
    response.setHeader(name, value)
  }

  return response.status(result.status).json(result.body)
}
