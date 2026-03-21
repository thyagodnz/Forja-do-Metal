import "./Navbar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import Loading from "../Loading/Loading.jsx";
import { FiUser, FiMusic } from "react-icons/fi";

const Navbar = () => {
  const { user, type, isAuthenticated, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const isCadastroActive =
    location.pathname === "/cadastro-banda" ||
    location.pathname === "/cadastro-usuario";

  if (loading) return <Loading />;

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") setShowModal(false);
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  function handleSelect(type) {
    setShowModal(false);

    if (type === "band") {
      navigate("/cadastro-banda");
    } else {
      navigate("/cadastro-usuario");
    }
  }

  const profilePath =
    type === "band"
      ? `/perfil-banda/${user?.id}`
      : `/perfil-usuario/${user?.id}`;

  return (
    <>
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

              <button
                className={`nav-button ${isCadastroActive ? "active" : ""}`}
                onClick={() => setShowModal(true)}
              >
                Cadastrar
              </button>
            </>
          ) : (
            <NavLink to={profilePath}>{user.name}</NavLink>
          )}
        </div>
      </nav>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-icon" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <h2>Como deseja se cadastrar?</h2>

            <div className="modal-buttons">
              <button onClick={() => handleSelect("band")}>
                <FiMusic size={40} />
                <span>Banda</span>
              </button>

              <button onClick={() => handleSelect("user")}>
                <FiUser size={40} />
                <span>Usuário</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
