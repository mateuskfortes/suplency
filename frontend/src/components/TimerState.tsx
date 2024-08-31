import { useContext } from "react"
import { ClockContext } from "./Clock"

const TimerState = () =>{
    const { timerState } = useContext(ClockContext)

    return (
        <div className="timer_state">
            <div className="state">
                <p>Foco</p>
                <hr className={timerState === 'focus' ? 'activated' : ''}/>
            </div>
            <div className="state">
                <p>Pausa</p>
                <hr className={timerState === 'break' ? 'activated' : ''}/>
            </div>
            <div className="state">
                <p>Descanso</p>
                <hr className={timerState === 'rest' ? 'activated' : ''}/>
            </div>
        </div>
    )
}

export default TimerState