import Band from "../../models/Band.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";
import { sortBandMembers } from "../../utils/sortBandMembers.js";

export async function createBand(req, res) {
  try {
    let { name, email, password, address, members, year, musicalGenre } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !members ||
      !year ||
      !musicalGenre
    ) {
      return res.status(400).json({
        message: "Preencha todos os campos",
      });
    }

    const existingBand = await Band.findOne({ email });

    if (existingBand) {
      return res.status(400).json({
        message: "Este e-mail já está cadastrado",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "A senha deve ter pelo menos 8 caracteres",
      });
    }

    if (typeof address === "string") {
      address = JSON.parse(address);
    }

    if (typeof members === "string") {
      members = JSON.parse(members);
    }

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        message: "A banda deve ter pelo menos um membro",
      });
    }

    members = sortBandMembers(members);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBand = new Band({
      name,
      email,
      password: hashedPassword,
      address,
      members,
      year,
      musicalGenre,
    });

    await newBand.save();

    const token = generateToken({
      id: newBand.id,
      type: "band",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Banda cadastrada com sucesso",
      type: "band",
      user: newBand.toJSON(),
    });
  } catch (error) {
    console.error("Erro ao cadastrar banda:", error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}
