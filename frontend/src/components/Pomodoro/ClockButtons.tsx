import { useContext } from "react"
import { ClockContext } from "./Clock"
import { PomodoroContext } from "./Pomodoro"
import { GoGear } from "react-icons/go";

const ClockButtons = () => {
	const { isStarted, isRunning, runTimer, pauseTimer, resetTimer } = useContext(ClockContext)
	const { toggleIsInputVisible } = useContext(PomodoroContext)

	return (
		<div data-testid="clock-buttons" className="buttons">
			{!isStarted ? (
				<button data-testid="start-clock-button" className="button black_button" onClick={runTimer}>
					Iniciar
				</button>
			) : isRunning ? (
				<button data-testid="stop-clock-button" className="button black_button" onClick={pauseTimer}>
					Pausar
				</button>
			) : (
				<>
					<button data-testid="continue-clock-button" className="button black_button" onClick={runTimer}>
						Continuar
					</button>
					<button data-testid="reset-clock-button" className="button black_button" onClick={resetTimer}>
						Recomeçar
					</button>
				</>
			)}
			<button data-testid="show-clock-config" className="show_config" onClick={toggleIsInputVisible}>
				<GoGear />
			</button>
		</div>
	)
}

export default ClockButtons