import "./Home.css"
import { useEffect, useState } from "react"
import api from "../../services/api"
import { Link } from "react-router-dom"

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
        return <p className="home-loading">Carregando bandas...</p>
    }

    return (
        <div className="home-container">

            <section className="recent-bands-section">

                <h1 className="home-title">
                    Recém-chegadas na Forja
                </h1>
                <h2 className="home-subtitle">
                    Confira as bandas que acabaram de entrar para a nossa comunidade
                </h2>

                <div className="bands-grid">

                    {bands.map((band) => (
                        <Link
                            key={band.id}
                            to={`/perfil/${band.id}`}
                            className="band-card"
                        >

                            <div className="band-image">
                                {band.image ? (
                                    <img src={band.image} alt={band.name} />
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
                        <Link to="/bandas" className="see-more-button">
                            Veja mais
                        </Link>
                    </div>
                )}

            </section>

        </div>
    )
}