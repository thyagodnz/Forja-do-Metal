import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

import PublicRoute from "./routes/PublicRoute.jsx"

import Navbar from "./components/Navbar/Navbar.jsx"
import Home from "./pages/Home/Home.jsx"
import Bands from "./pages/Bands/Bands.jsx"
import Shows from "./pages/Shows/Shows.jsx"
import Login from "./pages/Auth/Login/Login.jsx"
import RegisterBand from "./pages/Auth/Register/RegisterBand/RegisterBand.jsx"
import RegisterUser from "./pages/Auth/Register/RegisterUser/RegisterUser.jsx"
import BandProfile from "./pages/Profile/BandProfile/BandProfile.jsx"
import UserProfile from "./pages/Profile/UserProfile/UserProfile.jsx"

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
          path="/cadastro-banda"
          element={
            <PublicRoute>
              <RegisterBand />
            </PublicRoute>
          }
        />

        <Route
          path="/cadastro-usuario"
          element={
            <PublicRoute>
              <RegisterUser />
            </PublicRoute>
          }
        />

        <Route path="/perfil-banda/:id" element={<BandProfile />} />
        <Route path="/perfil-usuario/:id" element={<UserProfile />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
