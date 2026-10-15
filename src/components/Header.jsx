import {Link, NavLink} from 'react-router-dom'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {useMoviewContext} from "../hooks/useMoviewContext"
import logo from '../assets/logo.svg'

export function Header() {
  const navigate = useNavigate()
  const {isLogado, user, carregandoSessao, sair, erroSessao} = useMoviewContext()
  const [carregandoLogout, setCarregandoLogout] = useState(false)
  const [erroLogout, setErroLogout] = useState(null)
  const nomeUsuario =
    user?.user_metadata?.full_name?.trim().split(/\s+/)[0] ||
    user?.email?.split("@")[0] ||
    "Conta"

  async function fazerLogout() {
    setErroLogout(null)
    setCarregandoLogout(true)
    try {
      await sair()
      navigate("/", { replace: true })
    } catch (error) {
      setErroLogout(error instanceof Error ? error.message : String(error))
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
        : <details className="menuConta">
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
      {(erroSessao || erroLogout) && (
        <p role="alert" className="authError">{erroSessao || erroLogout}</p>
      )}
    </header>
  )
}