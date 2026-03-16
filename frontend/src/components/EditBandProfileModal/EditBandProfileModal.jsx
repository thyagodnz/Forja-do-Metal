import "./EditBandProfileModal.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiCamera, FiUser } from "react-icons/fi";

export default function EditProfileModal({ band, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: band.name || "",
        description: band.description || "",
        year: band.year || "",
        musicalGenre: band.musicalGenre || "",
        address: { ...(band.address || { region: "", state: "", city: "" }) },
        members:
            band.members && band.members.length
                ? band.members.map((m) => ({ ...m }))
                : [{ name: "", instrument: "" }],
    });

    const [profileFile, setProfileFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const [profilePreview, setProfilePreview] = useState(
        band.profilePicture || "",
    );
    const [coverPreview, setCoverPreview] = useState(band.coverPicture || "");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            if (profilePreview && profilePreview.startsWith("blob:")) {
                URL.revokeObjectURL(profilePreview);
            }
            if (coverPreview && coverPreview.startsWith("blob:")) {
                URL.revokeObjectURL(coverPreview);
            }
        };
    }, [profilePreview, coverPreview]);

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

    function handleAddressChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));
    }

    function handleMemberChange(idx, e) {
        const { name, value } = e.target;
        const updated = [...form.members];
        updated[idx][name] = value;
        setForm((prev) => ({ ...prev, members: updated }));
    }

    function addMember() {
        setForm((prev) => ({
            ...prev,
            members: [...prev.members, { name: "", instrument: "" }],
        }));
    }

    function removeMember(idx) {
        if (form.members.length === 1) return;
        const updated = form.members.filter((_, i) => i !== idx);
        setForm((prev) => ({ ...prev, members: updated }));
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

    function handleCoverImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (coverPreview && coverPreview.startsWith("blob:")) {
            URL.revokeObjectURL(coverPreview);
        }
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("year", form.year);
            formData.append("musicalGenre", form.musicalGenre);

            formData.append("address", JSON.stringify(form.address));
            formData.append("members", JSON.stringify(form.members));

            if (profileFile) {
                formData.append("profilePicture", profileFile);
            }

            if (coverFile) {
                formData.append("coverPicture", coverFile);
            }

            const response = await api.put(`/bands/${band.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onUpdated(response.data);
        } catch (err) {
            console.error(err);
            setError("Erro ao salvar alterações. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    }

    function handleOverlayClick(e) {
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
                    <h2>Editar perfil</h2>
                </div>

                <form onSubmit={handleSubmit} className="edit-form">
                    {/* COVER + PROFILE (sobrepostos) */}
                    <div className="cover-area">
                        <label className="cover-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImage}
                                hidden
                                disabled={submitting}
                            />

                            <div
                                className="cover-preview"
                                style={
                                    coverPreview
                                        ? { backgroundImage: `url(${coverPreview})` }
                                        : {}
                                }
                                title="Alterar foto da capa"
                            >
                                <div className="cover-overlay">
                                    <FiCamera />
                                    <span>Alterar foto</span>
                                </div>
                            </div>
                        </label>

                        <label className="profile-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImage}
                                hidden
                                disabled={submitting}
                            />
                            <div className="profile-preview" title="Alterar foto do perfil">
                                {profilePreview ? (
                                    <img src={profilePreview} alt="preview" />
                                ) : (
                                    <div className="modal-placeholder">
                                        <FiUser />
                                    </div>
                                )}

                                <div className="profile-overlay">
                                    <FiCamera />
                                    <span>Alterar foto</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* FIELDS */}
                    <h4>Nome e Descrição</h4>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome da banda"
                        value={form.name}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Descrição"
                        value={form.description}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        disabled={submitting}
                    />

                    <h4>Estilo musical e Ano de formação</h4>
                    <div className="row">
                        <input
                            type="text"
                            name="musicalGenre"
                            placeholder="Estilo musical"
                            value={form.musicalGenre}
                            onChange={handleChange}
                            disabled={submitting}
                            required
                        />

                        <input
                            type="number"
                            name="year"
                            placeholder="Ano de formação"
                            value={form.year}
                            onChange={handleChange}
                            min="1900"
                            max={new Date().getFullYear()}
                            disabled={submitting}
                            required
                        />
                    </div>

                    <h4>Localização</h4>
                    <div className="row location-row">
                        <input
                            type="text"
                            name="region"
                            placeholder="Região"
                            value={form.address.region}
                            onChange={handleAddressChange}
                            disabled={submitting}
                            required
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="Estado"
                            value={form.address.state}
                            onChange={handleAddressChange}
                            disabled={submitting}
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="Cidade"
                            value={form.address.city}
                            onChange={handleAddressChange}
                            disabled={submitting}
                            required
                        />
                    </div>

                    <h4>Membros e Instrumentos</h4>
                    {form.members.map((member, idx) => (
                        <div className="member-row" key={idx}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nome"
                                value={member.name}
                                onChange={(e) => handleMemberChange(idx, e)}
                                disabled={submitting}
                                required
                            />
                            <input
                                type="text"
                                name="instrument"
                                placeholder="Instrumento"
                                value={member.instrument}
                                onChange={(e) => handleMemberChange(idx, e)}
                                disabled={submitting}
                                required
                            />
                            {form.members.length > 1 && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeMember(idx)}
                                    disabled={submitting}
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="add-member-button"
                        onClick={addMember}
                        disabled={submitting}
                    >
                        + Adicionar membro
                    </button>

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
