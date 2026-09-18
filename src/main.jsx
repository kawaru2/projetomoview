import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MoviewProvider } from './context/context'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
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
