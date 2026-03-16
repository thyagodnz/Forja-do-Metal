import Band from '../../models/Band.js'

export async function updateBand(req, res) {
    try {
        const { id } = req.params;

        const data = { ...req.body };

        if (data.address) {
            data.address = JSON.parse(data.address);
        }

        if (data.members) {
            data.members = JSON.parse(data.members);
        }

        if (req.files?.profilePicture) {
            data.profilePicture = req.files.profilePicture[0].path;
        }

        if (req.files?.coverPicture) {
            data.coverPicture = req.files.coverPicture[0].path;
        }

        const updated = await Band.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Banda não encontrada" });
        }

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}