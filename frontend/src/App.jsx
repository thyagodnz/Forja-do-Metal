import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Home from './pages/Home/Home.jsx'
import Register from './pages/Register/Register.jsx'
import LoginModal from './components/LoginModal/LoginModal.jsx'

function App() {

  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <BrowserRouter>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cadastrar' element={<Register />} />
      </Routes>

      {isLoginOpen && (
        <LoginModal onClose={() => setIsLoginOpen(false)} />
      )}
    </BrowserRouter>
  )
}

export default App
