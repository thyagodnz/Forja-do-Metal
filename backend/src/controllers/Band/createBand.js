import Band from "../../models/Band"

// Função para criar uma nova banda
export const createBand = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      date,
      address,
      members,
      description,
      musicalGenre,
      image,
      socialLinks
    } = req.body

    // Verifica se todos os campos obrigatórios foram enviados
    if (!name || !email || !password || !date || !address || !description || !musicalGenre || !image) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' })
    }

    // Verifica se já existe uma banda com o mesmo email
    const existingBand = await Band.findOne({ email })
    if (existingBand) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' })
    }

    // Cria uma nova instância de Band com os dados recebidos
    const newBand = new Band({
      name,
      email,
      password,
      date,
      address,
      members,
      description,
      musicalGenre,
      image,
      socialLinks
    })

    // Salva no banco
    await newBand.save()

    res.status(201).json({
      message: 'Banda criada com sucesso!',
      band: newBand
    })

  } catch (error) {
    console.error('Erro ao criar banda:', error)
    res.status(500).json({ message: 'Erro interno do servidor.', error })
  }
}
