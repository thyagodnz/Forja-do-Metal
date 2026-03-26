import Band from "../../models/Band.js";

export async function getBands(req, res) {
  try {
    const { search = "" } = req.query;

    const filters = {};

    if (search.trim()) {
      const trimmedSearch = search.trim();
      const yearNumber = Number(trimmedSearch);

      filters.$or = [
        { name: { $regex: trimmedSearch, $options: "i" } },
        { musicalGenre: { $regex: trimmedSearch, $options: "i" } },
      ];

      if (!Number.isNaN(yearNumber)) {
        filters.$or.push({ year: yearNumber });
      }
    }

    const bands = await Band.find(filters)
      .select("name musicalGenre year profilePicture createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json(bands);
  } catch (error) {
    console.error("Erro ao buscar bandas:", error);
    return res.status(500).json({
      message: "Erro ao buscar bandas",
      error: error.message,
    });
  }
}