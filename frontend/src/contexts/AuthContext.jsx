import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [type, setType] = useState(null)
    const [loading, setLoading] = useState(true)

    async function refreshAuth() {
        try {
            const response = await api.get("/auth/me")

            setUser(response.data.user)
            setType(response.data.type)
        } catch {
            setUser(null)
            setType(null)
        }
    }

    async function checkAuth() {
        try {
            await refreshAuth()
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        try {
            await api.post("/auth/logout")
        } catch (error) {
            console.error(error)
        }

        setUser(null)
        setType(null)
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                type,
                setUser,
                setType,
                refreshAuth,
                logout,
                loading,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}