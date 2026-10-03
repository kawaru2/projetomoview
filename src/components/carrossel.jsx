import { useRef, useState } from "react"
import "./carrossel.css"
export function Carrossel({listaFilmes = []}) {
  const trilhoRef = useRef(null);
  const totalFilmes = listaFilmes.slice(0, 6)
  const [ visible, setVisible ] = useState(false);
  const [ filmeAtual, setFilmeAtual ] = useState(0);
  function moverCarrossel(direcao) {

    const trilho = trilhoRef.current;
    const quantidadeFilmes = totalFilmes.length;
    let proximoFilme

    if(!trilho || quantidadeFilmes === 0) return;

    if (direcao === 1) {
      proximoFilme = filmeAtual === quantidadeFilmes - 1 ? 0 : filmeAtual + 1;
    } else {
      proximoFilme = filmeAtual === 0 ? quantidadeFilmes - 1 : filmeAtual - 1;
    }

    setFilmeAtual(proximoFilme);
    trilho.scrollTo({
      left: proximoFilme * trilho.clientWidth,
      behavior: "smooth",
    })
  }

  return (
    <>
      <div className="carrossel" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        <button 
        type="button"
        className={`botaoCarrossel botaoAnterior ${visible ? "visible" : ""}`}
        onClick={() => moverCarrossel(-1)}
        >
          &lt;
        </button>
        <ul className="trilhoCarrossel" ref={trilhoRef}>
          {totalFilmes.map(filme => (
            <li key={filme.id} className="itemCarrossel">
              <img 
              src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} 
              alt={filme.title.length == 0 ? "Sem título" : filme.title} 
              />
              <h3>{filme.title}</h3>
              <p>{filme.release_date.slice(0, 4) ?? "Sem informações"}</p>
            </li>
            ))}
        </ul>
        <button 
        type="button"
        className={`botaoCarrossel botaoProximo ${visible ? "visible" : ""}`}
        onClick={() => moverCarrossel(1)}
        >
          &gt;
        </button>
        <nav className="indicadoresCarrossel">
          {totalFilmes.map((filme, index) => (
            <span
            key={filme.id}
            className={`indicadorCarrossel ${filmeAtual === index ? "indicador" : ""}`}
            >

            </span>
          )) }
        </nav>
      </div>
    </>
  )
}