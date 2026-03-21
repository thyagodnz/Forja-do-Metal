import "./RegisterUser.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext.jsx";
import api from "../../../../services/api.js";

export default function RegisterUser() {
    const navigate = useNavigate();
    const { setUser, setType } = useAuth();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        if (formData.password.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem");
            setLoading(false);
            return;
        }

        const { confirmPassword, ...dataToSend } = formData;

        try {
            const response = await api.post("/users", dataToSend);

            const { user, type } = response.data;

            setUser(user);
            setType(type);

            navigate(`/perfil-usuario/${user.id}`);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Erro ao conectar com o servidor");
            }

            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="form-card">
                <h1>Cadastro de Usuário</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />

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
                        minLength={8}
                        disabled={loading}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar senha"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />

                    {error && <p className="error-form">{error}</p>}

                    <button type="submit" className="cadastrar-button" disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>
            </div>
        </div>
    )
}