import { useEffect, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FavoriteButton } from "../components/FavoriteButton"
import { ModalBio } from "../components/modalBio"
import { useMoviewContext } from "../hooks/useMoviewContext"
import { mensagemErro } from "../utils/mensagemErro"
import "./Filmes.css"
import "./Favoritos.css"

export function Favoritos() {
  const {
    user,
    carregandoSessao,
    favoritos,
    carregandoFavoritos,
    erroFavoritos,
  } = useMoviewContext()
  const [filmeBiografia, setFilmeBiografia] = useState(null)
  const [carregandoBiografiaId, setCarregandoBiografiaId] = useState(null)
  const [detalhesFilmes, setDetalhesFilmes] = useState({})
  const [falhasDetalhes, setFalhasDetalhes] = useState({})
  const cacheDetalhes = useRef(new Map())

  async function carregarDetalhes(favorito) {
    if (!cacheDetalhes.current.has(favorito.movie_id)) {
      const requisicao = (async () => {
        const query = new URLSearchParams({
          endpoint: `movie/${favorito.movie_id}`,
          language: "pt-BR",
        })
        const response = await fetch(`/api/tmdb?${query}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Não foi possível carregar a biografia do filme.")
        }

        return {
          ...data,
          poster_path: data.poster_path ?? favorito.poster_path,
          genre_ids: data.genres?.map(genero => genero.id) ?? [],
        }
      })()
      cacheDetalhes.current.set(favorito.movie_id, requisicao)

      requisicao.catch(() => {
        cacheDetalhes.current.delete(favorito.movie_id)
      })
    }

    return cacheDetalhes.current.get(favorito.movie_id)
  }

  useEffect(() => {
    let ativo = true

    async function carregarSinopses() {
      const resultados = await Promise.allSettled(
        favoritos.map(async favorito => [
          favorito.movie_id,
          await carregarDetalhes(favorito),
        ])
      )

      if (!ativo) return

      const detalhes = Object.fromEntries(
        resultados
          .filter(resultado => resultado.status === "fulfilled")
          .map(resultado => resultado.value)
      )
      const falhas = Object.fromEntries(
        resultados.flatMap((resultado, index) =>
          resultado.status === "rejected"
            ? [[favoritos[index].movie_id, true]]
            : []
        )
      )
      setDetalhesFilmes(current => ({ ...current, ...detalhes }))
      setFalhasDetalhes(current => ({ ...current, ...falhas }))

      if (resultados.some(resultado => resultado.status === "rejected")) {
        toast.error("Não foi possível carregar a sinopse de um ou mais filmes.", {
          toastId: "erro-sinopses-favoritos",
        })
      }
    }

    if (favoritos.length > 0) {
      carregarSinopses()
    }

    return () => {
      ativo = false
    }
  }, [favoritos])

  async function abrirBiografia(favorito) {
    setCarregandoBiografiaId(favorito.movie_id)

    try {
      const detalhes = await carregarDetalhes(favorito)
      setDetalhesFilmes(current => ({
        ...current,
        [favorito.movie_id]: detalhes,
      }))
      setFalhasDetalhes(current => ({
        ...current,
        [favorito.movie_id]: false,
      }))
      setFilmeBiografia(detalhes)
    } catch (error) {
      console.error("Erro ao carregar biografia do filme:", error)
      toast.error(mensagemErro(error, "Não foi possível carregar a biografia do filme."))
    } finally {
      setCarregandoBiografiaId(null)
    }
  }

  useEffect(() => {
    if (erroFavoritos) {
      toast.error(mensagemErro(erroFavoritos, "Não foi possível carregar seus favoritos."), {
        toastId: `erro-favoritos-${user?.id}`,
      })
    } else if (!carregandoFavoritos && user && favoritos.length === 0) {
      toast.info("Você ainda não adicionou filmes aos favoritos.", {
        toastId: `favoritos-vazios-${user.id}`,
      })
    }
  }, [carregandoFavoritos, erroFavoritos, favoritos.length, user])

  if (carregandoSessao) {
    return <main className="paginaFavoritos"><p>Verificando sua sessão...</p></main>
  }

  if (!user) {
    return <Navigate to="/Login" replace />
  }

  return (
    <main className="paginaFavoritos">
      <h1>Meus favoritos</h1>
      {carregandoFavoritos && <p role="status">Carregando seus favoritos...</p>}
      {!carregandoFavoritos && favoritos.length > 0 && (
        <ul className="listaFavoritos">
          {favoritos.map(favorito => (
            <li className="itemFavorito filmeDaLista" key={`${favorito.user_id}-${favorito.movie_id}`}>
              {favorito.poster_path
                ? <img
                    src={`https://image.tmdb.org/t/p/w200${favorito.poster_path}`}
                    alt={`Pôster de ${favorito.movie_title}`}
                    className="posterPathDeFilmes"
                  />
                : <div className="posterFavoritoVazio posterPathDeFilmes">Sem pôster</div>}
              <div className="dadosFilme">
                <div className="tituloEAnoFilme">
                  <h2 className="tituloDoFilme redEffect">{favorito.movie_title}</h2>
                </div>
                <p className="sinopseFavorito">
                  {detalhesFilmes[favorito.movie_id]?.overview?.trim() ||
                    (falhasDetalhes[favorito.movie_id]
                      ? "Sinopse indisponível."
                      : detalhesFilmes[favorito.movie_id]
                        ? "Sem informações de sinopse."
                        : "Carregando sinopse...")}
                </p>
                <div className="secaoClassificacaoDeFilmes">
                  <FavoriteButton
                    filme={{
                      id: favorito.movie_id,
                      title: favorito.movie_title,
                      poster_path: favorito.poster_path,
                    }}
                    className="btnFavoritarFilme"
                  />
                  <button
                    type="button"
                    className="btnBioFilme"
                    onClick={() => abrirBiografia(favorito)}
                    disabled={carregandoBiografiaId === favorito.movie_id}
                  >
                    {carregandoBiografiaId === favorito.movie_id
                      ? "Carregando..."
                      : "Ler biografia"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/Filmes">Explorar filmes</Link>
      {filmeBiografia && (
        <ModalBio
          filme={filmeBiografia}
          setModal={() => setFilmeBiografia(null)}
        />
      )}
    </main>
  )
}
