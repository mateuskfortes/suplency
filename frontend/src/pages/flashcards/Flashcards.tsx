import { useEffect, useState } from "react"
import Flashcard from "../../components/Flashcard"

const content = [
	{
		id: 1,
		question: "Quem é viado?",
		answer: "José",
	},
	{
		id: 2,
		question: "Quantos anus você tem?",
		answer: "1 e ele é grande",
	},
	{
		id: 3,
		question: 'Nenê?',
		answer: 'Buaaaaaaaaaaaaaa',
	},
	{
		id: 4,
		question: 'O que o arthur falou da professora?',
		answer:'Vagabunda',
	}
]

const Flashcards = () => {
	const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(NaN)
	const [isRunning, setIsRunning] = useState(false)

	useEffect(() => {
		if (isRunning) {
		  setCurrentFlashcardIndex(0); 
		}
	  }, [isRunning]);

	function toggleIsRunning() {
		setIsRunning(!isRunning)
	}

	function nextFlashcard() {
		setCurrentFlashcardIndex(prevIndex => {
			const nextIndex = prevIndex + 1;
			return nextIndex < content.length ? nextIndex : 0; 
		  });
	}

	const fc = content[currentFlashcardIndex]

	return (
		<>
			{ isRunning && fc &&
				<div>
					<Flashcard key={fc.id} question={fc.question} answer={fc.answer} />
				
					<button onClick={nextFlashcard}>next</button>
				</div>
			}
			<button onClick={toggleIsRunning}>vai</button>
		</>
	)
}

export default Flashcards