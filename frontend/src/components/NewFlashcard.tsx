import { useContext, useState } from "react"
import { FlashcardsContext } from "../pages/Flashcards"

const NewFlashcard = () => {
    const {addFlashcard, toggleIsNewFlashcardVisible} = useContext(FlashcardsContext)
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')

    const create = () => {
        addFlashcard(question, answer)
        toggleIsNewFlashcardVisible()
    }

    return (
        <div className="new_flashcard_container">
            <div className="flashcard">
                <div className="content">
                    <input className="question" type="text" placeholder="Pergunta:" onChange={e => setQuestion(e.target.value)} />
                    <input className="answer" type="text" placeholder="Resposta:" onChange={e => setAnswer(e.target.value)} />
                </div>
            </div>
            <div className="button_area">
                <button onClick={create}>Criar</button>
                <button onClick={toggleIsNewFlashcardVisible}>Cancelar</button>
            </div>
        </div>
    )
}

export default NewFlashcard