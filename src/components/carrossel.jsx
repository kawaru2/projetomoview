import { useRef } from "react"
import "./carrossel.css"
export function Carrossel({listaFilmes = []}) {
  const trilhoRef = useRef(null);
  const totalFilmes = listaFilmes.slice(0, 6)

  function moverCarrossel(direcao) {

    const trilho = trilhoRef.current;
    const quantidadeFilmes = totalFilmes.length;
    
    if(!trilho || quantidadeFilmes === 0) return;

    const largura = trilho.clientWidth;
    const inicio = trilho.scrollLeft <= 0;
    const fim = trilho.scrollLeft + largura >= trilho.scrollWidth -1;

    if (direcao === -1 && inicio) {
      trilho.scrollTo({
        left: (quantidadeFilmes - 1) * largura,
        behavior: "smooth",
      })
    } else if (direcao === 1 && fim) {
      trilho.scrollTo({
      left: 0,
      behavior: "smooth",
    })} else {
      trilho.scrollBy({
        left: direcao * trilho.clientWidth,
        behavior: "smooth",
      })}
  }
  return (
    <>
      <div className="carrossel">
        <button 
        type="button"
        className="botaoCarrossel botaoAnterior"
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
        className="botaoCarrossel botaoProximo"
        onClick={() => moverCarrossel(1)}
        >
          &gt;
        </button>
      </div>
    </>
  )
}