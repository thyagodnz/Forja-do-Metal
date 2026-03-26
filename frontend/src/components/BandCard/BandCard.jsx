import "./BandCard.css";
import { Link } from "react-router-dom";
import { FiMusic, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function BandCard({
  band,
  showGenre = true,
  showYear = false,
  className = "",
  showFavoriteButton = false,
  isFavorite = false,
  favoriteDisabled = false,
  onFavoriteClick,
}) {
  return (
    <div className={`band-card ${className}`.trim()}>
      <Link to={`/perfil-banda/${band.id}`} className="band-card-link">
        <div className="band-image">
          {band.profilePicture ? (
            <img
              src={band.profilePicture}
              alt={`Imagem da banda ${band.name}`}
              loading="lazy"
            />
          ) : (
            <div className="band-placeholder">
              <FiMusic />
            </div>
          )}
        </div>

        <div className="band-info">
          <h3>{band.name}</h3>
          {showGenre && <p>{band.musicalGenre}</p>}
          {showYear && <span>{band.year}</span>}
        </div>
      </Link>

      {showFavoriteButton && (
        <button
          type="button"
          className={`band-favorite-button ${isFavorite ? "favorited" : ""}`}
          onClick={onFavoriteClick}
          disabled={favoriteDisabled}
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
    </div>
  );
}