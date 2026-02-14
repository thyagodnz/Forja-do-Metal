import './Navbar.css'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav>
            <NavLink to='/'>BANDAS</NavLink>
            <NavLink to='/'>SHOWS</NavLink>
            <NavLink to='/register'>CADASTRO</NavLink>
        </nav>
    )
}

export default Navbar