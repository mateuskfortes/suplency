import { Link, useNavigate } from "react-router-dom"
import AccountInput from "../components/AccountInput"
import Header from "../components/Header"
import { useState } from "react"
import '../assets/Account.scss'

const SingUp = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

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
        try {
            const response = await fetch(`${window.location.origin}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) navigate('/study')
            else alert('Erro ao cadastrar o usuário.');
        } 
        catch (error) {
            alert('Ocorreu um erro ao tentar se conectar ao servidor.');
        }
    }

    return(
        <>
            <Header />
            <main className="account_container">
                <section>
                    <h1>CADASTRO</h1>
                    <h2>Fique conectado!</h2>
                    <form onSubmit={handlerSubmit}>
                        <AccountInput onChange={(e: any) => setUsername(e.target.value)} id='i1' label='Nome de usuário' />
                        <AccountInput onChange={(e: any) => setEmail(e.target.value)} id='i2' label='Email' />
                        <AccountInput onChange={(e: any) => setPassword(e.target.value)} id='i3' label='Senha' />
                        <AccountInput onChange={(e: any) => setConfirmPassword(e.target.value)} id='i4' label='Confirme sua senha' />
                        <button type="submit">Cadastrar</button>
                    </form>
                    <p>Já tem uma conta? <Link to='/account/login/'>Clique aqui para logar</Link></p>
                </section>
            </main>
        </>
    )
}

export default SingUp