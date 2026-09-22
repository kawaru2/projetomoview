import { useState } from 'react'
export function Home() {
  const simulador = [{
    title: "Mario Bros",
    year: 2010,
    average: 8.9,
  },
  {
    title: "Batman - Begins",
    year: 2006,
    average: 8.5,
  },
  {
    title: "A freira",
    year: 2018,
    average: 9.5,
  }]

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
                    <p className="voteAverage">⭐ {filme.average}</p>
                    <p className="filmeFavorite">&#x2764;&#xFE0F; 9.0</p>
                    <p className="filmeCategoria">Categorias</p>
                </div>
                  <div className={`overlayFilme ${cardHover === filme.title ? "active" : ""}`}>
                    <button type="button" onClick={(e) => setModalFilme(filme)}>Ver mais</button>
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
            <h2>{modalFilme.title}</h2>
            <p>{modalFilme.year}</p>
            <button type="button" onClick={() => setModalFilme(null)}>Fechar</button>
          </div>
        </div>
      )}
    </main>
  )
}