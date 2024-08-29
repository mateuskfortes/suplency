import { useContext } from "react"
import { ClockContext } from "./Clock"

const ClockButtons = () => {
    const { isStarted, isRunning, runTimer, pauseTimer, resetTimer } = useContext(ClockContext)

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
        </div>
    )
}

export default ClockButtons