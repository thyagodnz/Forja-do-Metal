import mongoose from "mongoose";
import User from "../../models/User.js";
import Band from "../../models/Band.js";

export async function toggleFavoriteBand(req, res) {
  try {
    const { bandId } = req.params;

    if (req.user.type !== "user") {
      return res.status(403).json({
        message: "Apenas usuários podem favoritar bandas",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bandId)) {
      return res.status(400).json({
        message: "ID da banda inválido",
      });
    }

    const bandExists = await Band.findById(bandId);

    if (!bandExists) {
      return res.status(404).json({
        message: "Banda não encontrada",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    const isFavorite = user.favoriteBands.some(
      (favoriteId) => favoriteId.toString() === bandId
    );

    let updatedUser;

    if (isFavorite) {
      updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { favoriteBands: bandId } },
        { new: true }
      ).select("name bio profilePicture favoriteBands createdAt");
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { favoriteBands: bandId } },
        { new: true }
      ).select("name bio profilePicture favoriteBands createdAt");
    }

    return res.status(200).json({
      message: isFavorite
        ? "Banda removida dos favoritos"
        : "Banda adicionada aos favoritos",
      favorited: !isFavorite,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao favoritar/desfavoritar banda:", error);
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}