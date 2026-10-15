export function mensagemErro(error, fallback) {
  const mensagem =
    typeof error === "string"
      ? error
      : typeof error?.message === "string"
        ? error.message
        : ""
  const codigo = typeof error?.code === "string" ? error.code : ""
  const normalizada = mensagem.toLowerCase()

  if (codigo === "email_not_confirmed" || normalizada.includes("email not confirmed")) {
    return "Seu e-mail ainda não foi confirmado. Confira sua caixa de entrada."
  }
  if (
    codigo === "invalid_credentials" ||
    normalizada.includes("invalid login credentials")
  ) {
    return "E-mail ou senha incorretos."
  }
  if (
    codigo === "user_already_exists" ||
    normalizada.includes("user already registered") ||
    normalizada.includes("already registered")
  ) {
    return "Este e-mail já possui uma conta."
  }
  if (
    codigo === "user_not_found" ||
    normalizada.includes("user not found")
  ) {
    return "Não encontramos uma conta com esse e-mail."
  }
  if (
    normalizada.includes("email link is invalid") ||
    normalizada.includes("email link is expired") ||
    normalizada.includes("otp_expired")
  ) {
    return "O link é inválido ou expirou. Solicite um novo e-mail e tente novamente."
  }
  if (normalizada.includes("row-level security policy")) {
    return "O banco de dados não autorizou esta operação. Verifique as políticas de acesso."
  }
  if (normalizada.includes('relation "favorites" does not exist')) {
    return "A lista de favoritos ainda não está configurada no banco de dados."
  }

  if (/[ãõçáéíóúàâêô]/i.test(mensagem)) {
    return mensagem
  }

  return fallback
}
