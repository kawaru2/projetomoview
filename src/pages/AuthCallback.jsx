import { Link, useSearchParams } from "react-router-dom"
import { useMoviewContext } from "../hooks/useMoviewContext"

export function AuthCallback() {
  const [searchParams] = useSearchParams()
  const { user, carregandoSessao, erroSessao } = useMoviewContext()
  const erroEmail = searchParams.get("error_description")
  const erroCodigo = searchParams.get("error")
  const erro = erroEmail || erroSessao

  return (
    <main className="telaLogin">
      <section className="authCallback" aria-live="polite">
        {carregandoSessao ? (
          <>
            <h1>Confirmando sua conta</h1>
            <p>Aguarde enquanto validamos o link enviado por e-mail.</p>
          </>
        ) : erro || erroCodigo ? (
          <>
            <h1>Não foi possível confirmar</h1>
            <p role="alert">
              {erro || "O link é inválido ou expirou. Solicite um novo e-mail e tente novamente."}
            </p>
            <Link className="btnEntrar" to="/Login">Voltar ao login</Link>
          </>
        ) : user ? (
          <>
            <h1>Conta confirmada!</h1>
            <p>Seu e-mail foi confirmado. Você já pode usar sua conta no Moview.</p>
            <Link className="btnEntrar" to="/">Continuar para o Moview</Link>
          </>
        ) : (
          <>
            <h1>Link processado</h1>
            <p>
              Se você acabou de confirmar seu e-mail, volte ao login para entrar.
              Se o link expirou, solicite um novo cadastro ou e-mail de confirmação.
            </p>
            <Link className="btnEntrar" to="/Login">Ir para o login</Link>
          </>
        )}
      </section>
    </main>
  )
}
