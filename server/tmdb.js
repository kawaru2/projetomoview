const allowedEndpoints = new Set([
  "trending/movie/week",
  "movie/popular",
  "discover/movie",
  "genre/movie/list",
])

const allowedQueryParameters = new Set(["language", "page", "sort_by"])

export async function handleTmdbRequest(method, query, token) {
  if (method !== "GET") {
    return {
      status: 405,
      headers: { Allow: "GET", "Cache-Control": "no-store" },
      body: { error: "Método não permitido." },
    }
  }

  const endpoint = query.endpoint
  const isAllowedMovieReleaseDates =
    typeof endpoint === "string" && /^movie\/\d+\/release_dates$/.test(endpoint)

  if (
    typeof endpoint !== "string" ||
    (!allowedEndpoints.has(endpoint) && !isAllowedMovieReleaseDates)
  ) {
    return {
      status: 400,
      headers: { "Cache-Control": "no-store" },
      body: { error: "Endpoint da TMDB não permitido." },
    }
  }

  const parameters = new URLSearchParams()

  for (const [name, value] of Object.entries(query)) {
    if (name === "endpoint") continue

    if (!allowedQueryParameters.has(name) || typeof value !== "string") {
      return {
        status: 400,
        headers: { "Cache-Control": "no-store" },
        body: { error: "Parâmetros da solicitação inválidos." },
      }
    }

    if (
      (name === "language" && !/^[a-z]{2}-[A-Z]{2}$/.test(value)) ||
      (name === "page" && (!/^[1-9]\d*$/.test(value) || Number(value) > 500)) ||
      (name === "sort_by" && value !== "vote_count.desc")
    ) {
      return {
        status: 400,
        headers: { "Cache-Control": "no-store" },
        body: { error: "Parâmetros da solicitação inválidos." },
      }
    }

    parameters.set(name, value)
  }

  if (!token) {
    console.error("A variável TMDB_READ_ACCESS_TOKEN não está configurada.")
    return {
      status: 500,
      headers: { "Cache-Control": "no-store" },
      body: { error: "A integração com filmes não está configurada no servidor." },
    }
  }

  const queryString = parameters.toString()
  const url = `https://api.themoviedb.org/3/${endpoint}${queryString ? `?${queryString}` : ""}`

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const body = await response.json()

    return {
      status: response.status,
      headers: {
        "Cache-Control": response.ok
          ? "public, s-maxage=300, stale-while-revalidate=600"
          : "no-store",
      },
      body,
    }
  } catch (error) {
    console.error("Falha ao consultar a TMDB:", error)
    return {
      status: 502,
      headers: { "Cache-Control": "no-store" },
      body: { error: "Não foi possível consultar os dados de filmes." },
    }
  }
}
