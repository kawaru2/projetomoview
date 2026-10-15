import { useState, useEffect, useRef } from "react"
import { MoviewContext } from "./criandoContexto"
import { supabase, supabaseConfigError } from "../service/supabase"
import { mensagemErro } from "../utils/mensagemErro"

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
  const [carregandoSessao, setCarregandoSessao] = useState(Boolean(supabase))
  const [erroAutenticacao, setErroAutenticacao] = useState(null)
  const [emRecuperacaoSenha, setEmRecuperacaoSenha] = useState(false)
  const [favoritos, setFavoritos] = useState([])
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(false)
  const [erroFavoritos, setErroFavoritos] = useState(null)
  const userIdAtual = useRef(null)
  const userId = user?.id ?? null
  const erroSessao = supabase ? erroAutenticacao : supabaseConfigError
  const [filmesTopRated, setFilmesTopRated] = useState(null)
  const [generosFilmes, setGenerosFilmes] = useState([])
  const [indicacaoIdade, setIndicacaoIdade] = useState(null)
  const [filmesPopulares, setFilmesPopulares] = useState(null)
  const [trendingFilmesWeek, setTrendingFilmesWeek] = useState(null)

  useEffect(() => {
    let providerAtivo = true
    let eventoDeAutenticacaoRecebido = false

    if (!supabase) {
      return
    }

    function atualizarUsuario(session) {
      const novoUsuario = session?.user ?? null
      const novoUserId = novoUsuario?.id ?? null

      if (userIdAtual.current !== novoUserId) {
        userIdAtual.current = novoUserId
        setFavoritos([])
        setErroFavoritos(null)
        setCarregandoFavoritos(Boolean(novoUserId))
      }

      setUser(novoUsuario)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (evento, session) => {
        eventoDeAutenticacaoRecebido = true
        atualizarUsuario(session)
        setErroAutenticacao(null)
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
          setErroAutenticacao(
            mensagemErro(error, "Não foi possível verificar sua sessão.")
          )
        } else {
          setErroAutenticacao(null)
          if (!eventoDeAutenticacaoRecebido) {
            atualizarUsuario(data.session)
          }
        }
      } catch (error) {
        if (providerAtivo) {
          setErroAutenticacao(
            mensagemErro(error, "Não foi possível verificar sua sessão.")
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
          mensagemErro(error, "Não foi possível carregar seus favoritos.")
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
    if (!supabase) throw new Error(supabaseConfigError)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nome },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  }

  async function entrar(email, password) {
    if (!supabase) throw new Error(supabaseConfigError)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async function sair() {
    if (!supabase) throw new Error(supabaseConfigError)

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function solicitarRecuperacao(email) {
    if (!supabase) throw new Error(supabaseConfigError)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperarSenha`,
    })

    if (error) throw error
  }

  async function atualizarSenha(password) {
    if (!supabase) throw new Error(supabaseConfigError)

    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    setEmRecuperacaoSenha(false)
  }

  async function adicionarFavorito(filme) {
    if (!user) throw new Error("Entre na sua conta para salvar favoritos.")
    if (!supabase) throw new Error(supabaseConfigError)

    const movieId = Number(filme.id)
    if (!Number.isSafeInteger(movieId)) {
      throw new Error("Não foi possível identificar este filme para salvá-lo.")
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        movie_id: movieId,
        movie_title: filme.title,
        poster_path: filme.poster_path ?? null,
      })
      .select("id, user_id, movie_id, movie_title, poster_path, created_at")
      .single()

    if (error?.code === "23505") {
      const { data: favoritoExistente, error: erroBusca } = await supabase
        .from("favorites")
        .select("id, user_id, movie_id, movie_title, poster_path, created_at")
        .eq("user_id", user.id)
        .eq("movie_id", movieId)
        .single()

      if (erroBusca) throw erroBusca

      setFavoritos(current => [
        favoritoExistente,
        ...current.filter(favorito => favorito.movie_id !== movieId),
      ])
      return favoritoExistente
    }
    if (error) throw error

    setFavoritos(current => [
      data,
      ...current.filter(favorito => favorito.movie_id !== movieId),
    ])
    setErroFavoritos(null)
    return data
  }

  async function removerFavorito(movieId) {
    if (!user) throw new Error("Entre na sua conta para gerenciar favoritos.")
    if (!supabase) throw new Error(supabaseConfigError)

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
      favorito => String(favorito.movie_id) === String(filme.id)
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
