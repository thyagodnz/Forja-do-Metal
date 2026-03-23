import cloudinary from "../config/cloudinary.js";

function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];

    // remove transformação, se existir
    const segments = path.split("/");
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));

    if (versionIndex === -1) return null;

    const publicIdWithExtension = segments.slice(versionIndex + 1).join("/");

    return publicIdWithExtension.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

export async function deleteCloudinaryAssetByUrl(url) {
  try {
    const publicId = extractPublicIdFromUrl(url);

    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Erro ao deletar asset do Cloudinary:", error);
  }
}