import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MoviewProvider } from './context/context'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './mediaQueries.css'
// Import MoviewProvider e BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MoviewProvider>
        <App />
      </MoviewProvider>
    </BrowserRouter>
  </StrictMode>,
)
