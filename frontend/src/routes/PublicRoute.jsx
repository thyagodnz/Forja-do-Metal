import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading/Loading";

export default function PublicRoute({ children }) {

    const { user, type, loading } = useAuth();

    if (loading) return <Loading />;

    if (user) {
        const path =
            type === "band"
                ? `/perfil-banda/${user.id}`
                : `/perfil-usuario/${user.id}`;

        return <Navigate to={path} replace />;
    }

    return children;
}