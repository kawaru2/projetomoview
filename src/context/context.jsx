// Import createContext, useContext, useState, useEffect
// Import api
import { useState, createContext } from 'react'

export const MoviewContext = createContext();

export function MoviewProvider({ children }) {
  const [isLogado, setIsLogado] = useState(() => {
  
    const valor = localStorage.getItem("log");
  
    if (!valor) return false;
  
    return valor === "true";
  });
  return (
    <MoviewContext.Provider value = {{isLogado, setIsLogado}}>
      {children}
    </MoviewContext.Provider>
  );
}

