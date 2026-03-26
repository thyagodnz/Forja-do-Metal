import "./Navbar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import Loading from "../Loading/Loading.jsx";
import { FiUser, FiMusic, FiX, FiMenu } from "react-icons/fi";

const Navbar = () => {
  const { user, type, isAuthenticated, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [canCloseOnOverlay, setCanCloseOnOverlay] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isCadastroActive =
    location.pathname === "/cadastro-banda" ||
    location.pathname === "/cadastro-usuario";

  const profilePath =
    type === "band"
      ? `/perfil-banda/${user?.id}`
      : `/perfil-usuario/${user?.id}`;

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setShowModal(false);
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (showModal || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal, isMobileMenuOpen]);

  function handleSelect(accountType) {
    setShowModal(false);
    setIsMobileMenuOpen(false);

    if (accountType === "band") {
      navigate("/cadastro-banda");
    } else {
      navigate("/cadastro-usuario");
    }
  }

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleOverlayMouseDown(e) {
    if (e.target === e.currentTarget) {
      setCanCloseOnOverlay(true);
    } else {
      setCanCloseOnOverlay(false);
    }
  }

  function handleOverlayMouseUp(e) {
    if (e.target === e.currentTarget && canCloseOnOverlay) {
      closeModal();
    }
    setCanCloseOnOverlay(false);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  if (loading) return <Loading />;

  return (
    <>
      <nav>
        <div className="logo">
          <NavLink to="/" onClick={closeMobileMenu}>
            <img src={logo} alt="Forja do Metal" />
          </NavLink>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/bandas" onClick={closeMobileMenu}>
            Bandas
          </NavLink>
          <NavLink to="/shows" onClick={closeMobileMenu}>
            Shows
          </NavLink>
          <NavLink to="/albuns" onClick={closeMobileMenu}>
            Álbuns
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" onClick={closeMobileMenu}>
                Entrar
              </NavLink>

              <button
                className={`nav-button ${isCadastroActive ? "active" : ""}`}
                onClick={() => {
                  closeMobileMenu();
                  openModal();
                }}
              >
                Cadastrar
              </button>
            </>
          ) : (
            <NavLink to={profilePath} onClick={closeMobileMenu}>
              {user.name}
            </NavLink>
          )}
        </div>
      </nav>

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={handleOverlayMouseDown}
          onMouseUp={handleOverlayMouseUp}
        >
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close-icon"
              onClick={closeModal}
              aria-label="Fechar modal"
            >
              <FiX />
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
