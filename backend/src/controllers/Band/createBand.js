import Band from "../../models/Band.js"
import bcrypt from "bcrypt"

export async function createBand(req, res) {
  try {
    const {
      name,
      email,
      password,
      date,
      address,
      members,
      description,
      musicalGenre,
      image,
      socialLinks,
    } = req.body

    if (
      !name ||
      !email ||
      !password ||
      !date ||
      !address ||
      !description ||
      !musicalGenre ||
      !image
    ) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios" })
    }

    const existingBand = await Band.findOne({ email })
    if (existingBand) {
      return res
        .status(400)
        .json({ message: "Este e-mail já está cadastrado" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newBand = new Band({
      name,
      email,
      password: hashedPassword,
      date,
      address,
      members,
      description,
      musicalGenre,
      image,
      socialLinks,
    })

    await newBand.save()

    res.status(201).json({
      message: "Banda cadastrada com sucesso",
      band: newBand,
    })
  } catch (error) {
    console.error("Erro ao cadastrar banda:", error)
    res.status(500).json({ message: "Erro interno do servidor", error })
  }
}