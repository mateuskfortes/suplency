import Header from "../components/Header.tsx"
import Footer from "../components/Footer.tsx"
import Pomodoro from "../components/Pomodoro/Pomodoro.tsx"
import Calculator from "../components/Calculator/Calculator.tsx"
import Notebook from "../components/Notebook/Notebook.tsx"
import { Link } from "react-router-dom"
import '../assets/Study.scss'

export default function Study() {
    return (
        <>
            <Header/>
            <main className="study_content">
                <section className="top">
                    <section className="left">
                        <div className="title">
                            <h1>Hora de <br />Estudar</h1>
                            <p>Já tomou seu cafézinho?</p>
                        </div>
                        <div className="flashcards_link">
                            <div>
                                <h1 className="part1">ir para</h1>
                                <h1 className="part2">Flashcards</h1>
                            </div>
                            <Link to='flashcards' className="link" >Ir para Área dos Flahscards</Link>
                        </div>
                    </section>
                    <section className="right">
                        <Pomodoro/>
                        <Calculator />
                    </section>
                </section>
                <Notebook />
            </main>
            <Footer/>
        </>
    )
}