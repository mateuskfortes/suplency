import { Link } from 'react-router-dom'
import grid_background from '../assets/grid_background.svg'
import '../assets/Header.scss'
import { useState } from 'react'
 
export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    const handlerLogout = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:80/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            
            if (response.ok) {
                setIsLoggedIn(false)
                localStorage.setItem('isLoggedIn', 'false');
            }
        } 
        catch (error) {
            alert('Ocorreu um erro ao tentar se conectar ao servidor.');
        }
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