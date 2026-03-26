import User from "../../models/User.js";

export async function getUsers(req, res) {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        return res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message })
    }
}