import User from "../../models/User.js";
import Band from "../../models/Band.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Preencha email e senha" });
        }

        let account = await User.findOne({ email }).select("+password");
        let type = "user";

        if (!account) {
            account = await Band.findOne({ email }).select("+password");
            type = "band";
        }

        if (!account) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }

        const passwordMatch = await bcrypt.compare(password, account.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }

        const token = generateToken({
            id: account.id,
            type
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login realizado com sucesso",
            type,
            user: account.toJSON()
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}