import cloudinary from "../config/cloudinary.js";

export async function deleteCloudinaryFolder(folderPath) {
  try {
    await cloudinary.api.delete_resources_by_prefix(folderPath);

    try {
      await cloudinary.api.delete_folder(folderPath);
    } catch (error) {
      // pasta pode não existir → ignorar
      if (error?.error?.message !== "Folder not found") {
        console.error("Erro ao deletar pasta:", error);
      }
    }

  } catch (error) {
    console.error("Erro ao deletar recursos do Cloudinary:", error);
  }
}