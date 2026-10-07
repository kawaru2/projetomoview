import { useState, useEffect } from "react"
import { MoviewContext } from "./criandoContexto"

async function buscarDadosTMDB(endpoint, parametros = {}) {
  const query = new URLSearchParams({ endpoint, ...parametros })
  const response = await fetch(`/api/tmdb?${query}`)

  if (!response.ok) {
    throw new Error(`Falha ao carregar dados da TMDB (HTTP ${response.status}).`)
  }

  return response.json()
}

export function MoviewProvider({ children }) {
  const [isLogado, setIsLogado] = useState(() => {
    const valor = localStorage.getItem("log")

    if (!valor) return false

    return valor === "true"
  })

  const [filmesTopRated, setFilmesTopRated] = useState(null)
  const [generosFilmes, setGenerosFilmes] = useState([])
  const [indicacaoIdade, setIndicacaoIdade] = useState(null)
  const [filmesPopulares, setFilmesPopulares] = useState(null)
  const [trendingFilmesWeek, setTrendingFilmesWeek] = useState(null)

  useEffect(() => {
    buscarDadosTMDB("trending/movie/week", { language: "pt-BR" })
      .then(setTrendingFilmesWeek)
      .catch(console.error)
  }, [])

  useEffect(() => {
    buscarDadosTMDB("movie/popular", { language: "pt-BR", page: "1" })
      .then(setFilmesPopulares)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!filmesTopRated?.results) return

    Promise.all(
      filmesTopRated.results.slice(0, 3).map(async filme => {
        const resultado = await buscarDadosTMDB(`movie/${filme.id}/release_dates`)
        const brasil = resultado.results?.find(item => item.iso_3166_1 === "BR")
        const classificacao =
          brasil?.release_dates?.find(item => item.certification)?.certification ?? ""

        return [filme.id, classificacao]
      }),
    )
      .then(resultados => setIndicacaoIdade(Object.fromEntries(resultados)))
      .catch(console.error)
  }, [filmesTopRated])

  useEffect(() => {
    buscarDadosTMDB("discover/movie", {
      sort_by: "vote_count.desc",
      language: "pt-BR",
      page: "1",
    })
      .then(setFilmesTopRated)
      .catch(console.error)
  }, [])

  useEffect(() => {
    buscarDadosTMDB("genre/movie/list", { language: "pt-BR" })
      .then(data => setGenerosFilmes(data.genres))
      .catch(console.error)
  }, [])

  return (
    <MoviewContext.Provider value={{
      isLogado,
      setIsLogado,
      filmesTopRated,
      filmesPopulares,
      generosFilmes,
      indicacaoIdade,
      trendingFilmesWeek,
    }}>
      {children}
    </MoviewContext.Provider>
  )
}
