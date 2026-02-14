import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home.jsx'
import Header from './components/Header/Header.jsx'
import Register from './pages/Register/Register.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
