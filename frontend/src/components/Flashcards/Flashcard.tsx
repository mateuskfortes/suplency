import { useContext, useState } from "react"
import { MdDeleteForever } from "react-icons/md";
import { FlashcardsContext } from "../../pages/Flashcards";

interface types {
	id: string,
	question: string, 
	answer: string,
	show?: true | undefined,
}

const Flashcard = ({id, question, answer, show}: types) => {
	const {deleteFlashcard} = useContext(FlashcardsContext)
	const [isAnswerVisible, setIsAnswerVisible] = useState(false)

	function toggleAnswerVisibility() {
		setIsAnswerVisible(!isAnswerVisible)
	}
	
	const deleteFc = () => deleteFlashcard(id)

	return (
		<div className="flashcard">
			{show && <button className="delete" onClick={deleteFc}><MdDeleteForever /></button>}
			<div className="content">
				<h1 className="question">{question}</h1>
				{(isAnswerVisible || show) && <p className="answer">{answer}</p>}
			</div>
			{ !show && 
			<>
				<hr />
				<button onClick={toggleAnswerVisibility}>
					{isAnswerVisible ? 'Esconder resposta' : 'Mostrar resposta' }
				</button>
			</>
			}
		</div>
	)
}

export default Flashcard