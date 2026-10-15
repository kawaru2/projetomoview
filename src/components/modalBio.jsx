import { obterClassiIndicativa } from "../utils/obterClassiIndicativa"
import { MoviewContext } from "../context/criandoContexto"
import { useContext } from "react"
import { obterGeneros } from "../utils/obterGeneros"
import { FavoriteButton } from "./FavoriteButton"
import "./modalBio.css"
export function ModalBio({ filme, setModal }) {
  const { indicacaoIdade, generosFilmes } = useContext(MoviewContext);

  return (
    <div className="sobreposicaoModal" onClick={setModal}>
      <div className="conteudoDoModal" onClick={(e) => e.stopPropagation()}>
      <div className="btnFecharModal" onClick={setModal}>
        <span className="linhaModal"></span>
        <span className="linhaModal"></span>
      </div>
        <img className="imageFilme" src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt="" />
        <div className="informacoesFilme">
          <div className="nomeEAnoDoFilme">
            <h3 className="nomeDoFilme redEffect">
              {filme.title}
            </h3>
            <p className="lancamentoDoFilme">
              {filme.release_date?.slice(0, 4) ?? "Sem informações"}
            </p>
            {indicacaoIdade[filme.id] && (
              <p className={`classificacaoIndicativa ${obterClassiIndicativa(indicacaoIdade[filme.id])}`}>
                {indicacaoIdade[filme.id]}
              </p>
            )}
          </div>
          <p className="sinopse">
            {filme.overview?.trim() || "Sem informações"}
          </p>
          <p>{obterGeneros(filme.genre_ids ?? [], generosFilmes)}</p>
          <div className="acoesModalBio">
            <FavoriteButton
              filme={filme}
              className="btnFavoritoModalBio"
              showLabel
            />
            <button
              type="button"
              className="btnVerMaisFilmes"
              onClick={setModal}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}