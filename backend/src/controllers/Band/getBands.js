
import Band from '../../models/Band.js'

/**
 * GET /bands
 * Retorna todas as bandas
 */
export async function getBands(req, res) {
  try {
    const bands = await Band.find()
    return res.status(200).json(bands)
  } catch (error) {
    console.error('Erro ao buscar bandas:', error)
    return res.status(500).json({ message: 'Erro ao buscar bandas', error: error.message })
  }
}
