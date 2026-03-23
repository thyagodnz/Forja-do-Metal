import "./BandProfile.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../services/api.js";
import Loading from "../../../components/Loading/Loading.jsx";
import EditBandProfileModal from "../../../components/EditBandProfileModal/EditBandProfileModal";
import EditMemberModal from "../../../components/EditMemberModal/EditMemberModal.jsx";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  FiMusic,
  FiMapPin,
  FiCalendar,
  FiEdit,
  FiLogOut,
  FiHeart,
  FiChevronDown,
  FiUser,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function BandProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, type, logout, refreshAuth } = useAuth();

  const [band, setBand] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loadingBand, setLoadingBand] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState(null);

  const [isMemberEditOpen, setIsMemberEditOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberSubmitting, setMemberSubmitting] = useState(false);

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

  function getFavoriteBandIds() {
    if (!user?.favoriteBands) return [];

    return user.favoriteBands.map((favorite) =>
      typeof favorite === "string" ? favorite : favorite.id || favorite._id,
    );
  }

  function isRealMemberId(memberId) {
    return (
      !!memberId &&
      typeof memberId === "string" &&
      !memberId.startsWith("temp-")
    );
  }

  async function handleToggleFavorite() {
    try {
      setFavoriteLoading(true);
      await api.patch(`/users/favorites/${band.id}`);
      await refreshAuth();
    } catch (error) {
      console.error(error);
    } finally {
      setFavoriteLoading(false);
    }
  }

  function handleToggleMember(memberId) {
    setExpandedMemberId((prev) => (prev === memberId ? null : memberId));
  }

  function openMemberEdit(memberId) {
    if (!isRealMemberId(memberId)) return;

    setEditingMemberId(memberId);
    setIsMemberEditOpen(true);
  }

  async function handleSaveMemberDetails({ memberId, bio, photoFile }) {
    try {
      setMemberSubmitting(true);

      const updatedMembers = band.members.map((member) =>
        member.id === memberId ? { ...member, bio } : member,
      );

      const formData = new FormData();
      formData.append("name", band.name);
      formData.append("description", band.description || "");
      formData.append("year", band.year);
      formData.append("musicalGenre", band.musicalGenre);
      formData.append("address", JSON.stringify(band.address));
      formData.append("members", JSON.stringify(updatedMembers));

      if (photoFile) {
        formData.append(`memberPhoto_${memberId}`, photoFile);
      }

      const response = await api.put(`/bands/${band.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBand(response.data);
      setIsMemberEditOpen(false);
      setEditingMemberId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setMemberSubmitting(false);
    }
  }

  if (loadingBand) {
    return <Loading />;
  }

  if (!band) {
    return <p className="empty-tab">Banda não encontrada</p>;
  }

  const isOwner = type === "band" && user && user.id === band.id;
  const isUserAccount = type === "user";
  const favoriteBandIds = getFavoriteBandIds();
  const isFavorite = isUserAccount && favoriteBandIds.includes(band.id);
  const editingMember =
    editingMemberId !== null
      ? band.members.find((member) => member.id === editingMemberId)
      : null;

  return (
    <div className="profile-container">
      <div
        className="profile-cover"
        style={
          band.coverPicture
            ? { backgroundImage: `url(${band.coverPicture})` }
            : {}
        }
      ></div>

      <div className="profile-header">
        <div className="profile-image">
          {band.profilePicture ? (
            <img src={band.profilePicture} alt={band.name} />
          ) : (
            <div className="profile-placeholder">
              <FiMusic />
            </div>
          )}
        </div>

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

          <div className="action-buttons">
            {isUserAccount && (
              <button
                className={`favorite-button ${isFavorite ? "favorited" : ""}`}
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                aria-label={
                  isFavorite
                    ? "Remover banda dos favoritos"
                    : "Adicionar banda aos favoritos"
                }
                title={
                  isFavorite
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
              >
                {isFavorite ? <FaHeart /> : <FiHeart />}
              </button>
            )}

            {isOwner && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

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
            {band.members.map((member) => {
              const isExpanded = expandedMemberId === member.id;
              const canEditMemberDetails = isOwner && isRealMemberId(member.id);

              return (
                <div
                  key={member.id}
                  className={`member-card ${isExpanded ? "expanded" : ""}`}
                  onClick={() => handleToggleMember(member.id)}
                >
                  <div className="member-card-header">
                    <div
                      className={`member-photo ${isExpanded ? "expanded" : ""}`}
                    >
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} />
                      ) : (
                        <div className="member-photo-placeholder">
                          <FiUser />
                        </div>
                      )}
                    </div>

                    <div className="member-main-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-instrument">
                        {member.instrument}
                      </span>
                    </div>

                    <span
                      className={`member-expand-icon ${isExpanded ? "expanded" : ""
                        }`}
                    >
                      <FiChevronDown />
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="member-extra-content">
                      {member.bio ? (
                        member.bio.split("\n").map((line, index) => (
                          <p className="member-bio" key={index}>
                            {line}
                          </p>
                        ))
                      ) : (
                        <p className="member-empty-bio">Sem bio</p>
                      )}

                      {canEditMemberDetails && (
                        <button
                          type="button"
                          className="member-edit-details-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMemberEdit(member.id);
                          }}
                        >
                          <FiEdit />
                          Editar detalhes
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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

      {isOwner && isMemberEditOpen && editingMember && (
        <EditMemberModal
          member={editingMember}
          memberId={editingMemberId}
          onClose={() => {
            setIsMemberEditOpen(false);
            setEditingMemberId(null);
          }}
          onSave={handleSaveMemberDetails}
          submitting={memberSubmitting}
        />
      )}
    </div>
  );
}
