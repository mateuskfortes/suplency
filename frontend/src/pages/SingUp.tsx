import { Link } from "react-router-dom"
import AccountInput from "../components/AccountInput"
import Header from "../components/Header"
import '../assets/Account.scss'

const SingUp = () => {
    return(
        <>
            <Header />
            <main className="account_container">
                <section>
                    <h1>CADASTRO</h1>
                    <h2>Fique conectado!</h2>
                    <form>
                        <AccountInput id='i1' label='Nome de usuário' />
                        <AccountInput id='i2' label='Email' />
                        <AccountInput id='i3' label='Senha' />
                        <AccountInput id='i4' label='Confirme sua senha' />
                        <button type="submit">Cadastrar</button>
                    </form>
                    <p>Já tem uma conta? <Link to='/account/login/'>Clique aqui para logar</Link></p>
                </section>
            </main>
        </>
    )
}

export default SingUp