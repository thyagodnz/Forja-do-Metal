import Band from "../../models/Band.js";
import { deleteCloudinaryFolder } from "../../utils/deleteCloudinaryFolder.js";

export async function deleteBand(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID da banda não fornecido" });
    }

    const deletedBand = await Band.findByIdAndDelete(id);

    if (!deletedBand) {
      return res.status(404).json({ message: "Banda não encontrada" });
    }

    try {
      await deleteCloudinaryFolder(`forja-do-metal/bands/${id}`);
    } catch {
      // ignora completamente
    }

    return res.status(200).json({ message: "Banda deletada com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao deletar banda",
      error: error.message,
    });
  }
}
