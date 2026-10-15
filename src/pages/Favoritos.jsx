import { Link, Navigate } from "react-router-dom"
import { FavoriteButton } from "../components/FavoriteButton"
import { useMoviewContext } from "../hooks/useMoviewContext"
import "./Favoritos.css"

export function Favoritos() {
  const {
    user,
    carregandoSessao,
    favoritos,
    carregandoFavoritos,
    erroFavoritos,
  } = useMoviewContext()

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
      {erroFavoritos && <p role="alert" className="mensagemErro">{erroFavoritos}</p>}
      {!carregandoFavoritos && !erroFavoritos && favoritos.length === 0 && (
        <p>Você ainda não adicionou filmes aos favoritos.</p>
      )}
      {!carregandoFavoritos && favoritos.length > 0 && (
        <ul className="listaFavoritos">
          {favoritos.map(favorito => (
            <li className="itemFavorito" key={favorito.id}>
              {favorito.poster_path
                ? <img
                    src={`https://image.tmdb.org/t/p/w200${favorito.poster_path}`}
                    alt={`Pôster de ${favorito.movie_title}`}
                  />
                : <div className="posterFavoritoVazio">Sem pôster</div>}
              <div>
                <h2>{favorito.movie_title}</h2>
                <FavoriteButton
                  filme={{
                    id: favorito.movie_id,
                    title: favorito.movie_title,
                    poster_path: favorito.poster_path,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/Filmes">Explorar filmes</Link>
    </main>
  )
}
