import "./Navbar.css"
import { NavLink } from "react-router-dom"
import logo from "../../assets/logo.png"

const Navbar = ({ onLoginClick }) => {
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

                <button className="login-btn" onClick={onLoginClick}>
                    Entrar
                </button>

                <NavLink to="/cadastrar">Cadastrar</NavLink>
            </div>
        </nav>
    )
}

export default Navbar