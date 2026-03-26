import User from "../../models/User.js";
import { deleteCloudinaryFolder } from "../../utils/deleteCloudinaryFolder.js";

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID do usuário não fornecido" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    try {
      await deleteCloudinaryFolder(`forja-do-metal/users/${id}`);
    } catch {
      // ignora completamente
    }

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao deletar usuário",
      error: error.message,
    });
  }
}
