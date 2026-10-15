import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoviewContext } from '../context/criandoContexto'
import { FavoriteButton } from '../components/FavoriteButton'
import { obterClassiIndicativa } from '../utils/obterClassiIndicativa';
import { obterGeneros } from "../utils/obterGeneros"
import "../components/modalBio.css"

export function Home() {
  const { filmesPopulares, generosFilmes, indicacaoIdade } = useContext(MoviewContext);
  const filmes = filmesPopulares ?.results?.slice(0, 3) ?? [];
  const navigate = useNavigate();
  const [ cardHover, setCardHover ] = useState(null);
  const [ modalFilme, setModalFilme ] = useState(null);

  return (
    <main>
      <div id="conteudoHome">
        <div id="apresentacao">
          {/* Olá, user. Seja... */}
          <h1 id="bemVindoUser">Olá, seja-vindo ao Moview!</h1>
          <p id="subTituloBemVindo">Pesquise sobre filmes, leia a biografia, veja a avaliação e muito mais!</p>
        </div>
        <div id="maisPopularesHome">
          <h2 id="tituloMaisPopulares">Os 3 filmes com destaques no momento:</h2>
          <div id="filmes">
            { filmes.map(filme => {
              return (
                <div 
                key={filme ?.id} 
                className="cardFilme" 
                onMouseEnter={() => setCardHover(filme.title)}
                onMouseLeave={() => setCardHover(null)}
                >
                  <img className="posterPath" src={`http://image.tmdb.org/t/p/w200${filme.poster_path}`} alt={filme.title} />
                  <div className="infoCardFilme">
                    <p className="filmeTitle">Titulo: <span className="redEffect">{filme.title}</span></p>
                    <p className="filmeYear">Ano: <span className="redEffect">{filme.release_date.slice(0, 4) ?? "Sem informações"}</span></p>
                    <div className="classificacao">
                      <p className="voteAverage">⭐ {filme ?. vote_average.toFixed(1)}</p>
                      <p className="filmeFavorite">⭐ {filme ?. vote_count}</p>
                    </div>
                    <p className="categorias redEffect">{
                      obterGeneros(filme.genre_ids, generosFilmes)
                    }
                    </p>
                </div>
                  <div className={`overlayFilme ${cardHover === filme.title ? "active" : ""}`}>
                    <button type="button" className="btnVerMais" onClick={() => {
                      setModalFilme(filme);
                    }}>Ver mais</button>
                    <div className="secaoFavoritar">
                      <span>Favoritar:</span>
                      <FavoriteButton filme={filme} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* MODAL */}
      {modalFilme && (
        <div className="modalOverlay" onClick={() => setModalFilme(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            {/* conteúdo do modal */}
            <img className="posterFilmeModal" src={`https://image.tmdb.org/t/p/w500${modalFilme ?. poster_path}`} alt={modalFilme.title} />
            <div className="filmeInfoModal">
              <div className="infoInicioModal">
                <h2 className="filmeTitle" id="filmeTitleModal"><span className="redEffect">Titulo: </span>{modalFilme.title}</h2>
                <p className="filmeAno"><span className="redEffect">Ano: </span>{modalFilme ?. release_date.slice(0, 4) ?? "Não informado"}</p>
              </div>
              <div className="secaoFavoritar" id="secaoFavoritarModal">
                <p className="popularidadeFilmeModal">Popularidade ⭐: {modalFilme ?. vote_average.toFixed(1)}</p>
                <FavoriteButton
                  filme={modalFilme}
                  className="btnFavorite btnFavoriteModal"
                />
                  <p className={`indicacaoIdade ${obterClassiIndicativa(indicacaoIdade[modalFilme.id])}`}>
                    {indicacaoIdade[modalFilme.id]}
                  </p>
              </div>
              <p className="categoriaFilmeModal">{}</p>
              <p className="bioFilmeModal">{modalFilme ?. overview}</p>
              <button className="btnVerMaisFilmes" onClick={() => navigate("/filmes")}>Mais Filmes</button>
            </div>
            <div className="btnCloseModal" type="button" onClick={() => setModalFilme(null)}>
              <span className="linha"></span>
              <span className="linha"></span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}