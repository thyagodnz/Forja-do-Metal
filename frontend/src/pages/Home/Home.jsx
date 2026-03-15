import "./Home.css"
import { useEffect, useState } from "react"
import api from "../../services/api"
import { Link } from "react-router-dom"
import Loading from "../../components/Loading/Loading"

export default function Home() {

    const [bands, setBands] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBands() {
            try {

                const response = await api.get("/bands/recent")
                setBands(response.data)

            } catch (error) {
                console.error("Erro ao buscar bandas:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBands()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <div className="home-container">

            {/* HERO */}
            <section className="hero">

                <div className="hero-content">

                    <h1>Forja do Metal</h1>

                    <p>
                        Descubra bandas, conecte-se com músicos
                        e fortaleça a cena underground
                    </p>

                    <Link to="/bandas" className="hero-button">
                        Explorar bandas →
                    </Link>

                </div>

            </section>


            {/* BANDAS RECENTES */}
            <section className="recent-bands-section">

                <h2 className="home-title">
                    Recém-chegadas na Forja
                </h2>

                <h3 className="home-subtitle">
                    Confira as bandas que acabaram de entrar para a nossa comunidade
                </h3>

                <div className="bands-grid">

                    {bands.map((band) => (
                        <Link
                            key={band.id}
                            to={`/perfil/${band.id}`}
                            className="band-card"
                        >

                            <div className="band-image">

                                {band.profilePicture ? (
                                    <img
                                        src={band.profilePicture}
                                        alt={`Imagem da banda ${band.name}`}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="band-placeholder">🎸</div>
                                )}

                            </div>

                            <div className="band-info">
                                <h3>{band.name}</h3>
                                <p>{band.musicalGenre}</p>
                            </div>

                        </Link>
                    ))}

                </div>

                {bands.length === 6 && (
                    <div className="see-more-container">

                        <Link
                            to="/bandas"
                            className="see-more-button"
                        >
                            Veja mais
                        </Link>

                    </div>
                )}

            </section>

        </div>
    )
}
