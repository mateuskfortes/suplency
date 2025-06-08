import { useContext } from "react"
import { ClockContext } from "./Clock"

const TimerState = () => {
	const { timerState } = useContext(ClockContext)

	return (
		<div data-testid="timer-state" className="timer_state">
			<div className="state">
				<p data-testid="focus-state" className={timerState === 'focus' ? 'text_activated' : ''}>Foco</p>
				<hr className={timerState === 'focus' ? 'activated' : ''} />
			</div>
			<div className="state">
				<p data-testid="break-state" className={timerState === 'break' ? 'text_activated' : ''}>Pausa</p>
				<hr className={timerState === 'break' ? 'activated' : ''} />
			</div>
			<div className="state">
				<p data-testid="rest-state" className={timerState === 'rest' ? 'text_activated' : ''}>Descanso</p>
				<hr className={timerState === 'rest' ? 'activated' : ''} />
			</div>
		</div>
	)
}

export default TimerState