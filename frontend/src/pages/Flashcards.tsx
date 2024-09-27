import { createContext, useEffect, useState } from "react"
import Flashcard from "../components/Flashcard"
import Header from "../components/Header"
import Footer from "../components/Footer"
import '../assets/Flashcards.scss'
import NewFlashcard from "../components/NewFlashcard"

const flashcardsC = [
    {
        id: '1',
        question: "Qual é a capital do Brasil?",
        answer: "Brasília",
    },
    {
        id: '2',
        question: "Quantos continentes existem no mundo?",
        answer: "7",
    },
    {
        id: '3',
        question: "Quem escreveu 'Dom Quixote'?",
        answer: "Miguel de Cervantes",
    },
    {
        id: '4',
        question: "O que é fotossíntese?",
        answer: "Processo pelo qual as plantas produzem seu alimento utilizando luz solar, água e dióxido de carbono.",
    },
    {
        id: '5',
        question: "Qual o maior planeta do sistema solar?",
        answer: "Júpiter",
    }
];

export const FlashcardsContext = createContext({
	flashcards: [{id: '', question: '', answer: ''}],
	addFlashcard: (question: string, answer: string) => {[question, answer]},
	toggleIsNewFlashcardVisible: () => {},
	deleteFlashcard: (id: string) => {id},
})

const Flashcards = () => {
	const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(NaN)
	const [flashcards, setFlashcards] = useState(flashcardsC)
	const [isRunning, setIsRunning] = useState(false)
	const [isNewFlashcardVisible, setIsNewFlashcardVisible] = useState(false)
	const [currentNewId, setCurrentNewId] = useState(-1)

	useEffect(() => {
		if (isRunning) setCurrentFlashcardIndex(0); 
	}, [isRunning]);

	const addFlashcard = (question: string, answer: string) => {
		setFlashcards([
			...flashcards,
			{
			id: currentNewId.toString(),
			question: question,
			answer: answer,
		}])
		setCurrentNewId(currentNewId-1)
		setIsRunning(false)
	}
	const toggleIsNewFlashcardVisible = () => setIsNewFlashcardVisible(!isNewFlashcardVisible)

	function toggleIsRunning() {
		setIsRunning(!isRunning)
	}

	function nextFlashcard() {
		setCurrentFlashcardIndex(prevIndex => {
			const nextIndex = prevIndex + 1;
			return nextIndex < flashcards.length ? nextIndex : 0; 
		  });
	}

	const deleteFlashcard = (id: string) => setFlashcards(flashcards.filter((fc: any) => fc.id !== id))

	const deleteAll = () => {
		if(window.confirm('Tem certeza que deseja excluir todos os flashcards?')) {
			setFlashcards([])
		}
		setIsRunning(false)
	}

	const fc = flashcards[currentFlashcardIndex]

	return (
		<FlashcardsContext.Provider value={{flashcards, addFlashcard, toggleIsNewFlashcardVisible, deleteFlashcard}}>
			<>
				<Header />
				<div className="flashcards">
					<section className="button_area">
						<button onClick={toggleIsRunning}>{isRunning ? 'Parar' : 'Iniciar' }</button>
						<button onClick={toggleIsNewFlashcardVisible}>Novo flashcard</button>
						<button onClick={deleteAll} >Deletar todos</button>
					</section>
					<section className="flashcard_area">
						{isNewFlashcardVisible && <NewFlashcard />}
						{ isRunning && fc ?
							<div className="flashcard_container">
								<Flashcard key={fc.id} id={fc.id} question={fc.question} answer={fc.answer} />
							
								<button className="white_button" onClick={nextFlashcard}>next</button>
							</div>
							:
							<div className="flashcard_container">
								{flashcards.map((fc: any) => <Flashcard key={fc.id} id={fc.id} question={fc.question} answer={fc.answer} show />)}
							</div>
						}
						{flashcards.length == 0 && <div className="warning"><p>Nenhum flashcard aqui</p></div>}
					</section>
				</div>
				<Footer />
			</>
		</FlashcardsContext.Provider>
	)
}

export default Flashcards