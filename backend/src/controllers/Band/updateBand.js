import Band from '../../models/Band.js'
export async function updateBand(req, res) {
    try {
        const { id } = req.params

        // Atualiza tudo que vier no body
        const updated = await Band.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ message: 'Banda não encontrada' })
        }

        return res.json(updated)

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
