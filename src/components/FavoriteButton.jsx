import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMoviewContext } from "../hooks/useMoviewContext"

export function FavoriteButton({ filme, className = "btnFavorite" }) {
  const navigate = useNavigate()
  const {
    user,
    favoritos,
    carregandoFavoritos,
    alternarFavorito,
  } = useMoviewContext()
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)
  const isFavorito = favoritos.some(
    favorito => favorito.movie_id === filme.id
  )

  async function lidarComClique() {
    setErro(null)

    if (!user) {
      navigate("/Login")
      return
    }

    setSalvando(true)
    try {
      await alternarFavorito(filme)
    } catch (error) {
      setErro(error instanceof Error ? error.message : String(error))
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
      {erro && <small role="alert" className="favoriteError">{erro}</small>}
    </>
  )
}
