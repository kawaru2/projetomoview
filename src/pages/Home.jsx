import { useState } from 'react'
export function Home() {
  const simulador = [{
    title: "Mario Bros",
    year: 2010,
    average: 8.9,
    isFavorite: false,
  },
  {
    title: "Batman - Begins",
    year: 2006,
    average: 8.5,
    isFavorite: false,
  },
  {
    title: "A freira",
    year: 2018,
    average: 9.5,
    isFavorite: false,
  }]

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
            {simulador.map((filme, key) => {
              return (
                <div 
                key={key} 
                className="cardFilme" 
                onMouseEnter={() => setCardHover(filme.title)} 
                onMouseLeave={() => setCardHover(null)}
                >
                  <img className="posterPath" src="https://picsum.photos/300/200" alt={filme.title} />
                  <div className="infoCardFilme">
                    <p className="filmeTitle">Titulo: {filme.title}</p>
                    <p className="filmeYear">Ano: {filme.year}</p>
                    <div className="classificacao">
                      <p className="voteAverage">⭐ {filme.average}</p>
                      <p className="filmeFavorite">{!checkFavorite[filme.title] ? "🤍" : "❤️"} 9.0</p>
                    </div>
                    <p className="filmeCategoria">Categorias</p>
                </div>
                  <div className={`overlayFilme ${cardHover === filme.title ? "active" : ""}`}>
                    <button type="button" className="btnVerMais" onClick={() => setModalFilme(filme)}>Ver mais</button>
                    <div className="secaoFavoritar">
                      <label htmlFor="checkFavorite">Favoritar: </label>
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
            <img className="posterFilmeModal" src="https://picsum.photos/400/200" alt={modalFilme.title} />
            <div className="filmeInfoModal">
              <h2 className="filmeTitle">{modalFilme.title}</h2>
              <p className="filmeAno">{modalFilme.year}</p>
              <p className="popularidadeFilmeModal">Popularidade: {modalFilme.average}</p>
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