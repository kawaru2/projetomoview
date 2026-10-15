import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useMoviewContext } from "../hooks/useMoviewContext"
import { mensagemErro } from "../utils/mensagemErro"

export function RecuperarSenha() {
  const navigate = useNavigate()
  const {
    emRecuperacaoSenha,
    carregandoSessao,
    solicitarRecuperacao,
    atualizarSenha,
  } = useMoviewContext()
  const [email, setEmail] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function solicitarEmail(event) {
    event.preventDefault()
    setCarregando(true)

    try {
      await solicitarRecuperacao(email.trim())
      toast.success("Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.")
    } catch (error) {
      toast.error(mensagemErro(error, "Não foi possível enviar o link. Tente novamente."))
    } finally {
      setCarregando(false)
    }
  }

  async function salvarNovaSenha(event) {
    event.preventDefault()

    if (novaSenha.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.")
      return
    }
    if (novaSenha !== confirmacaoSenha) {
      toast.error("As senhas não correspondem.")
      return
    }

    setCarregando(true)
    try {
      await atualizarSenha(novaSenha)
      toast.success("Senha atualizada. Você já pode entrar com a nova senha.")
      setTimeout(() => navigate("/Login", { replace: true }), 1200)
    } catch (error) {
      toast.error(mensagemErro(error, "Não foi possível atualizar a senha. Tente novamente."))
    } finally {
      setCarregando(false)
    }
  }

  if (carregandoSessao) {
    return <main className="telaLogin"><p role="status">Verificando sessão...</p></main>
  }

  return (
    <main className="telaLogin">
      <form
        className="form effect"
        onSubmit={emRecuperacaoSenha ? salvarNovaSenha : solicitarEmail}
      >
        <button
          type="button"
          id="btnRegister"
          onClick={() => navigate("/Login")}
        >
          Voltar
        </button>
        <h1 className="titleFormBack">
          {emRecuperacaoSenha ? "Escolha uma nova senha" : "Recuperar senha"}
        </h1>
        {!emRecuperacaoSenha ? (
          <div className="camposLoginSenha">
            <input
              value={email}
              type="email"
              name="email"
              className="campo"
              id="login"
              autoComplete="email"
              required
              onChange={event => setEmail(event.target.value)}
            />
            <label htmlFor="login" id="placeholderLogin">Seu e-mail</label>
            <p>Enviaremos um link para o endereço informado.</p>
          </div>
        ) : (
          <div className="camposLoginSenha">
            <input
              type="password"
              name="novaSenha"
              className="campo"
              id="senha"
              autoComplete="new-password"
              required
              minLength={8}
              value={novaSenha}
              onChange={event => setNovaSenha(event.target.value)}
            />
            <label htmlFor="senha" id="placeholderSenha">Nova senha</label>
            <input
              type="password"
              name="confirmacaoSenha"
              className="campo"
              id="confirmacaoSenha"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmacaoSenha}
              onChange={event => setConfirmacaoSenha(event.target.value)}
            />
            <label htmlFor="confirmacaoSenha" id="placeholderNovaSenha">
              Confirmar nova senha
            </label>
          </div>
        )}
        <button
          type="submit"
          className="btnEsqueciSenha btnMin"
          disabled={carregando}
        >
          {carregando
            ? "Aguarde..."
            : emRecuperacaoSenha ? "Salvar nova senha" : "Enviar link"}
        </button>
      </form>
    </main>
  )
}
