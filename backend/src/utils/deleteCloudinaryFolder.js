import cloudinary from "../config/cloudinary.js";

export async function deleteCloudinaryFolder(folderPath) {
  try {
    // apaga todos os assets com esse prefixo, incluindo subpastas
    await cloudinary.api.delete_resources_by_prefix(folderPath);

    // tenta apagar subpasta de membros, se existir
    try {
      await cloudinary.api.delete_folder(`${folderPath}/members`);
    } catch (error) {
      if (error?.error?.message !== "Folder not found") {
        console.error("Erro ao deletar subpasta members:", error);
      }
    }

    // apaga a pasta principal
    try {
      await cloudinary.api.delete_folder(folderPath);
    } catch (error) {
      if (error?.error?.message !== "Folder not found") {
        console.error("Erro ao deletar pasta:", error);
      }
    }
  } catch (error) {
    console.error("Erro ao deletar recursos do Cloudinary:", error);
  }
}