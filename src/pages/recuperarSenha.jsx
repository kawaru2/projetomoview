import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

export function RecuperarSenha() {
  const navigate = useNavigate();
  const [ id, setId ] = useState("");
  const [ novaSenha, setNovaSenha ] = useState("");
  const [ validarSenha, setValidarSenha ] = useState("");

  function enviarNovosDados() {
    if (!id || !novaSenha) {

      toast.error("Id e senha inválidos ou vazios", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      
    } else if (novaSenha !== validarSenha) {

      toast.error("As senhas precisam ser idênticas", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

    } else {

      toast.success("Senha alterada com sucesso!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      setTimeout(() => {
        navigate("/login");
        setId("");
        setNovaSenha("");
        setValidarSenha("");
      }, 4000)
    }
  }
  return (
  <main className="telaLogin">
    <ToastContainer />
    <div className="containerFormChange">
      <form className="form front effect">
        <button type="button" id="btnRegister" onClick={() => navigate("/Login")}>Voltar</button>
        <h1 className="titleFormBack">Mudar Senha</h1>
        <div className="camposLoginSenha">
          <input
          value={id} 
          type="text" 
          name="login" 
          className="campo" 
          id="login" 
          autoComplete="off" 
          onChange={(e) => setId(e.target.value)}
          />

          <label htmlFor="login" id="placeholderLogin">Digite o seu ID</label>

          <input 
          type="password" 
          name="senha" 
          id="senha" 
          className="campo" 
          autoComplete="new-password"
          onChange={(e) => setNovaSenha(e.target.value)}
          value={novaSenha}
          />

          <label htmlFor="senha" id="placeholderSenha">Nova senha: </label>

          <input 
          type="password" 
          name="confirmarSenha" 
          id="confirmarSenha" 
          className="campo" 
          autoComplete="new-password"
          onChange={(e) => setValidarSenha(e.target.value)}
          value={validarSenha}
          />

          <label htmlFor="confirmarSenha" id="placeholderNovaSenha">
            Confirmar senha
          </label>

        </div>
        <button onClick={enviarNovosDados} type="button" className="btnEsqueciSenha btnMin">Enviar</button>
      </form>
    </div>
    </main>
  )
}