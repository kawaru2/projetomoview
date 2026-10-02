// Import createContext, useContext, useState, useEffect
// Import api
import { useState, createContext } from 'react'
import { useEffect } from 'react'
import { key } from '../service/apiKey'

export const MoviewContext = createContext();

export function MoviewProvider({ children }) {
  const [isLogado, setIsLogado] = useState(() => {
  
    const valor = localStorage.getItem("log");
  
    if (!valor) return false;
  
    return valor === "true";
  });

  const [ filmesTopRated, setFilmesTopRated ] = useState(null);
  const [ generosFilmes, setGenerosFilmes ] = useState([]);
  const [ indicacaoIdade, setIndicacaoIdade ] = useState(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${key}`
    },
  }

  useEffect(() => {
    if (!filmesTopRated ?. results) return;
    Promise.all(
      filmesTopRated.results.slice(0, 3).map(async filme => {
        const resposta = await fetch(`https://api.themoviedb.org/3/movie/${filme.id}/release_dates`, options);
        const resultado = await resposta.json();
        const brasil = resultado.results ?. find(item => item.iso_3166_1 === "BR");
        const classificacao = brasil ?. release_dates ?. find(item => item.certification) ?. certification ?? "";
        return [filme.id, classificacao];
      })
    )
    .then(resultados => setIndicacaoIdade(Object.fromEntries(resultados)))
    .catch(console.error)
  }, [filmesTopRated])

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1", options)
    .then(res => res.json())
    .then(res => setFilmesTopRated(res))
    .catch(console.error);
  }, [])

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/genre/movie/list?language=pt-BR", options)
    .then(res => res.json())
    .then(data => setGenerosFilmes(data.genres))
    .catch(console.error);
  }, [])

  return (
    <MoviewContext.Provider value = {{isLogado, setIsLogado, filmesTopRated, generosFilmes, indicacaoIdade}}>
      {children}
    </MoviewContext.Provider>
  );
}

