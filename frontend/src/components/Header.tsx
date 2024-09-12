import { Link } from 'react-router-dom'
import grid_background from '../assets/grid_background.svg'
import '../assets/Header.scss'
 
export default function Header() {
    return (
        <>
            <img src={grid_background} className='grid_background' alt="" />
            <header>
                <div className="interface">
                    <span className="logo">
                        <Link to='/'>
                            <img src={"/icons/suplency.png"}  alt="Suplency logo"/>
                        </Link>
                    </span>

                    <nav className="menu_desktop">
                        <ul>
                            <li><Link to='#'>Suporte</Link></li>
                            <li><Link to='#'>Como usar?</Link></li>
                            <li><Link to='#'>Quem somos?</Link></li>
                            <li><Link to='/account/login/'>Login</Link></li>
                        </ul>
                    </nav>

                    <Link to="/account/singup/" className="registration_space">
                        <span className="button register_button">Cadastre-se</span>
                    </Link>
                </div>
            </header>
        </>
    )
}