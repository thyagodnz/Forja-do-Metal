import './header.css'
import logo from '../../assets/logo.png'

export default function Header() {

    return (

        <header className='header'>
            <div className="logo">
                <img src={logo} alt="Forja do Metal" />
            </div>
            <div className='header-buttons'>
                <h3>BANDAS</h3>
                <h3>SHOWS</h3>
                <h3>CADASTRO</h3>
            </div>
        </header>
    )
}