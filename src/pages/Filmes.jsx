import { useContext, useState } from "react"
import { MoviewContext } from "../context/criandoContexto"
import { ModalBio } from "../components/modalBio"
import { obterGeneros } from "../utils/obterGeneros"
import { Carrossel } from "../components/carrossel"
import "./Filmes.css"
export function Filmes() {
  const { filmesTopRated, generosFilmes, trendingFilmesWeek } = useContext(MoviewContext);
  const [ favoritar, setFavoritar ] = useState({});
  const [ modalBio, setModalBio ] = useState(null);

  // Teste do Node (back-end).

  // async function testeCarregarFilmes() {
  //   const resposta = await fetch("http://localhost:3000/filmes");
  //   if (!resposta.ok) throw new Error(`Erro na API: ${resposta.status}`);
  //   const dados = await resposta.json();
  //   console.log(dados.results);
  // }
  // testeCarregarFilmes().catch(console.error);
  return (
  <main className="conteudoPaginaFilmes">
    <h1 className="tituloCatalogo">Seja bem-vindo ao catálogo do Moview</h1>
    <h2 className="tituloCarrossel">Tendências da semana</h2>
    {/* CARROUSSEL */}
    <Carrossel listaFilmes={trendingFilmesWeek ?. results} />
    <h2 className="subTituloCatalogo">Filmes mais bem avaliados</h2>
    <ul className="listaDeFilmes">
      {filmesTopRated ?. results.map(filme => (
        <li key={filme ?. id} className="filmeDaLista">
          <img src={`http://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="posterPathDeFilmes" />
          <div className="dadosFilme">
            <div className="tituloEAnoFilme">
              <h3 className="tituloDoFilme redEffect">{filme.title}</h3>
              <p className="anoDoFilme redEffect">{filme.release_date.slice(0, 4) ?? "Sem informações"}</p>
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
              <p className="categoriasDoFilme">
                Categorias:<br/><span>{obterGeneros(filme.genre_ids, generosFilmes)}</span>
              </p>
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