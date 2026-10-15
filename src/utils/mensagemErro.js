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
  if (
    codigo === "42501" ||
    normalizada.includes("permission denied")
  ) {
    return "O Supabase bloqueou esta operação. Verifique as permissões e a policy RLS de favoritos."
  }
  if (
    codigo === "42P01" ||
    codigo === "PGRST205" ||
    normalizada.includes("could not find the table") ||
    normalizada.includes('relation "favorites" does not exist')
  ) {
    return "O Supabase não encontrou a tabela public.favorites. Aplique a migration de favoritos e recarregue o schema."
  }
  if (codigo === "42703" || codigo === "PGRST204") {
    return "As colunas da tabela de favoritos não correspondem às esperadas pela aplicação."
  }
  if (codigo === "23502") {
    return "Faltam dados obrigatórios para salvar este filme nos favoritos."
  }
  if (codigo === "23503") {
    return "A conta não foi reconhecida pelo banco de dados. Entre novamente e tente."
  }
  if (codigo === "22P02" || codigo === "22003") {
    return "O identificador do filme não é válido para o banco de dados."
  }
  if (
    normalizada.includes("failed to fetch") ||
    normalizada.includes("networkerror") ||
    normalizada.includes("load failed")
  ) {
    return "Não foi possível conectar ao Supabase. Verifique sua conexão e tente novamente."
  }

  if (/[ãõçáéíóúàâêô]/i.test(mensagem)) {
    return mensagem
  }

  return codigo ? `${fallback} (código ${codigo}).` : fallback
}
