import { Link, useNavigate } from "react-router-dom"
import AccountInput from "../components/AccountInput"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import '../assets/Account.scss'
import fetchHandler from "../assets/fetchHandler"

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [response, setResponse] = useState<any>()

    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') navigate('/study') // Go to study page if the user is logged in
    })

    const handlerSubmit = async (e: any) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }
        const userData = {
            username,
            email,
            password,
        };
        fetchHandler('register', 
                    'POST', 
                    ({}) => {
                        localStorage.setItem('isLoggedIn', 'true');
                        navigate('/study');
                    },
                    ({data}) => setResponse(data),
                    JSON.stringify(userData))
    }

    return(
        <>
            <Header />
            <main className="account_container">
                <section>
                    <h1>CADASTRO</h1>
                    <h2>Fique conectado!</h2>
                    <form onSubmit={handlerSubmit}>
                        <AccountInput onChange={(e: any) => setUsername(e.target.value)} id='i1' label='Nome de usuário'  errors={response?.username} />
                        <AccountInput onChange={(e: any) => setEmail(e.target.value)} id='i2' label='Email' errors={response?.email} />
                        <AccountInput onChange={(e: any) => setPassword(e.target.value)} id='i3' label='Senha'  errors={response?.password} />
                        <AccountInput onChange={(e: any) => setConfirmPassword(e.target.value)} id='i4' label='Confirme sua senha' />
                        <button type="submit">Cadastrar</button>
                    </form>
                    <p>Já tem uma conta? <Link to='/account/login/'>Clique aqui para logar</Link></p>
                </section>
            </main>
        </>
    )
}

export default SignUp