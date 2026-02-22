import Band from "../../models/Band.js";
import bcrypt from "bcrypt";

export async function createBand(req, res) {
  try {
    const { name, email, password, address, members, year, musicalGenre } = req.body;

    if (!name || !email || !password || !address || !members || !year || !musicalGenre) {
      return res.status(400).json({ message: "Preencha todos os campos" });
    }

    const existingBand = await Band.findOne({ email });

    if (existingBand) {
      return res
        .status(400)
        .json({ message: "Este e-mail já está cadastrado" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "A senha deve ter pelo menos 8 caracteres" });
    }

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

    res.status(201).json({
      message: "Banda cadastrada com sucesso",
      band: newBand,
    });
  } catch (error) {
    console.error("Erro ao cadastrar banda:", error);
    res.status(500).json({ message: "Erro interno do servidor", error });
  }
}
