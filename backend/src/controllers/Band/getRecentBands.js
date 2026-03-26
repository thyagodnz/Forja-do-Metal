import Band from "../../models/Band.js";

export async function getRecentBands(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const bands = await Band
      .find()
      .select("name profilePicture musicalGenre")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json(bands);

  } catch (error) {
    console.error("Erro ao buscar bandas recentes:", error);
    return res.status(500).json({
      message: "Erro interno do servidor"
    });
  }
}