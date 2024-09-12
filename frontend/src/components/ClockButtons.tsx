import { useContext } from "react"
import { ClockContext } from "./Clock"
import { PomodoroContext } from "../pages/study/Pomodoro"
import { GoGear } from "react-icons/go";

const ClockButtons = () => {
    const { isStarted, isRunning, runTimer, pauseTimer, resetTimer } = useContext(ClockContext)
    const { toggleIsInputVisible } = useContext(PomodoroContext)

    return(
        <div className="buttons">
            {!isStarted ? (
                <button className="button black_button" onClick={runTimer}>
                    iniciar
                </button>
            ) : isRunning ? (
                <button className="button black_button" onClick={pauseTimer}>
                    Pausar
                </button>
            ) : (
                <>
                    <button className="button black_button" onClick={runTimer}>
                        Continuar
                    </button>
                    <button className="button black_button" onClick={resetTimer}>
                        Recomeçar
                    </button>
                </>
            )}
            <button className="show_config" onClick={toggleIsInputVisible}>
                <GoGear />
            </button>
        </div>
    )
}

export default ClockButtons