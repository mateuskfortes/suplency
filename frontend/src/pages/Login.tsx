import { Link } from "react-router-dom"
import AccountInput from "../components/AccountInput"
import Header from "../components/Header"
import '../assets/Account.scss'

const Login = () => {
    return (
        <>
            <Header />
            <main className="account_container">
                <section>
                    <h1>CADASTRO</h1>
                    <h2>Fique conectado!</h2>
                    <form>
                        <AccountInput id='i1' label='Nome de usuário ou Email' />
                        <AccountInput id='i2' label='Senha' />
                        <button type="submit">Entrar</button>
                    </form>
                    <p>Não tem uma conta? <Link to='/account/sing-up/'>Clique aqui para cadastrar</Link></p>
                </section>
            </main>
        </>
    )
}

export default Login