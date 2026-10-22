import assert from "node:assert/strict"
import { afterEach, test } from "node:test"
import { handleTmdbRequest } from "../server/tmdb.js"

const originalFetch = globalThis.fetch
const originalConsoleError = console.error

afterEach(() => {
  globalThis.fetch = originalFetch
  console.error = originalConsoleError
})

test("rejects methods other than GET without calling TMDB", async () => {
  globalThis.fetch = () => assert.fail("fetch should not be called")

  const result = await handleTmdbRequest("POST", { endpoint: "movie/popular" }, "token")

  assert.equal(result.status, 405)
  assert.equal(result.headers.Allow, "GET")
  assert.equal(result.headers["Cache-Control"], "no-store")
})

test("rejects unsupported endpoints and invalid query parameters", async (t) => {
  globalThis.fetch = () => assert.fail("fetch should not be called")

  const invalidRequests = [
    { endpoint: "../configuration" },
    { endpoint: "movie/1", page: "501" },
    { endpoint: "movie/popular", language: "pt-br" },
    { endpoint: "movie/popular", sort_by: "popularity.desc" },
    { endpoint: "movie/popular", unknown: "value" },
    { endpoint: "movie/popular", page: 2 },
  ]

  for (const query of invalidRequests) {
    await t.test(JSON.stringify(query), async () => {
      const result = await handleTmdbRequest("GET", query, "token")

      assert.equal(result.status, 400)
      assert.equal(result.headers["Cache-Control"], "no-store")
    })
  }
})

test("reports a missing TMDB token", async () => {
  console.error = () => {}

  const result = await handleTmdbRequest("GET", { endpoint: "movie/popular" }, "")

  assert.equal(result.status, 500)
  assert.equal(result.headers["Cache-Control"], "no-store")
  assert.match(result.body.error, /não está configurada/)
})

test("forwards an allowed request and caches successful responses", async () => {
  let requestedUrl
  let requestOptions
  globalThis.fetch = async (url, options) => {
    requestedUrl = url
    requestOptions = options
    return {
      status: 200,
      ok: true,
      json: async () => ({ results: [] }),
    }
  }

  const result = await handleTmdbRequest(
    "GET",
    {
      endpoint: "movie/popular",
      language: "pt-BR",
      page: "2",
      sort_by: "vote_count.desc",
    },
    "test-token",
  )

  assert.equal(
    requestedUrl,
    "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=2&sort_by=vote_count.desc",
  )
  assert.equal(requestOptions.headers.Authorization, "Bearer test-token")
  assert.equal(requestOptions.headers.accept, "application/json")
  assert.equal(result.status, 200)
  assert.equal(result.headers["Cache-Control"], "public, s-maxage=300, stale-while-revalidate=600")
  assert.deepEqual(result.body, { results: [] })
})

test("does not cache unsuccessful TMDB responses", async () => {
  globalThis.fetch = async () => ({
    status: 401,
    ok: false,
    json: async () => ({ status_message: "Unauthorized" }),
  })

  const result = await handleTmdbRequest("GET", { endpoint: "movie/popular" }, "token")

  assert.equal(result.status, 401)
  assert.equal(result.headers["Cache-Control"], "no-store")
  assert.deepEqual(result.body, { status_message: "Unauthorized" })
})

test("returns a gateway error when the TMDB request fails", async () => {
  console.error = () => {}
  globalThis.fetch = async () => {
    throw new Error("network failure")
  }

  const result = await handleTmdbRequest("GET", { endpoint: "movie/popular" }, "token")

  assert.equal(result.status, 502)
  assert.equal(result.headers["Cache-Control"], "no-store")
  assert.match(result.body.error, /Não foi possível consultar/)
})
