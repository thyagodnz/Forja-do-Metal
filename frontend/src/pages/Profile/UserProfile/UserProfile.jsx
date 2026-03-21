import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function UserProfile() {
    const navigate = useNavigate();

    const { logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    return (
        <div>
            <h1>Perfil de Usuário</h1>
            <button className="logout-button" onClick={handleLogout}>
                Sair
            </button>
        </div>
    );
}
