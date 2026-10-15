import {Routes, Route} from 'react-router-dom'
import { Header } from './components/Header'
import './App.css'
import { Home } from './pages/Home'
import { Filmes } from './pages/Filmes'
import { Sobre } from './pages/Sobre'
import { Login } from './pages/Login'
import { RecuperarSenha } from './pages/recuperarSenha'
import { Favoritos } from './pages/Favoritos'
import { AuthCallback } from './pages/AuthCallback'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={4000} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/Filmes" element={<Filmes />} />

        <Route path="/Sobre" element={<Sobre />} />

        <Route path="/Login" element={<Login />} />

        <Route path="*" element={<Home />} />

        <Route path="/recuperarSenha" element={<RecuperarSenha />} />

        <Route path="/favoritos" element={<Favoritos />} />

        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>

      {/* <Footer /> */}
    </>
  )
}

export default App
