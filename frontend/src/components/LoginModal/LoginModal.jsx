import "./LoginModal.css"
import { useState, useEffect } from "react"

export default function LoginModal({ onClose }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleSubmit(e) {
        e.preventDefault()
        console.log({ email, password })
        onClose()
    }

    useEffect(() => {
        document.body.style.overflow = "hidden"

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = "auto"
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [onClose])

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Entrar na Forja do Metal</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="login-submit">
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}