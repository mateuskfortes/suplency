import { useContext } from "react"
import { PomodoroContext } from "../pages/study/Pomodoro"

const InputArea = () => {
    const { dispatchTimes } = useContext(PomodoroContext)

    return (
        <div className="input_area">
            <label htmlFor="focus_time">
                    Digite o tempo de foco:
                </label>
                <input
                    onChange={(e) => dispatchTimes({type: 'focus', payload: e.target.value})}
                    name="focus_time"
                    type="number"
                    min="0"
                    max="99"
                />
                <label htmlFor="break_time">
                    Digite o tempo de pausa:
                </label>
                <input
                    onChange={(e) => dispatchTimes({type: 'break', payload: e.target.value})}
                    name="break_time"
                    type="number"
                    min="0"
                    max="99"
                />
                <label htmlFor="rest_time">
                    Digite o tempo da pausa longa
                </label>
                <input
                    onChange={(e) => dispatchTimes({type: 'rest', payload: e.target.value})}
                    name="rest_time"
                    type="number"
                    min="0"
                    max="99"
                />
        </div>
    )
}

export default InputArea