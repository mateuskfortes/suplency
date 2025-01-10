import { createContext, useEffect, useState } from "react"
import Flashcard from "../components/Flashcards/Flashcard"
import Header from "../components/Header"
import Footer from "../components/Footer"
import '../assets/Flashcards.scss'
import NewFlashcard from "../components/Flashcards/NewFlashcard"
import fetchHandler from "../assets/fetchHandler"

export const FlashcardsContext = createContext({
	flashcards: [{id: '', question: '', answer: ''}],
	addFlashcard: (question: string, answer: string) => {[question, answer]},
	toggleIsNewFlashcardVisible: () => {},
	deleteFlashcard: (id: string) => {id},
})

const Flashcards = () => {
	const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(NaN)
	const [flashcards, setFlashcards] = useState<any>([])
	const [isRunning, setIsRunning] = useState(false)
	const [isNewFlashcardVisible, setIsNewFlashcardVisible] = useState(false)

	useEffect(() => {
		fetchHandler(`flashcard`, 'GET', ({data}) => setFlashcards(data.flashcards))
	}, [])

	useEffect(() => {
		if (isRunning) setCurrentFlashcardIndex(0); 
	}, [isRunning]);

	const addFlashcard = async (question: string, answer: string) => {
		fetchHandler(`flashcard`, 
					 'POST', 
					 ({data}) => {
						setFlashcards([
							...flashcards,
							{
								id: data.id,
								question: question,
								answer: answer,
							}
						])
					}, 
					() => {},
					JSON.stringify({
						'question': question,
						'answer': answer,
					}),)
		setIsRunning(false)
	}

	const toggleIsNewFlashcardVisible = () => setIsNewFlashcardVisible(!isNewFlashcardVisible)

	const  toggleIsRunning = () => setIsRunning(!isRunning)

	function nextFlashcard() {
		setCurrentFlashcardIndex(prevIndex => {
			const nextIndex = prevIndex + 1;
			return nextIndex < flashcards.length ? nextIndex : 0; 
		  });
	}

	const deleteFlashcard = (id: string) => {
		if(window.confirm('Tem certeza que deseja excluir esse flashcard?')) {
			fetchHandler('flashcard', 
						'DELETE', 
						({}) => setFlashcards(flashcards.filter((fc: any) => fc.id != id)),
						({}) => alert('Erro ao deletar flashcard'),
						JSON.stringify({'id': id}))
		}
	}

	const deleteAll = () => {
		if(window.confirm('Tem certeza que deseja excluir todos os flashcards?')) {
			fetchHandler('flashcard', 
						'DELETE', 
						({}) => setFlashcards([]),
						({}) => alert('Erro ao deletar flashcards'),
						JSON.stringify({'id': 'all'}))
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
								{flashcards.map((fc: any, index: number) => <Flashcard key={index} id={fc.id} question={fc.question} answer={fc.answer} show />)}
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