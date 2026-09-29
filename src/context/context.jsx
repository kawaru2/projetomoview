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

  const [ dados, setDados ] = useState(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${key}`
    },
  }

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-br&page=1&sort_by=popularity.desc", options)
    .then(res => res.json())
    .then(res => setDados(res))
    .catch(console.error);
  }, [])

  return (
    <MoviewContext.Provider value = {{isLogado, setIsLogado, dados}}>
      {children}
    </MoviewContext.Provider>
  );
}

