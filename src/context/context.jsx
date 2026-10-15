import { useState, useEffect, useRef } from "react"
import { MoviewContext } from "./criandoContexto"
import { supabase } from "../service/supabase"

async function buscarDadosTMDB(endpoint, parametros = {}) {
  const query = new URLSearchParams({ endpoint, ...parametros })
  const response = await fetch(`/api/tmdb?${query}`)

  if (!response.ok) {
    throw new Error(`Falha ao carregar dados da TMDB (HTTP ${response.status}).`)
  }

  return response.json()
}

export function MoviewProvider({ children }) {
  const [user, setUser] = useState(null)
  const [carregandoSessao, setCarregandoSessao] = useState(true)
  const [erroSessao, setErroSessao] = useState(null)
  const [emRecuperacaoSenha, setEmRecuperacaoSenha] = useState(false)
  const [favoritos, setFavoritos] = useState([])
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(false)
  const [erroFavoritos, setErroFavoritos] = useState(null)
  const userIdAtual = useRef(null)
  const userId = user?.id ?? null
  const [filmesTopRated, setFilmesTopRated] = useState(null)
  const [generosFilmes, setGenerosFilmes] = useState([])
  const [indicacaoIdade, setIndicacaoIdade] = useState(null)
  const [filmesPopulares, setFilmesPopulares] = useState(null)
  const [trendingFilmesWeek, setTrendingFilmesWeek] = useState(null)

  useEffect(() => {
    let providerAtivo = true
    let eventoDeAutenticacaoRecebido = false

    function atualizarUsuario(session) {
      const novoUsuario = session?.user ?? null
      const novoUserId = novoUsuario?.id ?? null

      if (userIdAtual.current !== novoUserId) {
        userIdAtual.current = novoUserId
        setFavoritos([])
        setErroFavoritos(null)
      }

      setUser(novoUsuario)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (evento, session) => {
        eventoDeAutenticacaoRecebido = true
        atualizarUsuario(session)
        setErroSessao(null)
        setCarregandoSessao(false)
        if (evento === "PASSWORD_RECOVERY") {
          setEmRecuperacaoSenha(true)
        } else if (evento === "SIGNED_OUT") {
          setEmRecuperacaoSenha(false)
        }
      }
    )

    async function carregarSessao() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (!providerAtivo) return

        if (error) {
          setErroSessao(error.message)
        } else {
          setErroSessao(null)
          if (!eventoDeAutenticacaoRecebido) {
            atualizarUsuario(data.session)
          }
        }
      } catch (error) {
        if (providerAtivo) {
          setErroSessao(
            error instanceof Error ? error.message : String(error)
          )
        }
      } finally {
        if (providerAtivo) {
          setCarregandoSessao(false)
        }
      }
    }

    carregarSessao()

    return () => {
      providerAtivo = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let providerAtivo = true

    async function carregarFavoritos() {
      if (!userId) {
        setFavoritos([])
        setCarregandoFavoritos(false)
        return
      }

      setCarregandoFavoritos(true)
      setErroFavoritos(null)

      const { data, error } = await supabase
        .from("favorites")
        .select("id, user_id, movie_id, movie_title, poster_path, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!providerAtivo) return

      if (error) {
        setErroFavoritos(error.message)
        setFavoritos([])
      } else {
        setFavoritos(data)
      }
      setCarregandoFavoritos(false)
    }

    carregarFavoritos().catch(error => {
      if (providerAtivo) {
        setErroFavoritos(
          error instanceof Error ? error.message : String(error)
        )
        setFavoritos([])
        setCarregandoFavoritos(false)
      }
    })

    return () => {
      providerAtivo = false
    }
  }, [userId])

  async function cadastrar(email, password, nome) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nome },
        emailRedirectTo: `${window.location.origin}/Login`,
      },
    })

    if (error) throw error
    return data
  }

  async function entrar(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async function sair() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function solicitarRecuperacao(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperarSenha`,
    })

    if (error) throw error
  }

  async function atualizarSenha(password) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    setEmRecuperacaoSenha(false)
  }

  async function adicionarFavorito(filme) {
    if (!user) throw new Error("Entre na sua conta para salvar favoritos.")

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        movie_id: filme.id,
        movie_title: filme.title,
        poster_path: filme.poster_path ?? null,
      })
      .select("id, user_id, movie_id, movie_title, poster_path, created_at")
      .single()

    if (error?.code === "23505") {
      return favoritos.find(favorito => favorito.movie_id === filme.id) ?? null
    }
    if (error) throw error

    setFavoritos(current => [
      data,
      ...current.filter(favorito => favorito.movie_id !== filme.id),
    ])
    setErroFavoritos(null)
    return data
  }

  async function removerFavorito(movieId) {
    if (!user) throw new Error("Entre na sua conta para gerenciar favoritos.")

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("movie_id", movieId)
      .eq("user_id", user.id)

    if (error) throw error

    setFavoritos(current =>
      current.filter(favorito => favorito.movie_id !== movieId)
    )
    setErroFavoritos(null)
  }

  async function alternarFavorito(filme) {
    if (!user) throw new Error("Entre na sua conta para salvar favoritos.")

    const jaFavoritado = favoritos.some(
      favorito => favorito.movie_id === filme.id
    )

    if (jaFavoritado) {
      await removerFavorito(filme.id)
    } else {
      await adicionarFavorito(filme)
    }
  }

  const isLogado = Boolean(user)

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
      user,
      carregandoSessao,
      erroSessao,
      emRecuperacaoSenha,
      entrar,
      cadastrar,
      sair,
      solicitarRecuperacao,
      atualizarSenha,
      favoritos,
      carregandoFavoritos,
      erroFavoritos,
      alternarFavorito,
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
