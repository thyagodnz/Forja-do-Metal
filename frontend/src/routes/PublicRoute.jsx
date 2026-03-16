import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute({ children }) {

    const { user } = useAuth();

    if (user) {
        return <Navigate to={`/perfil/${user.id}`} replace />;
    }

    return children;
}