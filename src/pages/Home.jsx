import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoviewContext } from '../context/context'

export function Home() {
  const { dados } = useContext(MoviewContext);

  const filmes = dados ?.results?.slice(0, 3) ?? [];

  const navigate = useNavigate();

  const [ cardHover, setCardHover ] = useState(null);
  const [ modalFilme, setModalFilme ] = useState(null);
  const [ checkFavorite, setCheckFavorite ] = useState({});

  return (
    <main>
      <div id="conteudoHome">
        <div id="apresentacao">
          {/* Olá, user. Seja... */}
          <h1 id="bemVindoUser">Olá, seja-vindo ao Moview!</h1>
          <p id="subTituloBemVindo">Pesquise sobre filmes, leia a biografia, veja a avaliação e muito mais!</p>
        </div>
        <div id="maisPopularesHome">
          <h2 id="tituloMaisPopulares">Os 3 filmes mais populares no momento:</h2>
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
                    <p className="filmeTitle">Titulo: {filme.title}</p>
                    <p className="filmeYear">Ano: {filme.release_date.slice(0, 4) ?? "Não informado"}</p>
                    <div className="classificacao">
                      <p className="voteAverage">⭐ {filme ?. vote_average.toFixed(1)}</p>
                      <p className="filmeFavorite">{!checkFavorite[filme.title] ? "🤍" : "❤️"} {filme ?. vote_count}</p>
                    </div>
                </div>
                  <div className={`overlayFilme ${cardHover === filme.title ? "active" : ""}`}>
                    <button type="button" className="btnVerMais" onClick={() => setModalFilme(filme)}>Ver mais</button>
                    <div className="secaoFavoritar">
                      <label htmlFor="checkFavorite">{!checkFavorite[filme.title] ? "Favoritar: " : "Favorito: "}</label>
                      <button id="checkFavorite" type="button" className="btnFavorite" name="checkFavorite" onClick={() => setCheckFavorite(prev => ({
                        ...prev,
                        [filme.title]: !prev[filme.title]
                      }))} >
                        {!checkFavorite[filme.title] ? "🤍" : "❤️"}
                      </button>
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
                <button className="btnFavorite btnFavoriteModal" onClick={() => setCheckFavorite(prev => ({
                  ...prev,
                  [modalFilme.title]: !prev[modalFilme.title]
                  }))} >
                  {!checkFavorite[modalFilme.title] ? "🤍" : "❤️"}
                  </button>
                  <img src="https://picsum.photos/35/35" alt="" className="indicacaoIdade" />
              </div>
              <p className="categoriaFilmeModal">{}</p>
              <p className="bioFilmeModal">{modalFilme ?. overview}</p>
              <button className="btnVerMaisFilmes" onClick={() => navigate("/filmes")}>Mais Filmes</button>
            </div>
            <button className="btnCloseModal" type="button" onClick={() => setModalFilme(null)}>
              <span className="linha"></span>
              <span className="linha"></span>
            </button>
          </div>
        </div>
      )}
    </main>
  )
}