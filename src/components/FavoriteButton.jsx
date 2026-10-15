import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useMoviewContext } from "../hooks/useMoviewContext"
import { mensagemErro } from "../utils/mensagemErro"

export function FavoriteButton({ filme, className = "btnFavorite" }) {
  const navigate = useNavigate()
  const {
    user,
    favoritos,
    carregandoFavoritos,
    alternarFavorito,
  } = useMoviewContext()
  const [salvando, setSalvando] = useState(false)
  const isFavorito = favoritos.some(
    favorito => String(favorito.movie_id) === String(filme.id)
  )

  async function lidarComClique() {
    if (!user) {
      toast.info("Entre na sua conta para adicionar filmes aos favoritos.")
      navigate("/Login")
      return
    }

    setSalvando(true)
    try {
      await alternarFavorito(filme)
      toast.success(isFavorito
        ? "Filme removido dos favoritos."
        : "Filme adicionado aos favoritos.")
    } catch (error) {
      toast.error(mensagemErro(error, "Não foi possível atualizar seus favoritos. Tente novamente."))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={lidarComClique}
        disabled={salvando || (user && carregandoFavoritos)}
        aria-pressed={isFavorito}
        aria-label={user
          ? `${isFavorito ? "Remover dos" : "Adicionar aos"} favoritos: ${filme.title}`
          : `Entre para favoritar ${filme.title}`}
      >
        {isFavorito ? "❤️" : "🤍"}
      </button>
    </>
  )
}
