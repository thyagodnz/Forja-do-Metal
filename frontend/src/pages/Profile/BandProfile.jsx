import "./BandProfile.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import Loading from "../../components/Loading/Loading";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BandProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [band, setBand] = useState(null);
    const [activeTab, setActiveTab] = useState("about");

    useEffect(() => {
        async function loadBand() {
            try {
                const response = await api.get(`/bands/${id}`);
                setBand(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        loadBand();
    }, [id]);

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    if (!band) {
        return <Loading />;
    }

    const isOwner = user && user.id === band.id;

    return (
        <div className="profile-container">
            {/* CAPA */}
            <div className="profile-cover"></div>

            {/* HEADER */}
            <div className="profile-header">
                <div className="profile-image">
                    {band.image ? (
                        <img src={band.image} alt={band.name} />
                    ) : (
                        <div className="profile-placeholder">🎸</div>
                    )}
                </div>

                <div className="profile-info">
                    <h1>{band.name}</h1>

                    <div className="profile-meta">
                        <p>
                            {band.musicalGenre} • {band.year}
                        </p>

                        <p>
                            {band.address.city}, {band.address.state}
                        </p>

                        <p>
                            Na Forja desde{" "}
                            {format(new Date(band.createdAt), "MMMM 'de' yyyy", {
                                locale: ptBR,
                            })}
                        </p>
                    </div>
                </div>

                {isOwner && (
                    <button className="logout-button" onClick={handleLogout}>
                        Sair
                    </button>
                )}
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

            {/* CONTEÚDO DAS TABS */}

            <div className="profile-content">
                {activeTab === "about" && (
                    <div className="about-tab">
                        {band.description ? (
                            <p className="band-description">{band.description}</p>
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
        </div>
    );
}
