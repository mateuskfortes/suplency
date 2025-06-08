import { useContext } from "react"
import { PomodoroContext } from "./Pomodoro"
import PomodoroInput from "./PomodoroInput"

const InputArea = () => {
	const { dispatchTimes } = useContext(PomodoroContext)

	const setFocusTime = (e: any) => {
		dispatchTimes({
			type: 'focus',
			payload: e.target.value
		})
	}
	const setBreakTime = (e: any) => {
		dispatchTimes({
			type: 'break',
			payload: e.target.value
		})
	}
	const setRestTime = (e: any) => {
		dispatchTimes({
			type: 'rest',
			payload: e.target.value
		})
	}

	return (
		<div data-testid="clock-config" className="input_area">
			<label htmlFor="focus_time">
				Digite o tempo de foco:
			</label>
			<PomodoroInput
				onChange={setFocusTime}
				id="focus_time"
			/>
			<label htmlFor="break_time">
				Digite o tempo de pausa:
			</label>
			<PomodoroInput
				onChange={setBreakTime}
				id="break_time"
			/>
			<label htmlFor="rest_time">
				Digite o tempo de descanso:
			</label>
			<PomodoroInput
				onChange={setRestTime}
				id="rest_time"
			/>
		</div>
	)
}

export default InputArea