import "./EditUserProfileModal.css";
import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../contexts/AuthContext";
import { FiCamera, FiUser, FiX } from "react-icons/fi";

export default function EditUserProfileModal({ user, onClose, onUpdated }) {
    const { user: loggedUser, refreshAuth } = useAuth();

    const [form, setForm] = useState({
        name: user.name || "",
        bio: user.bio || "",
    });

    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(
        user.profilePicture || "",
    );

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            if (profilePreview && profilePreview.startsWith("blob:")) {
                URL.revokeObjectURL(profilePreview);
            }
        };
    }, [profilePreview]);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function handleKey(e) {
            if (e.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleKey);

        return () => {
            document.body.style.overflow = prev || "auto";
            window.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleProfileImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (profilePreview && profilePreview.startsWith("blob:")) {
            URL.revokeObjectURL(profilePreview);
        }

        setProfileFile(file);
        setProfilePreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("bio", form.bio);

            if (profileFile) {
                formData.append("profilePicture", profileFile);
            }

            const response = await api.put(`/users/${user.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const updatedUser = response.data;

            if (loggedUser?.id === updatedUser.id) {
                await refreshAuth();
            }

            onUpdated(updatedUser);
        } catch (err) {
            console.error(err);
            setError("Erro ao salvar alterações. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    }

    function handleOverlayClick() {
        const sel = window.getSelection && window.getSelection();
        if (sel && sel.toString && sel.toString().length > 0) {
            return;
        }
        onClose();
    }

    return (
        <div className="edit-modal-overlay" onMouseDown={handleOverlayClick}>
            <div className="edit-modal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Editar perfil do usuário</h2>

                    <button
                        type="button"
                        className="close-icon"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="Fechar modal"
                    >
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="cover-area-user">
                        <div className="cover-preview user-cover-preview"></div>

                        <label className="user-profile-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImage}
                                hidden
                                disabled={submitting}
                            />

                            <div
                                className="user-profile-preview"
                                title="Alterar foto do perfil"
                            >
                                {profilePreview ? (
                                    <img src={profilePreview} alt="preview" />
                                ) : (
                                    <div className="user-modal-placeholder">
                                        <FiUser />
                                    </div>
                                )}

                                <div className="user-profile-overlay">
                                    <FiCamera />
                                    <span>Alterar foto</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    <h4>Nome</h4>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome do usuário"
                        value={form.name}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                    />

                    <h4>Bio</h4>
                    <textarea
                        name="bio"
                        placeholder="Fale um pouco sobre você"
                        value={form.bio}
                        onChange={handleChange}
                        disabled={submitting}
                    />

                    {error && <p className="error-form">{error}</p>}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="save-btn" disabled={submitting}>
                            {submitting ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
