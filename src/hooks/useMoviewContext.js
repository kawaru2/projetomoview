import {useContext} from 'react'
import {MoviewContext} from '../context/context'

export function useMoviewContext() {
  const context = useContext(MoviewContext);
  if (!context) {
    throw new Error("MoviewContext deve ser usado obrigatoriamente dentro de <MoviewProvider>")
  }
  return context;
}