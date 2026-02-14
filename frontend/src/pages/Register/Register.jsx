import './Register.css'

export default function Register() {

    return (
        <div className='container'>
            <h1>Cadastro da Banda</h1>
            <form>
                <label>
                    Nome da Banda:
                    <input type="text" />
                </label>
                <label>
                    E-mail:
                    <input type="email" />
                </label>
                <label>
                    Senha:
                    <input type="password" />
                </label>
                <label>
                    Data de Fundação:
                    <input type="date" />
                </label>
                <label>
                    Localização:
                    <input type="text" />
                </label>
                <label>
                    Membros e instrumentos:
                    <input type="text" />
                </label>
                <label>
                    Descrição / Biografia:
                    <input type="text" />
                </label>
                <label>
                    Estilo musical / Subgênero:
                    <input type="text" />
                </label>
                <label>
                    Imagem de capa ou logotipo:
                    <input type="file" />
                </label>
                <label>
                    Link das redes sociais:
                    <input type="text" />
                </label>
            </form>
            <button>
                Cadastrar
            </button>
        </div>
    )
}