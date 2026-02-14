import './header.css'
import logo from '../../assets/logo.png'
import Navbar from '../Navbar/Navbar.jsx'

const Header = () => {
    return (
        <header className='header'>
            <div className="logo">
                <img src={logo} alt="Forja do Metal" />
            </div>
            <Navbar />
        </header>
    )
}

export default Header