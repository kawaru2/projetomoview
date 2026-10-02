import { obterClassiIndicativa } from "../utils/obterClassiIndicativa"
import { MoviewContext } from "../context/context"
import { useContext } from "react"
export function ModalBio({ filme, setModal }) {
  const { indicacaoIdade } = useContext(MoviewContext);
  return (
    <div className="modalOverlay" onClick={setModal}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <img className="posterFilmeModal" src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt="" />
        <div className="infoInicioModal">
          <h3 className="filmeTitle" id="filmeTitleModal">
            {filme.title}
          </h3>
          <p className="filmeAno">
            {filme.release_date.slice(0, 4)}
          </p>
          <p className={`indicacaoIdade ${obterClassiIndicativa(indicacaoIdade[filme.id])}`}>
            {indicacaoIdade[filme.id]}
          </p>
        </div>
        <div className="secaoFavoritar">
        </div>
        <p className="bioFilmeModal">
          {filme.overview}
        </p>
        <button className="btnVerMaisFilmes" onClick={setModal}>
          Fechar
        </button>
      </div>
    </div>
  )
}