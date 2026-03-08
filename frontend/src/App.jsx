import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

import PublicRoute from "./routes/PublicRoute.jsx"

import Navbar from "./components/Navbar/Navbar.jsx"
import Home from "./pages/Home/Home.jsx"
import Register from "./pages/Register/Register.jsx"
import Login from "./pages/Login/Login.jsx"
import Profile from "./pages/Profile/Profile.jsx"

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

        <Route
          path="/cadastro"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/perfil/:id" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
