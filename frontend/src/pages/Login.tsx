import { Link, useNavigate } from "react-router-dom"
import AccountInput from "../components/AccountInput"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import fetchHandler from "../services/fetchHandler"
import '../styles/Account.scss'

const Login = () => {
    const [nameOrEmail, setNameOrEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') navigate('/study') // Go to study page if the user is logged in
    })

    const handlerSubmit = async (e: any) => {
        e.preventDefault()
        const userData = {
            'nameOrEmail': nameOrEmail,
            'password': password,
        }
        fetchHandler('login', 
                'POST', 
                ({}) => {
                    localStorage.setItem('isLoggedIn', 'true');
                    navigate('/study')
                },
                ({}) => alert('Credenciais inválidas'),
                userData)
            
    }

    return (
        <>
            <Header />
            <main className="account_container">
                <section>
                    <h1>LOGIN</h1>
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