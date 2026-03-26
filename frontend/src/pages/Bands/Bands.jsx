import "./Bands.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Loading from "../../components/Loading/Loading";
import BandCard from "../../components/BandCard/BandCard";
import { FiSearch } from "react-icons/fi";

export default function Bands() {
  const [bands, setBands] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBands() {
      try {
        setLoading(true);

        const response = await api.get("/bands", {
          params: { search },
        });

        setBands(response.data);
      } catch (error) {
        console.error("Erro ao buscar bandas:", error);
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(() => {
      fetchBands();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="bands-page-container">
      <section className="bands-page-section">
        <h1 className="bands-page-title">Bandas na Forja</h1>

        <h2 className="bands-page-subtitle">
          Explore todas as bandas da nossa comunidade
        </h2>

        <div className="bands-search-wrapper">
          <div className="bands-search-box">
            <FiSearch className="bands-search-icon" />

            <input
              type="text"
              placeholder="Buscar por nome, gênero musical ou ano..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bands-search-input"
            />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : bands.length > 0 ? (
          <div className="bands-page-grid">
            {bands.map((band) => (
              <BandCard key={band.id} band={band} showYear />
            ))}
          </div>
        ) : (
          <p className="bands-page-empty">
            Nenhuma banda encontrada para essa busca
          </p>
        )}
      </section>
    </div>
  );
}