import { Link, useNavigate } from "react-router-dom"
import AccountInput from "../components/AccountInput"
import Header from "../components/Header"
import { useState } from "react"
import '../assets/Account.scss'

const Login = () => {
    const [nameOrEmail, setNameOrEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    
    const handlerSubmit = async (e: any) => {
        e.preventDefault()
        const userData = {
            'nameOrEmail': nameOrEmail,
            'password': password,
        }
        try {
            const response = await fetch(`${window.location.origin}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) navigate('/study')
            else alert('Erro ao efetuar o login.')
        }
        catch (error) {
            alert('Ocorreu um erro ao tentar se conectar ao servidor.');
        }
    }

    return (
        <>
            <Header />
            <main className="account_container">
                <section>
                    <h1>CADASTRO</h1>
                    <h2>Fique conectado!</h2>
                    <form onSubmit={handlerSubmit}>
                        <AccountInput id='i1' onChange={(e: any) => setNameOrEmail(e.target.value)} label='Nome de usuário ou Email' />
                        <AccountInput id='i2' onChange={(e: any) => setPassword(e.target.value)} label='Senha' />
                        <button type="submit">Entrar</button>
                    </form>
                    <p>Não tem uma conta? <Link to='/account/sing-up/'>Clique aqui para cadastrar</Link></p>
                </section>
            </main>
        </>
    )
}

export default Login