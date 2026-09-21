import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'

export function Login() {
  const navigate = useNavigate();
  // A lógica vai mudar futuramente para fazer a verificação do ID e da senha se são válidas.
  const [ login, setLogin ] = useState("");
  const [ senha, setSenha ] = useState("");
  const [ campoNovoNome, setCampoNovoNome ] = useState("");
  const [ campoNovoId, setCampoNovoId ] = useState("");
  const [ campoNovaSenha, setCampoNovaSenha ] = useState("");
  const [ changeForm, setChangeForm ] = useState(false);

  function toastEvent() {
    if(!login || !senha) {
      toast.error("Preencha os campos ID e Senha!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } else {
      toast.success("Login feito com sucesso", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setTimeout(() => navigate("/"), 4000)
    }
  }

  function toastEventBack() {
    if(!campoNovoNome || !campoNovoId || !campoNovaSenha) {
      toast.error("Preencha todos os campos!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } else {
      toast.success("Conta criada com sucesso", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      setTimeout(() => {
        setChangeForm(!changeForm)
        setCampoNovoNome("")
        setCampoNovoId("")
        setCampoNovaSenha("")
      }, 4000)
    }
  }

  return (
    <main className="telaLogin">
      <div className="containerForm effect">
        <div className={`containerFormChange ${changeForm ? "isActive" : ""}`}>
          <form className="form front">
            <h1 className="titleLogin">Moview</h1>
            {/* A ideia é fazer o cadastro na mesma página usando um efeito de transição do formulário. */}
            <button type="button" id="btnRegister" onClick={() => setChangeForm(!changeForm)}>
              Criar conta
            </button>
            <div className="camposLoginSenha">
              <input type="text" name="login" className="campo" autoComplete="off" onChange={(e) => setLogin(e.target.value)} />
              <label htmlFor="login" id="placeholderLogin">Login</label>
              <input type="password" name="senha" className="campo" autoComplete="new-password" onChange={(e) => setSenha(e.target.value)} />
              <label htmlFor="senha" id="placeholderSenha">Senha</label>
            </div>
            <div className="entrarOuMudarSenha">
              <button type="button" className="btnEntrar" title="Entrar" onClick={toastEvent}>Entrar</button>
              <button type="button" className="btnEsqueciSenha" title="Esqueceu a senha?" onClick={() => {navigate("/recuperarSenha")}}>Esqueceu a senha?</button>
            </div>
          </form>
          <form className="form back">
            <h2 className="titleFormBack">Criar conta</h2>
            <div className="camposLoginSenha">
              <input autoComplete="off" type="text" className="campo" id="novoNome" onChange={(e) => setCampoNovoNome(e.target.value)} value={campoNovoNome} />
              <label htmlFor="novoNome" id="placeholderNovoNome">Nome Completo</label>
              <input autoComplete="off" type="text" className="campo" id="novoId" onChange={(e) => setCampoNovoId(e.target.value)} value={campoNovoId} />
              <label htmlFor="novoId" id="placeholderNovoId">Seu ID</label>
              <input autoComplete="new-password" type="password" className="campo" id="novaSenha" onChange={(e) => setCampoNovaSenha(e.target.value)} value={campoNovaSenha} />
              <label htmlFor="novaSenha" id="placeholderNovaSenha">Senha (4 - 8 digitos)</label>
              <button type="button" className="btnEntrar" onClick={toastEventBack}>Cadastrar</button>
            </div>
            <button id="btnRegister" type="button" onClick={() => setChangeForm(!changeForm)}>Fazer Login</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </main>
  )
}