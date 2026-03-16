import jwt from 'jsonwebtoken'
import Band from '../models/Band.js'
import dotenv from 'dotenv'

dotenv.config()

export async function auth(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: 'Não autorizado' })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const band = await Band.findById(decoded.id).select('-password')

        if (!band) {
            return res.status(401).json({ error: 'Usuário não encontrado' })
        }

        req.user = band

        next()

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expirado" })
        }

        return res.status(401).json({ error: 'Token inválido' })
    }
}