import { useContext } from "react"
import { PomodoroContext } from "./Pomodoro"

const PomodoroInput = ({ id, onChange, type = 'number', min = 0, max = 99, defaultValue = 1, ...props }: any) => {
	const { isRunning } = useContext(PomodoroContext)

	return (
		<input
			className="pomodoro_input"
			id={id}
			onChange={onChange}
			type={type}
			min={min}
			max={max}
			defaultValue={defaultValue}
			disabled={isRunning}
			{...props}
		/>
	)
}

export default PomodoroInput