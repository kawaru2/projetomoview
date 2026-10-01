import { useContext, useState } from "react"
import { MoviewContext } from "../context/context"
import { ModalBio } from "../components/modalBio"
export function Filmes() {
  const { dados, generosFilmes, indicacaoIdade } = useContext(MoviewContext);
  const [ favoritar, setFavoritar ] = useState({});
  const [ modalBio, setModalBio ] = useState(null);
  return (
  <main>
    <h1>Seja bem-vindo ao catálogo do Moview</h1>
    <h2>Filmes populares</h2>
    {/* CARROUSSEL */}
    <h2>Todos os filmes</h2>
    <ul className="listaDeFilmes">
      {dados ?. results.map(filme => (
        <li key={filme ?. id} className="filmeDaLista">
          <img src={`http://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="posterPathDeFilmes" />
          <div className="infoCardDeFilmes">
            <h3 className="filmeTituloDeFilmes">{filme.title}</h3>
            <p className="filmeAnoDeFilme">{filme.release_date.slice(0, 4) ?? "Sem informações"}</p>
            <div className="secaoClassificacaoDeFilmes">
              <p className="voteAverageDeFilmes">
                ⭐ {filme ?. vote_average.toFixed(1)}
              </p>
              <button 
              className="btnFavoritarDeFilmes"
              onClick={() => setFavoritar(prev => ({
                ...prev, [filme.title]: !prev[filme.title]
              }))}
              >
                {`${!favoritar[filme.title] ? "🤍" : "❤️"} ${filme ?. vote_count}`}
                </button>
            </div>
          </div>
          <button className="bioFilme" onClick={() => setModalBio(filme)}>Ler biografia</button>
        </li>
      ))}
    </ul>
    {modalBio && (
      <ModalBio 
      filme={modalBio} 
      setModal={() => setModalBio(null)}
      />)
    }
  </main>
  )
}