
import Band from '../../models/Band.js'

// Função para deletar uma banda pelo ID
export async function deleteBand(req, res) {
    try {
        const { id } = req.params

        // Verifica se o ID foi passado
        if (!id) {
            return res.status(400).json({ message: 'ID da banda não fornecido.' })
        }

        // Tenta encontrar e deletar a banda
        const deletedBand = await Band.findByIdAndDelete(id)

        // Caso não encontre a banda
        if (!deletedBand) {
            return res.status(404).json({ message: 'Banda não encontrada.' })
        }

        // Sucesso
        return res.status(200).json({ message: 'Banda deletada com sucesso.' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao deletar banda.', error: error.message })
    }
}
