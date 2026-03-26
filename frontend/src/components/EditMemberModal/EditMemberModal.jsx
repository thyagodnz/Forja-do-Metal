import "./EditMemberModal.css";
import { useEffect, useState } from "react";
import { FiCamera, FiMusic, FiX } from "react-icons/fi";

export default function EditMemberModal({
  member,
  memberId,
  onClose,
  onSave,
  submitting = false,
}) {
  const [bio, setBio] = useState(member.bio || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(member.photo || "");

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

      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [onClose, photoPreview]);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      memberId,
      bio,
      photoFile,
      currentPhoto: member.photo || "",
    });
  }

  function handleOverlayClick() {
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.toString && sel.toString().length > 0) return;
    onClose();
  }

  return (
    <div className="edit-modal-overlay" onMouseDown={handleOverlayClick}>
      <div
        className="edit-modal member-edit-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Editar membro</h2>

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
          <div className="member-edit-top">
            <label className="member-edit-photo-label">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoChange}
                disabled={submitting}
              />

              <div className="member-edit-photo-preview" title="Alterar foto">
                {photoPreview ? (
                  <img src={photoPreview} alt={member.name} />
                ) : (
                  <div className="member-edit-photo-placeholder">
                    <FiMusic />
                  </div>
                )}

                <div className="member-edit-photo-overlay">
                  <FiCamera />
                  <span>Alterar foto</span>
                </div>
              </div>
            </label>

            <div className="member-edit-basic-info">
              <h3>{member.name}</h3>
              <p>{member.instrument}</p>
            </div>
          </div>

          <h4>Bio</h4>
          <textarea
            name="bio"
            placeholder="Fale mais sobre este membro"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={submitting}
          />

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