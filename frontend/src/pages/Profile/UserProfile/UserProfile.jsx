import "./UserProfile.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../services/api.js";
import Loading from "../../../components/Loading/Loading.jsx";
import EditUserProfileModal from "../../../components/EditUserProfileModal/EditUserProfileModal";
import BandCard from "../../../components/BandCard/BandCard.jsx";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  FiUser,
  FiCalendar,
  FiLogOut,
  FiEdit,
} from "react-icons/fi";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user: loggedUser, type, logout, refreshAuth } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState("favorites");
  const [loadingUser, setLoadingUser] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoadingUser(true);
        const response = await api.get(`/users/${id}`);
        setProfileUser(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, [id]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  function handleUpdatedUser(updated) {
    setProfileUser(updated);
    setIsEditOpen(false);
  }

  function getFavoriteBandIds() {
    if (!loggedUser?.favoriteBands) return [];

    return loggedUser.favoriteBands.map((favorite) =>
      typeof favorite === "string" ? favorite : favorite.id || favorite._id
    );
  }

  async function handleToggleFavorite(bandId) {
    try {
      setFavoriteLoadingId(bandId);

      await api.patch(`/users/favorites/${bandId}`);
      await refreshAuth();

      const response = await api.get(`/users/${id}`);
      setProfileUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFavoriteLoadingId(null);
    }
  }

  if (loadingUser) {
    return <Loading />;
  }

  if (!profileUser) {
    return <p className="empty-tab">Usuário não encontrado</p>;
  }

  const isOwner = loggedUser && loggedUser.id === profileUser.id;
  const favoriteBandIds = getFavoriteBandIds();

  return (
    <div className="user-profile-container">
      <div className="user-profile-cover"></div>

      <div className="user-profile-header">
        <div className="user-profile-top-row">
          <div className="user-profile-left">
            <div className="user-profile-image">
              {profileUser.profilePicture ? (
                <img src={profileUser.profilePicture} alt={profileUser.name} />
              ) : (
                <div className="user-profile-placeholder">
                  <FiUser />
                </div>
              )}
            </div>

            <div className="user-profile-info">
              <h1>{profileUser.name}</h1>

              <div className="user-profile-meta">
                <p className="meta-item">
                  <FiCalendar className="meta-icon" />
                  Na Forja desde{" "}
                  {format(new Date(profileUser.createdAt), "MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>

              {profileUser.bio ? (
                <div className="user-bio">
                  {profileUser.bio.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="empty-bio">Sem bio</p>
              )}
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

      <div className="profile-tabs">
        <button
          className={activeTab === "favorites" ? "active" : ""}
          onClick={() => setActiveTab("favorites")}
        >
          Bandas favoritas
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "favorites" && (
          <div className="favorites-tab">
            {profileUser.favoriteBands && profileUser.favoriteBands.length > 0 ? (
              profileUser.favoriteBands.map((band) => {
                const isFavorite =
                  type === "user" && favoriteBandIds.includes(band.id);

                return (
                  <BandCard
                    key={band.id}
                    band={band}
                    className="favorite-band-card"
                    showGenre={false}
                    showYear={false}
                    showFavoriteButton={isOwner && type === "user"}
                    isFavorite={isFavorite}
                    favoriteDisabled={favoriteLoadingId === band.id}
                    onFavoriteClick={() => handleToggleFavorite(band.id)}
                  />
                );
              })
            ) : (
              <div className="empty-tab">Nenhuma banda favoritada</div>
            )}
          </div>
        )}
      </div>

      {isOwner && isEditOpen && (
        <EditUserProfileModal
          user={profileUser}
          onClose={() => setIsEditOpen(false)}
          onUpdated={handleUpdatedUser}
        />
      )}
    </div>
  );
}