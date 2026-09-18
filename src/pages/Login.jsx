export function Login() {
  return (
    <main className="telaLogin">
      <form className="form">
        <h1 className="titleLogin">Moview</h1>
        <div className="camposLoginSenha">
          <input type="text" name="login" id="login" autoComplete="off" required />
          <label htmlFor="login" id="placeholderLogin">Login</label>
          <input type="password" name="senha" id="senha" autoComplete="new-password" required />
          <label htmlFor="senha" id="placeholderSenha">Senha</label>
        </div>
        <div className="entrarOuMudarSenha">
          <button className="btnEntrar" title="Entrar">Entrar</button>
          <button className="btnEsqueciSenha" title="Esqueceu a senha?">Esqueceu a senha?</button>
        </div>
      </form>
    </main>
  )
}