import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useMoviewContext } from "../hooks/useMoviewContext"
import "react-toastify/dist/ReactToastify.css"

export function Login() {
  const navigate = useNavigate()
  const { entrar, cadastrar, isLogado, carregandoSessao } = useMoviewContext()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [nome, setNome] = useState("")
  const [emailCadastro, setEmailCadastro] = useState("")
  const [senhaCadastro, setSenhaCadastro] = useState("")
  const [changeForm, setChangeForm] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  if (!carregandoSessao && isLogado) {
    return <Navigate to="/favoritos" replace />
  }

  async function enviarLogin(event) {
    event.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await entrar(email.trim(), senha)
      navigate("/", { replace: true })
    } catch (error) {
      setErro(error instanceof Error ? error.message : String(error))
    } finally {
      setCarregando(false)
    }
  }

  async function enviarCadastro(event) {
    event.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      const data = await cadastrar(
        emailCadastro.trim(),
        senhaCadastro,
        nome.trim()
      )

      if (!data.session) {
        toast.success("Conta criada. Confira seu e-mail para confirmar o cadastro.")
        setChangeForm(false)
      } else {
        navigate("/", { replace: true })
      }
      setNome("")
      setEmailCadastro("")
      setSenhaCadastro("")
    } catch (error) {
      setErro(error instanceof Error ? error.message : String(error))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="telaLogin">
      <div className="containerForm effect">
        <div className={`containerFormChange ${changeForm ? "isActive" : ""}`}>
          <form className="form front" onSubmit={enviarLogin}>
            <h1 className="titleLogin">Moview</h1>
            <button
              type="button"
              id="btnRegister"
              onClick={() => {
                setErro(null)
                setChangeForm(true)
              }}
            >
              Criar conta
            </button>
            <div className="camposLoginSenha">
              <input
                type="email"
                name="email"
                id="login"
                className="campo"
                autoComplete="email"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
              <label htmlFor="login" id="placeholderLogin">E-mail</label>
              <input
                type="password"
                name="senha"
                id="senha"
                className="campo"
                autoComplete="current-password"
                required
                value={senha}
                onChange={event => setSenha(event.target.value)}
              />
              <label htmlFor="senha" id="placeholderSenha">Senha</label>
            </div>
            {erro && !changeForm && <p className="authError" role="alert">{erro}</p>}
            <div className="entrarOuMudarSenha">
              <button
                type="submit"
                className="btnEntrar"
                disabled={carregando || carregandoSessao}
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>
              <button
                type="button"
                className="btnEsqueciSenha"
                onClick={() => navigate("/recuperarSenha")}
              >
                Esqueceu a senha?
              </button>
            </div>
          </form>

          <form className="form back" onSubmit={enviarCadastro}>
            <h2 className="titleFormBack">Criar conta</h2>
            <div className="camposLoginSenha">
              <input
                autoComplete="name"
                type="text"
                className="campo"
                id="novoNome"
                required
                value={nome}
                onChange={event => setNome(event.target.value)}
              />
              <label htmlFor="novoNome" id="placeholderNovoNome">Nome completo</label>
              <input
                autoComplete="email"
                type="email"
                className="campo"
                id="novoId"
                required
                value={emailCadastro}
                onChange={event => setEmailCadastro(event.target.value)}
              />
              <label htmlFor="novoId" id="placeholderNovoId">E-mail</label>
              <input
                autoComplete="new-password"
                type="password"
                className="campo"
                id="novaSenha"
                required
                minLength={8}
                value={senhaCadastro}
                onChange={event => setSenhaCadastro(event.target.value)}
              />
              <label htmlFor="novaSenha" id="placeholderNovaSenha">Senha (mínimo 8 caracteres)</label>
              {erro && changeForm && <p className="authError" role="alert">{erro}</p>}
              <button type="submit" className="btnEntrar" disabled={carregando}>
                {carregando ? "Criando conta..." : "Cadastrar"}
              </button>
            </div>
            <button
              id="btnRegister"
              type="button"
              onClick={() => {
                setErro(null)
                setChangeForm(false)
              }}
            >
              Fazer login
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </main>
  )
}
