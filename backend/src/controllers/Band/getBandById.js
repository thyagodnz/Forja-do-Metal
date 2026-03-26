import Band from "../../models/Band.js";

export async function getBandById(req, res) {
  try {
    const { id } = req.params;

    const band = await Band.findById(id).select(
      "name description year musicalGenre address members profilePicture coverPicture socialLinks createdAt",
    );

    if (!band) {
      return res.status(404).json({ message: "Banda não encontrada" });
    }

    return res.json(band);
  } catch (error) {
    console.error("Erro ao buscar banda:", error);

    return res.status(500).json({ message: "Erro ao buscar banda" });
  }
}
