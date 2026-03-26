export async function me(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Não autorizado" });
        }

        return res.status(200).json({
            type: req.user.type,
            user: req.user.data
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno no servidor"
        });
    }
}