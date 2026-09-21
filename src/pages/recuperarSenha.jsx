import { useNavigate } from 'react-router-dom'

export function RecuperarSenha() {
  const navigate = useNavigate();
  return (
    <main className="telaLogin">
      <form className="form effect">
        <button type="button" id="btnRegister" onClick={() => navigate("/Login")}>Voltar</button>
        <h1 className="titleFormBack">Mudar Senha</h1>
        <div className="camposLoginSenha">
          <input type="text" name="login" className="campo" id="login" autoComplete="off"/>
          <label htmlFor="login" id="placeholderLogin">Digite o seu ID</label>
          <input type="password" name="senha" id="senha" className="campo" autoComplete="new-password"/>
          <label htmlFor="senha" id="placeholderSenha">Nova senha: </label>
          <input type="password" name="confirmarSenha" id="confirmarSenha" className="campo" autoComplete="new-password"/>
          <label htmlFor="confirmarSenha" id="placeholderNovaSenha">Confirmar senha</label>
        </div>
        <button type="button" className="btnEsqueciSenha btnMin">Enviar</button>
      </form>
    </main>
  )
}