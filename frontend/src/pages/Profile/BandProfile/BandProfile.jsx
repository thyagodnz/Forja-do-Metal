import "./BandProfile.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../services/api.js";
import Loading from "../../../components/Loading/Loading.jsx";
import EditBandProfileModal from "../../../components/EditBandProfileModal/EditBandProfileModal";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  FiMusic,
  FiMapPin,
  FiCalendar,
  FiEdit,
  FiLogOut,
} from "react-icons/fi";

export default function BandProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [band, setBand] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loadingBand, setLoadingBand] = useState(true);

  useEffect(() => {
    async function loadBand() {
      try {
        setLoadingBand(true);
        const response = await api.get(`/bands/${id}`);
        setBand(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingBand(false);
      }
    }

    loadBand();
  }, [id]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  function handleUpdatedBand(updated) {
    setBand(updated);
    setIsEditOpen(false);
  }

  if (loadingBand) {
    return <Loading />;
  }

  if (!band) {
    return <p className="empty-tab">Banda não encontrada</p>;
  }

  const isOwner = user && user.id === band.id;

  return (
    <div className="profile-container">
      {/* CAPA */}
      <div
        className="profile-cover"
        style={
          band.coverPicture
            ? { backgroundImage: `url(${band.coverPicture})` }
            : {}
        }
      ></div>

      {/* HEADER */}
      <div className="profile-header">
        {/* FOTO PERFIL */}
        <div className="profile-image">
          {band.profilePicture ? (
            <img src={band.profilePicture} alt={band.name} />
          ) : (
            <div className="profile-placeholder">
              <FiMusic />
            </div>
          )}
        </div>

        {/* INFO + BOTÕES */}
        <div className="profile-top-row">
          <div className="profile-info">
            <h1>{band.name}</h1>

            <div className="profile-meta">
              <p className="meta-item">
                <FiMusic className="meta-icon" />
                {band.musicalGenre} • {band.year}
              </p>

              <p className="meta-item">
                <FiMapPin className="meta-icon" />
                {band.address.city}, {band.address.state}
              </p>

              <p className="meta-item">
                <FiCalendar className="meta-icon" />
                Na Forja desde{" "}
                {format(new Date(band.createdAt), "MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="action-buttons">
              <button
                className="edit-button"
                onClick={() => setIsEditOpen(true)}
              >
                <FiEdit />
                Editar perfil
              </button>

              <button className="logout-button" onClick={handleLogout}>
                <FiLogOut />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button
          className={activeTab === "about" ? "active" : ""}
          onClick={() => setActiveTab("about")}
        >
          Sobre
        </button>

        <button
          className={activeTab === "members" ? "active" : ""}
          onClick={() => setActiveTab("members")}
        >
          Membros
        </button>

        <button
          className={activeTab === "shows" ? "active" : ""}
          onClick={() => setActiveTab("shows")}
        >
          Shows
        </button>

        <button
          className={activeTab === "albums" ? "active" : ""}
          onClick={() => setActiveTab("albums")}
        >
          Álbuns
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="profile-content">
        {activeTab === "about" && (
          <div className="about-tab">
            {band.description ? (
              <div className="band-description">
                {band.description.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="empty-tab">Sem descrição</p>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="members-tab">
            {band.members.map((member, index) => (
              <div key={index} className="member-card">
                <span className="member-name">{member.name}</span>
                <span className="member-instrument">{member.instrument}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "shows" && (
          <div className="empty-tab">Nenhum show cadastrado</div>
        )}

        {activeTab === "albums" && (
          <div className="empty-tab">Nenhum álbum cadastrado</div>
        )}
      </div>

      {isOwner && isEditOpen && (
        <EditBandProfileModal
          band={band}
          onClose={() => setIsEditOpen(false)}
          onUpdated={handleUpdatedBand}
        />
      )}
    </div>
  );
}
