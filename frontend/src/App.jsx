import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

import PublicRoute from "./routes/PublicRoute.jsx"

import Navbar from "./components/Navbar/Navbar.jsx"
import Home from "./pages/Home/Home.jsx"
import Bands from "./pages/Bands/Bands.jsx"
import Shows from "./pages/Shows/Shows.jsx"
import Login from "./pages/Login/Login.jsx"
import Register from "./pages/Register/Register.jsx"
import BandProfile from "./pages/Profile/BandProfile.jsx"

function App() {
  const { loading } = useAuth();

  if (loading) {
    return null
  }

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bandas" element={<Bands />} />
        <Route path="/shows" element={<Shows />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/cadastro"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route path="/perfil/:id" element={<BandProfile />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
