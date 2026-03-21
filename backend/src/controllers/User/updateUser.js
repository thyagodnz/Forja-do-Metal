import User from "../../models/User.js";

export async function updateUser(req, res) {
    try {

        const { id } = req.params;

        const data = { ...req.body };

        // logica atualizar usuário

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}