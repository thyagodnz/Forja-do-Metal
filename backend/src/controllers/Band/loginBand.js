import Band from "../../models/Band.js"
import bcrypt from "bcrypt"
import { generateToken } from "../../utils/generateToken.js"

export async function loginBand(req, res) {
  try {

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Preencha email e senha" })
    }

    const band = await Band.findOne({ email }).select("+password")

    if (!band) {
      return res.status(400).json({ message: "Email ou senha inválidos" })
    }

    const passwordMatch = await bcrypt.compare(password, band.password)

    if (!passwordMatch) {
      return res.status(400).json({ message: "Email ou senha inválidos" })
    }

    const token = generateToken(band)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      message: "Login realizado com sucesso",
      band: band.toJSON()
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}