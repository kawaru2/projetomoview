import { useContext, useState } from "react"
import { MoviewContext } from "../context/context"
import { ModalBio } from "../components/modalBio"
import "./Filmes.css"
export function Filmes() {
  const { dados, generosFilmes, indicacaoIdade } = useContext(MoviewContext);
  const [ favoritar, setFavoritar ] = useState({});
  const [ modalBio, setModalBio ] = useState(null);
  return (
  <main className="conteudoPaginaFilmes">
    <h1 className="tituloCatalogo">Seja bem-vindo ao catálogo do Moview</h1>
    <h2 className="tituloCarrossel">Filmes populares</h2>
    {/* CARROUSSEL */}
    <h2 className="subTituloCatalogo">Todos os filmes</h2>
    <ul className="listaDeFilmes">
      {dados ?. results.map(filme => (
        <li key={filme ?. id} className="filmeDaLista">
          <img src={`http://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="posterPathDeFilmes" />
          <div className="dadosFilme">
            <div className="tituloEAnoFilme">
              <h3 className="tituloDoFilme">{filme.title}</h3>
              <p className="anoDoFilme">{filme.release_date.slice(0, 4) ?? "Sem informações"}</p>
            </div>
            <div className="secaoClassificacaoDeFilmes">
              <p className="voteAverageDeFilmes">
                ⭐ {filme ?. vote_average.toFixed(1)}
              </p>
              <button
              className="btnFavoritarFilme"
              onClick={() => setFavoritar(prev => ({
                ...prev, [filme.title]: !prev[filme.title]
              }))}
              >
                {`${!favoritar[filme.title] ? "🤍" : "❤️"} ${filme ?. vote_count}`}
                </button>
            </div>
            <button className="btnBioFilme" onClick={() => setModalBio(filme)}>Ler biografia</button>
          </div>
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