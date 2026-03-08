import "./Login.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"

export default function Login() {

    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        setError("")
        setLoading(true)

        try {

            await api.post("/auth/login", formData)

            const response = await api.get("/auth/me")

            setUser(response.data)

            navigate("/")

        } catch (error) {

            if (error.response) {
                setError(error.response.data.message)
            } else {
                setError("Erro ao conectar com o servidor")
            }

            console.error(error)

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="form-card">

                <h1>Entrar na Forja do Metal</h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />

                    {error && (
                        <p className="error-form">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                </form>

            </div>
        </div>
    )
}