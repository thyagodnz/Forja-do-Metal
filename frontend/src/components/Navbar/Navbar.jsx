import "./Navbar.css"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import logo from "../../assets/logo.png"
import Loading from "../Loading/Loading.jsx"

const Navbar = () => {

    const { user, type, isAuthenticated, loading } = useAuth()

    if (loading) return <Loading />

    return (
        <nav>
            <div className="logo">
                <NavLink to="/">
                    <img src={logo} alt="Forja do Metal" />
                </NavLink>
            </div>

            <div className="nav-links">
                <NavLink to="/bandas">Bandas</NavLink>
                <NavLink to="/shows">Shows</NavLink>

                {!isAuthenticated ? (
                    <>
                        <NavLink to="/login">Entrar</NavLink>
                        <NavLink to="/cadastro">Cadastrar</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink
                            to={
                                type === "band"
                                    ? `/perfil-banda/${user.id}`
                                    : `/perfil-usuario/${user.id}`
                            }
                        >
                            {user.name}
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar