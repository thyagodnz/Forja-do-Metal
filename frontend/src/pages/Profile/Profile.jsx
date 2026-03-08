import "./Profile.css"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

export default function Profile() {

    const { id } = useParams()
    const navigate = useNavigate()

    const { user, logout } = useAuth()

    const [band, setBand] = useState(null)

    useEffect(() => {
        async function loadBand() {
            try {
                const response = await api.get(`/bands/${id}`)
                setBand(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        loadBand()
    }, [id])

    async function handleLogout() {
        await logout()
        navigate("/")
    }

    if (!band) {
        return <p>Carregando...</p>
    }

    const isOwner = user && user.id === band.id

    return (
        <div className="profile-container">

            <h1>{band.name}</h1>

            {isOwner && (
                <button onClick={handleLogout}>
                    Sair
                </button>
            )}

        </div>
    )
}