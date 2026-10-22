import assert from "node:assert/strict"
import { test } from "node:test"
import { mensagemErro } from "../src/utils/mensagemErro.js"
import { obterClassiIndicativa } from "../src/utils/obterClassiIndicativa.js"
import { obterGeneros } from "../src/utils/obterGeneros.js"

test("maps supported content ratings to their CSS classes", () => {
  const ratings = [
    ["L", "logoLivre"],
    ["10", "logo10"],
    ["12", "logo12"],
    ["14", "logo14"],
    ["16", "logo16"],
    ["18", "logo18"],
  ]

  for (const [rating, className] of ratings) {
    assert.equal(obterClassiIndicativa(rating), className)
  }
})

test("returns an empty class for unsupported content ratings", () => {
  assert.equal(obterClassiIndicativa("21"), "")
  assert.equal(obterClassiIndicativa(null), "")
})

test("resolves known genres in input order and skips unknown ids", () => {
  const genres = [
    { id: 28, name: "Ação" },
    { id: 35, name: "Comédia" },
  ]

  assert.equal(obterGeneros([35, 999, 28], genres), "Comédia, Ação")
})

test("returns an empty string when no genres are supplied", () => {
  assert.equal(obterGeneros(), "")
  assert.equal(obterGeneros([], [{ id: 28, name: "Ação" }]), "")
})

test("provides friendly messages for recognized authentication errors", () => {
  assert.equal(
    mensagemErro({ code: "invalid_credentials" }, "Falha"),
    "E-mail ou senha incorretos.",
  )
  assert.equal(
    mensagemErro(new Error("Email not confirmed"), "Falha"),
    "Seu e-mail ainda não foi confirmado. Confira sua caixa de entrada.",
  )
  assert.equal(
    mensagemErro({ message: "User already registered" }, "Falha"),
    "Este e-mail já possui uma conta.",
  )
})

test("provides friendly messages for database and connectivity errors", () => {
  assert.match(mensagemErro({ code: "42P01" }, "Falha"), /tabela public\.favorites/)
  assert.match(mensagemErro({ message: "permission denied" }, "Falha"), /Supabase bloqueou/)
  assert.match(mensagemErro(new Error("Failed to fetch"), "Falha"), /Verifique sua conexão/)
})

test("preserves localized messages and includes codes in the fallback", () => {
  assert.equal(mensagemErro(new Error("Falha de conexão"), "Falha"), "Falha de conexão")
  assert.equal(mensagemErro({ code: "OTHER" }, "Falha"), "Falha (código OTHER).")
  assert.equal(mensagemErro(null, "Falha"), "Falha")
})
