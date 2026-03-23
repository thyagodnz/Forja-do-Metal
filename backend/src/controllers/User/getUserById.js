import User from "../../models/User.js";

export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("name bio profilePicture favoriteBands createdAt")
      .populate("favoriteBands", "name profilePicture");

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}