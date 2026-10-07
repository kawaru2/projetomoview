import "./Sobre.css"

const tecnologias = [
  { nome: "React", detalhe: "Interface e componentes" },
  { nome: "Vite", detalhe: "Desenvolvimento e build" },
  { nome: "React Router", detalhe: "Navegação entre páginas" },
  { nome: "React Toastify", detalhe: "Mensagens de feedback" },
  { nome: "CSS", detalhe: "Estilos e responsividade" },
  { nome: "TMDB API", detalhe: "Informações sobre filmes" },
]

const redesSociais = ["GitHub", "LinkedIn", "Instagram"]

export function Sobre() {
  return (
    <main className="paginaSobre">
      <section className="sobreApresentacaoPrincipal" aria-labelledby="tituloSobre">
        <div className="sobreApresentacaoConteudo">
          <p className="sobreRotuloSecao">POR TRÁS DA TELA</p>
          <h1 id="tituloSobre">Sobre o <span>Moview</span></h1>
          <p className="sobreApresentacaoResumo">
            Um projeto feito para quem ama descobrir histórias — e para explorar
            como tecnologia e entretenimento podem se encontrar em uma experiência
            simples, bonita e intuitiva.
          </p>
          <a className="sobreApresentacaoLinkProjeto" href="#projeto">
            Conheça o projeto <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="sobreApresentacaoArte" aria-hidden="true">
          <span className="sobreApresentacaoDisco" />
          <span className="sobreApresentacaoMonograma">M</span>
          <span className="sobreApresentacaoLegenda">MOVIEW · CINEMA · HISTÓRIAS</span>
        </div>
      </section>

      <section className="sobreSecaoConteudo sobreProjeto" id="projeto" aria-labelledby="tituloProjeto">
        <div className="sobreSecaoCabecalho">
          <p className="sobreRotuloSecao">A IDEIA</p>
          <h2 id="tituloProjeto">Um lugar para encontrar seu próximo filme</h2>
        </div>
        <p className="sobreDescricaoProjeto">
          O Moview é um projeto front-end inspirado em plataformas de cinema.
          Ele reúne tendências e filmes bem avaliados, com informações para
          ajudar você a escolher o que assistir. A interface também conta com
          navegação entre páginas, favoritos e uma experiência demonstrativa
          de login e cadastro.
        </p>
        <div className="sobreProjetoBeneficios">
          <article className="sobreProjetoBeneficio">
            <span className="sobreProjetoBeneficioNumero">01</span>
            <h3>Descobrir</h3>
            <p>Explore tendências e encontre filmes que combinam com seu momento.</p>
          </article>
          <article className="sobreProjetoBeneficio">
            <span className="sobreProjetoBeneficioNumero">02</span>
            <h3>Conhecer</h3>
            <p>Consulte informações e detalhes para saber mais sobre cada título.</p>
          </article>
          <article className="sobreProjetoBeneficio">
            <span className="sobreProjetoBeneficioNumero">03</span>
            <h3>Construir</h3>
            <p>Um espaço de aprendizado, criado para evoluir a cada nova ideia.</p>
          </article>
        </div>
      </section>

      <section className="sobreSecaoConteudo sobreDesenvolvedor" aria-labelledby="tituloAutor">
        <div className="sobreDesenvolvedorAvatar" aria-hidden="true">M</div>
        <div className="sobreDesenvolvedorApresentacao">
          <p className="sobreRotuloSecao">QUEM CRIOU</p>
          <h2 id="tituloAutor">
            Olá, eu sou <span>João Barros</span><br/>
            <span className="sobreDesenvolvedorApelido">(Kawaru2)</span>
          </h2>
          <p>
            Sou o desenvolvedor por trás do Moview. Criei este projeto para
            praticar desenvolvimento front-end e transformar meu interesse por
            tecnologia e cinema em uma experiência que outras pessoas possam
            explorar. Estou sempre aprendendo e buscando novas formas de melhorar
            o projeto.
          </p>
        </div>
        <div className="sobreDesenvolvedorRedesSociais">
          <h3>Vamos nos conectar</h3>
          <p>Adicione seus perfis para que as pessoas possam encontrar você.</p>
          <ul>
            {redesSociais.map((rede) => (
              <li key={rede}>
                <span>{rede}</span>
                <span className="sobreRedeSocialLinkPlaceholder">adicione seu link <span aria-hidden="true">↗</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sobreSecaoConteudo sobreStackTecnologica" aria-labelledby="tituloTecnologias">
        <div className="sobreSecaoCabecalho">
          <p className="sobreRotuloSecao">FEITO COM</p>
          <h2 id="tituloTecnologias">Tecnologias do projeto</h2>
          <p className="sobreDescricaoTecnologias">
            Ferramentas usadas para criar a interface, organizar a navegação e
            carregar informações de filmes.
          </p>
        </div>
        <ul className="sobreStackLista">
          {tecnologias.map((tecnologia) => (
            <li className="sobreStackItem" key={tecnologia.nome}>
              <span className="sobreStackItemIndicador" aria-hidden="true" />
              <div>
                <h3>{tecnologia.nome}</h3>
                <p>{tecnologia.detalhe}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="sobreStackCredito">
          Os dados de filmes são fornecidos pela TMDB. Este projeto não é
          afiliado nem endossado pela TMDB.
        </p>
      </section>
    </main>
  )
}
