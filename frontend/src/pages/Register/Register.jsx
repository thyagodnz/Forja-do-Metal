import './Register.css'
import { useState } from 'react'
import api from '../../services/api.js'

export default function Register() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        date: '',
        description: '',
        musicalGenre: '',
        image: '',
        address: {
            region: '',
            state: '',
            city: ''
        },
        members: [
            { name: '', instrument: '' }
        ],
        socialLinks: [
            { platform: '', url: '' }
        ]
    })

    function handleChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleAddressChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }))
    }

    function handleMemberChange(index, e) {
        const { name, value } = e.target
        const updatedMembers = [...formData.members]
        updatedMembers[index][name] = value

        setFormData(prev => ({
            ...prev,
            members: updatedMembers
        }))
    }

    function addMember() {
        setFormData(prev => ({
            ...prev,
            members: [...prev.members, { name: '', instrument: '' }]
        }))
    }

    function removeMember(index) {
        if (formData.members.length === 1) return

        const updatedMembers = formData.members.filter((_, i) => i !== index)

        setFormData(prev => ({
            ...prev,
            members: updatedMembers
        }))
    }

    function handleSocialChange(index, e) {
        const { name, value } = e.target
        const updatedLinks = [...formData.socialLinks]
        updatedLinks[index][name] = value

        setFormData(prev => ({
            ...prev,
            socialLinks: updatedLinks
        }))
    }

    function addSocialLink() {
        setFormData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
        }))
    }

    function removeSocialLink(index) {
        if (formData.socialLinks.length === 1) return

        const updatedLinks = formData.socialLinks.filter((_, i) => i !== index)

        setFormData(prev => ({
            ...prev,
            socialLinks: updatedLinks
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const payload = {
            ...formData,
            address: [formData.address]
        }

        try {
            const response = await api.post('/bands', payload)
            alert('Banda cadastrada com sucesso!')
            console.log(response.data)
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message)
            } else {
                alert('Erro ao conectar com o servidor.')
            }
            console.error(error)
        }
    }

    return (
        <div className='container'>
            <h1>Cadastro da Banda</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Nome da Banda"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <h3>Endereço</h3>

                <input
                    type="text"
                    name="region"
                    placeholder="Região"
                    value={formData.address.region}
                    onChange={handleAddressChange}
                    required
                />

                <input
                    type="text"
                    name="state"
                    placeholder="Estado"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    required
                />

                <input
                    type="text"
                    name="city"
                    placeholder="Cidade"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    required
                />

                <h3>Membros</h3>

                {formData.members.map((member, index) => (
                    <div key={index} className="member-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome do membro"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, e)}
                            required
                        />

                        <input
                            type="text"
                            name="instrument"
                            placeholder="Instrumento"
                            value={member.instrument}
                            onChange={(e) => handleMemberChange(index, e)}
                            required
                        />

                        {formData.members.length > 1 && (
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => removeMember(index)}
                            >
                                Remover
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addMember}>
                    + Adicionar Membro
                </button>

                <input
                    type="text"
                    name="description"
                    placeholder="Descrição"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="musicalGenre"
                    placeholder="Estilo Musical"
                    value={formData.musicalGenre}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="image"
                    placeholder="URL da imagem"
                    value={formData.image}
                    onChange={handleChange}
                    required
                />

                <h3>Redes Sociais</h3>

                {formData.socialLinks.map((link, index) => (
                    <div key={index} className="social-group">

                        <select
                            name="platform"
                            value={link.platform}
                            onChange={(e) => handleSocialChange(index, e)}
                            required
                        >
                            <option value="">Selecione a plataforma</option>
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="youtube">YouTube</option>
                            <option value="spotify">Spotify</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter/X</option>
                        </select>

                        <input
                            type="url"
                            name="url"
                            placeholder="Link da rede social"
                            value={link.url}
                            onChange={(e) => handleSocialChange(index, e)}
                            required
                        />

                        {formData.socialLinks.length > 1 && (
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => removeSocialLink(index)}
                            >
                                Remover
                            </button>
                        )}

                    </div>
                ))}

                <button type="button" onClick={addSocialLink}>
                    + Adicionar Rede Social
                </button>

                <button type="submit" className='cadastrar-button'>Cadastrar</button>

            </form>
        </div>
    )
}
