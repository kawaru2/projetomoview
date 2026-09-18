import {Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import './App.css'
// import { Home } from './pages/Home'
// import Filmes from './pages/Filmes'
// import Sobre from './pages/Sobre'
import { Login } from './pages/Login'

function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}

        {/* <Route path="/Filmes" element={<Filmes />} />

        <Route path="/Sobre" element={<Sobre />} /> */}

        <Route path="/Login" element={<Login />} />

        {/* <Route path="*" element={<Home />} /> */}
      </Routes>

      {/* <Footer /> */}
    </>
  )
}

export default App
