import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import api from "../../services/api.js";

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: {
            region: "",
            state: "",
            city: "",
        },
        members: [{ name: "", instrument: "" }],
        year: "",
        musicalGenre: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleAddressChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    }

    function handleMemberChange(index, e) {
        const { name, value } = e.target;

        const updatedMembers = [...formData.members];
        updatedMembers[index][name] = value;

        setFormData((prev) => ({
            ...prev,
            members: updatedMembers,
        }));
    }

    function addMember() {
        setFormData((prev) => ({
            ...prev,
            members: [...prev.members, { name: "", instrument: "" }],
        }));
    }

    function removeMember(index) {
        if (formData.members.length === 1) return;

        const updatedMembers = formData.members.filter((_, i) => i !== index);

        setFormData((prev) => ({
            ...prev,
            members: updatedMembers,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        if (formData.password.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        const { confirmPassword, ...dataToSend } = formData;

        try {
            setLoading(true);

            const response = await api.post("/bands", dataToSend);

            setUser(response.data.band);

            navigate("/");
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
                <h1>Cadastro da Banda</h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Nome da Banda"
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

                    <h3>Localização</h3>

                    <input
                        type="text"
                        name="region"
                        placeholder="Região"
                        value={formData.address.region}
                        onChange={handleAddressChange}
                        disabled={loading}
                        required
                    />

                    <input
                        type="text"
                        name="state"
                        placeholder="Estado"
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        disabled={loading}
                        required
                    />

                    <input
                        type="text"
                        name="city"
                        placeholder="Cidade"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        disabled={loading}
                        required
                    />

                    <h3>Membros</h3>

                    {formData.members.map((member, index) => (
                        <div key={index} className="member-group">

                            <input
                                type="text"
                                name="name"
                                placeholder="Nome do membro"
                                value={member.name}
                                onChange={(e) => handleMemberChange(index, e)}
                                disabled={loading}
                                required
                            />

                            <input
                                type="text"
                                name="instrument"
                                placeholder="Instrumento"
                                value={member.instrument}
                                onChange={(e) => handleMemberChange(index, e)}
                                disabled={loading}
                                required
                            />

                            {formData.members.length > 1 && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeMember(index)}
                                    disabled={loading}
                                >
                                    Remover
                                </button>
                            )}

                        </div>
                    ))}

                    <button
                        type="button"
                        className="add-member-button"
                        onClick={addMember}
                        disabled={loading}
                    >
                        + Adicionar Membro
                    </button>

                    <h3>Informações Adicionais</h3>

                    <input
                        type="number"
                        name="year"
                        placeholder="Ano de formação"
                        value={formData.year}
                        onChange={handleChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        disabled={loading}
                        required
                    />

                    <input
                        type="text"
                        name="musicalGenre"
                        placeholder="Estilo musical"
                        value={formData.musicalGenre}
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
                        className="cadastrar-button"
                        disabled={loading}
                    >
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>

                </form>
            </div>
        </div>
    );
}