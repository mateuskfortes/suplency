import Header from "../../components/header/Header.tsx"
import Footer from "../../components/footer/Footer.tsx"
import Pomodoro from "./Pomodoro.tsx"
import Calculator from './Calculator.tsx'

export default function Study() {
    return (
        <>
            <Header/>
            <Pomodoro />
            <Calculator/>
            <Footer/>
        </>
    )
}