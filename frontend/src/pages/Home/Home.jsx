import "./Home.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import BandCard from "../../components/BandCard/BandCard";

export default function Home() {
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBands() {
      try {
        const response = await api.get("/bands/recent");
        setBands(response.data);
      } catch (error) {
        console.error("Erro ao buscar bandas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBands();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Forja do Metal</h1>

          <p>
            Descubra bandas, conecte-se com músicos e fortaleça a cena
            underground
          </p>

          <Link to="/bandas" className="hero-button">
            Explorar bandas →
          </Link>
        </div>
      </section>

      <section className="recent-bands-section">
        <h2 className="home-title">Recém-chegadas na Forja</h2>

        <h3 className="home-subtitle">
          Confira as bandas que acabaram de entrar para a nossa comunidade
        </h3>

        <div className="bands-grid">
          {bands.map((band) => (
            <BandCard key={band.id} band={band} />
          ))}
        </div>

        {bands.length === 6 && (
          <div className="see-more-container">
            <Link to="/bandas" className="see-more-button">
              Veja mais
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}