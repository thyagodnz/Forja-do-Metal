import User from "../../models/User.js";

export async function updateUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id !== id || req.user.type !== "user") {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const { name, bio } = req.body;
    const data = {};

    if (name !== undefined) data.name = name;
    if (bio !== undefined) data.bio = bio;

    if (req.file) {
      data.profilePicture = req.file.path;
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    )
      .select("name bio profilePicture favoriteBands createdAt")
      .populate("favoriteBands", "name profilePicture");

    if (!updated) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
}
