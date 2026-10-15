import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useMoviewContext } from "../hooks/useMoviewContext"
import { mensagemErro } from "../utils/mensagemErro"

export function AuthCallback() {
  const [searchParams] = useSearchParams()
  const { user, carregandoSessao, erroSessao } = useMoviewContext()
  const erroEmail = searchParams.get("error_description")
  const erroCodigo = searchParams.get("error")
  const erro = erroEmail || erroSessao || erroCodigo

  useEffect(() => {
    if (carregandoSessao) return

    if (erro) {
      toast.error(mensagemErro(erro, "Não foi possível confirmar seu e-mail. Solicite um novo link."), {
        toastId: "resultado-confirmacao-email",
      })
    } else if (user) {
      toast.success("E-mail confirmado. Sua conta já está pronta para uso.", {
        toastId: "resultado-confirmacao-email",
      })
    } else {
      toast.info("Se o link foi confirmado, volte ao login para entrar.", {
        toastId: "resultado-confirmacao-email",
      })
    }
  }, [carregandoSessao, erro, user])

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
            <p>Confira a notificação para saber como prosseguir.</p>
            <Link className="btnEntrar" to="/Login">Voltar ao login</Link>
          </>
        ) : user ? (
          <>
            <h1>Conta confirmada!</h1>
            <p>Confira a notificação. Você já pode continuar usando sua conta.</p>
            <Link className="btnEntrar" to="/">Continuar para o Moview</Link>
          </>
        ) : (
          <>
            <h1>Link processado</h1>
            <p>
              Confira a notificação e volte ao login para continuar.
            </p>
            <Link className="btnEntrar" to="/Login">Ir para o login</Link>
          </>
        )}
      </section>
    </main>
  )
}
