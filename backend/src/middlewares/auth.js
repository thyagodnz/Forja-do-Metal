import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Band from "../models/Band.js";

dotenv.config();

export async function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { id, type } = decoded;

        let account;

        if (type === "user") {
            account = await User.findById(id).select("-password");
        } else if (type === "band") {
            account = await Band.findById(id).select("-password");
        } else {
            return res.status(401).json({ error: "Tipo de usuário inválido" });
        }

        if (!account) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        req.user = {
            id: account.id,
            type,
            data: account,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expirado" });
        }

        return res.status(401).json({ error: "Token inválido" });
    }
}