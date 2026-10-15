import {Link, NavLink} from 'react-router-dom'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {useMoviewContext} from "../hooks/useMoviewContext"
import { mensagemErro } from "../utils/mensagemErro"
import logo from '../assets/logo.svg'

export function Header() {
  const navigate = useNavigate()
  const {isLogado, user, carregandoSessao, sair, erroSessao} = useMoviewContext()
  const [carregandoLogout, setCarregandoLogout] = useState(false)
  const nomeUsuario =
    user?.user_metadata?.full_name?.trim().split(/\s+/)[0] ||
    user?.email?.split("@")[0] ||
    "Conta"

  useEffect(() => {
    if (erroSessao) {
      toast.error(mensagemErro(erroSessao, "Não foi possível verificar sua sessão."), {
        toastId: "erro-sessao",
      })
    }
  }, [erroSessao])

  async function fazerLogout() {
    setCarregandoLogout(true)
    try {
      await sair()
      navigate("/", { replace: true })
    } catch (error) {
      toast.error(mensagemErro(error, "Não foi possível sair da conta. Tente novamente."))
    } finally {
      setCarregandoLogout(false)
    }
  }
  
  return (
    <header className="cabecalho">
      <div className="logoMarca">
        <Link 
          to="/" 
          title="Voltar ao início"
          onClick={() => console.log("Fechar menu")}
        >
          <img src={logo} alt="" id="imgLogo" />
        </Link>
        <Link 
          to="/" 
          title="Voltar ao início"
          id="nomeEmpresa" 
          onClick={() => console.log("Fechar menu")} 
        >
        Moview
        </Link>
      </div>
      <nav className="menu">
        <NavLink
          to="/"
          className={({isActive}) => `menuOption ${isActive ? "menuAtivo" : ""}`}
          end
        >
          Início
        </NavLink>

        <NavLink
          to="/Filmes"
          className={({isActive}) => `menuOption ${isActive ? "menuAtivo" : ""}`}
        >
          Filmes
        </NavLink>

        <NavLink
          to="/Sobre"
          className={({isActive}) => `menuOption ${isActive ? "menuAtivo" : ""}`}
        >
          Sobre
        </NavLink>

        {!carregandoSessao && (!isLogado ?
        <NavLink
          to="/Login"
          className={({isActive}) => `menuOption ${isActive ? "menuAtivo" : ""}`}
        >
          Login
        </NavLink>
        : <details
            className="menuConta"
            onMouseLeave={event => {
              event.currentTarget.open = false
            }}
          >
            <summary
              className="menuOption menuContaResumo"
            >
              {nomeUsuario}
            </summary>
            <div className="menuContaDropdown">
              <NavLink
                to="/favoritos"
                className={({isActive}) => `menuOption ${isActive ? "menuAtivo" : ""}`}
              >
                Meus favoritos
              </NavLink>
              <button
                type="button"
                className="menuOption"
                onClick={fazerLogout}
                disabled={carregandoLogout}
              >
                {carregandoLogout ? "Saindo..." : "Sair"}
              </button>
            </div>
          </details>)}
        
      </nav>
    </header>
  )
}