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
		<div className="flashcard">
			<div className="content">
				<h1>{question}</h1>
				{isAnswerVisible && <p>{answer}</p>}
			</div>
			<hr />
			<button onClick={toggleAnswerVisibility}>{isAnswerVisible ? 'Esconder resposta' : 'Mostrar resposta' }</button>
		</div>
	)
}

export default Flashcard