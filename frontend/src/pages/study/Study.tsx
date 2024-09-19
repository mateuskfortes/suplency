import Header from "../../components/Header.tsx"
import Footer from "../../components/Footer.tsx"
import Pomodoro from "./Pomodoro.tsx"
import Calculator from "./Calculator.tsx"
import Notebook from "./Notebook.tsx"
import '../../assets/Study.scss'

export default function Study() {
    return (
        <>
            <Header/>
            <main className="study_content">
                <section>
                    <Pomodoro/>
                    <Calculator />
                </section>
                <Notebook />
            </main>
            <Footer/>
        </>
    )
}