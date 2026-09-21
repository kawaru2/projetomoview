import {Link, NavLink} from 'react-router-dom'
import {useMoviewContext} from "../hooks/useMoviewContext"
import logo from '../assets/logo.svg'

export default function Header() {
  const {isLogado, user} = useMoviewContext();
  
  return (
    <header className="cabecalho">
      <div className="logoMarca">
        <Link 
          to="/" 
          title="Voltar ao início"
          onClick={() => console.log("Fechar menu")}
          end
        >
          <img src={logo} alt="" id="imgLogo" />
        </Link>
        <Link 
          to="/" 
          title="Voltar ao início"
          id="nomeEmpresa" 
          onClick={() => console.log("Fechar menu")} 
          end
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

        {
        !isLogado ?
        <NavLink
          to="/Login"
          className={({isActive}) => `menuOption ${isActive ? "menuAtivo" : ""}`}
        >
          Login
        </NavLink>
        :
        <NavLink>Olá, {user.nome}</NavLink>
        }
        
      </nav>
    </header>
  )
}