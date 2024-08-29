import { useState } from "react"

interface types {
	question: string, 
	answer: string,
}

const Flashcard = ({question, answer}: types) => {
	const [isAnswerVisible, setIsAnswerVisible] = useState(false)

	function toggleAnswerVisibility() {
		setIsAnswerVisible(!isAnswerVisible)
	}

	return (
		<div>
			<h1>{question}</h1>
			{isAnswerVisible && <p>{answer}</p>}
			<div>
				<button onClick={toggleAnswerVisibility}>{isAnswerVisible ? 'Esconder resposta' : 'Mostrar resposta' }</button>
			</div>
		</div>
	)
}

export default Flashcard