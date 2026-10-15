import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export let supabase = null
export let supabaseConfigError = null

if (!supabaseUrl || !supabaseKey) {
  supabaseConfigError =
    "A autenticação está indisponível: configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ambiente de build."
} else {
  try {
    const parsedUrl = new URL(supabaseUrl)
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("A URL do Supabase precisa usar HTTP ou HTTPS.")
    }

    supabase = createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    supabaseConfigError = error instanceof Error
      ? `A configuração do Supabase é inválida: ${error.message}`
      : "A configuração do Supabase é inválida."
  }
}