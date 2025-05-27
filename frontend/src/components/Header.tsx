import { Link } from 'react-router-dom'
import grid_background from '../assets/grid_background.svg'
import '../styles/Header.scss'
import { useState } from 'react'
import logoutHandler from '../services/logoutHandler';
 
export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    const handlerLogout = async () => {
        setIsLoggedIn(false)
        logoutHandler()
    }

    return (
        <>
            <img src={grid_background} className='grid_background' alt="" />
            <header>
                <div className="interface">
                    <span className="logo">
                        <Link to='/'>
                            <img src={"/static/icons/suplency.png"}  alt="Suplency logo"/>
                        </Link>
                    </span>

                    <nav className="menu_desktop">
                        <ul>
                            <li><Link to='#'>Suporte</Link></li>
                            <li><Link to='#'>Como usar?</Link></li>
                            <li><Link to='#'>Quem somos?</Link></li>
                            <li>
                                { isLoggedIn ? <a onClick={handlerLogout}>Logout</a> : <Link to='/account/login/'>Login</Link> }
                            </li>
                        </ul>
                    </nav>

                    <Link to="/account/sing-up/" className="registration_space">
                        <span className="button register_button">Cadastre-se</span>
                    </Link>
                </div>
            </header>
        </>
    )
}