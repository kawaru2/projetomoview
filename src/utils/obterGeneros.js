export function obterGeneros(genreIds = [], generosFilmes = []) {
  return (
    (genreIds ?? [])
    .map(id => generosFilmes.find(genero => genero.id === id) ?. name)
    .filter(Boolean)
    .join(", ")
  )
}