import { useContext } from "react"
import { ClockContext } from "./Clock"

const TimerState = () => {
	const { timerState } = useContext(ClockContext)

	return (
		<div className="timer_state">
			<div className="state">
				<p className={timerState === 'focus' ? 'text_activated' : ''}>Foco</p>
				<hr className={timerState === 'focus' ? 'activated' : ''} />
			</div>
			<div className="state">
				<p className={timerState === 'break' ? 'text_activated' : ''}>Pausa</p>
				<hr className={timerState === 'break' ? 'activated' : ''} />
			</div>
			<div className="state">
				<p className={timerState === 'rest' ? 'text_activated' : ''}>Descanso</p>
				<hr className={timerState === 'rest' ? 'activated' : ''} />
			</div>
		</div>
	)
}

export default TimerState