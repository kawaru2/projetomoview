import { useState, useMemo } from 'react'
import { useEffect } from 'react'
import { key } from '../service/apiKey'
import { MoviewContext } from "./criandoContexto"

export function MoviewProvider({ children }) {
  const [isLogado, setIsLogado] = useState(() => {
  
    const valor = localStorage.getItem("log");
  
    if (!valor) return false;
  
    return valor === "true";
  });

  const [ filmesTopRated, setFilmesTopRated ] = useState(null);
  const [ generosFilmes, setGenerosFilmes ] = useState([]);
  const [ indicacaoIdade, setIndicacaoIdade ] = useState(null);
  const [ filmesPopulares, setFilmesPopulares ] = useState(null);
  const [ trendingFilmesWeek, setTrendingFilmesWeek ] = useState(null);

  const options = useMemo(() => ({
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${key}`
    },
  }), []);

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/trending/movie/week?language=pt-BR", options)
    .then(filme => filme.json())
    .then(resultado => setTrendingFilmesWeek(resultado))
  }, [options])

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1", options)
    .then(filme => filme.json())
    .then(resultado => setFilmesPopulares(resultado))
    .catch(erro => console.log(erro));
  }, [options])

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
  }, [filmesTopRated, options])

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/discover/movie?sort_by=vote_count.desc&language=pt-BR&page=1", options)
    .then(res => res.json())
    .then(res => setFilmesTopRated(res))
    .catch(console.error);
  }, [options])

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/genre/movie/list?language=pt-BR", options)
    .then(res => res.json())
    .then(data => setGenerosFilmes(data.genres))
    .catch(console.error);
  }, [options])

  return (
    <MoviewContext.Provider value = {{
      isLogado,
      setIsLogado,
      filmesTopRated,
      filmesPopulares,
      generosFilmes,
      indicacaoIdade,
      trendingFilmesWeek,
      }}>
      {children}
    </MoviewContext.Provider>
  );
}