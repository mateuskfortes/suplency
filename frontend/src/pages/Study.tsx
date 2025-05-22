import Header from "../components/Header.tsx"
import Footer from "../components/Footer.tsx"
import Pomodoro from "../components/Pomodoro/Pomodoro.tsx"
import Calculator from "../components/Calculator/Calculator.tsx"
import Notebook from "../components/Notebook/Notebook.tsx"
import { Link } from "react-router-dom"
import '../assets/Study.scss'
import { useEffect, useState } from "react"
import { v4 as uuid } from 'uuid'
import NotebookConection, { GetNotebookRequest } from "../assets/notebookConection.ts"

const sbId = uuid()
const pgId = uuid()
export const defaultContent = {
    'last_subject': sbId,
    'subject': [
        {
            'id': sbId,
            'name': 'subject',
            'color': 'red',
            'last_page': pgId,
            'page': [
                {
                    'id': pgId,
                    'number': 0,
                    'color': 'green',
                    'content': [
                        {
                            type: 'paragraph', 
                            children: [{ text: '' }],
                        },
                    ],
                    'subject': sbId,
                }
            ]
        }
    ]
}

export default function Study() {
    const [notebookContent, setNotebookContent] = useState<any>(defaultContent)
    useEffect(() => {
        const okFunction = ({response, data}: any) => {
            const contentType = response.headers.get('content-type')
            if (contentType.includes('application/json')) {
                setNotebookContent(data)
            }
        }
        NotebookConection.add({requestClass: GetNotebookRequest, okFunction: okFunction})
            }, [])
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
                <Notebook content={notebookContent}/>
            </main>
            <Footer/>
        </>
    )
}