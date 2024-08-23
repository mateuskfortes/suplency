import { useState, useEffect } from "react";
import './css/Pomodoro.scss'

class Time {
    minutes: number;
    seconds: number;

    constructor(init_minutes: number) {
        this.minutes = Math.floor(init_minutes);
        this.seconds = Math.floor((init_minutes - this.minutes) * 60);
    }

    formatTime(): [string, string] {
        const format_minutes = this.minutes.toString().padStart(2, "0");
        const format_seconds = this.seconds.toString().padStart(2, "0");
        return [format_minutes, format_seconds];
    }

    subtractSecond(): boolean {
        if (this.seconds > 0) this.seconds--;
        else {
            if (this.minutes > 0) {
                this.minutes--;
                this.seconds = 59;
            } else return false;
        }
        return true;
    }
}

class PomodoroObj {
    sequence: [Time, string][] = []
    focus_time: number
    break_time: number
    rest_time: number
    breakUntiRest: number
    setTimeFunction: any;
    setStateFunction: any
    setIsRunningFunction: any
    setAlreadyStartedFunction: any
    intervalId: any;
    currentStepIndex: number;
    started: boolean;

    constructor(setTimeFunction: any, 
        setStateFunction: any, 
        setIsRunningFunction: any, 
        setAlreadyStartedFunction: any,
        focus_time: number, 
        break_time: number, 
        rest_time: number, 
        break_until_rest: number
        ) {
            this.focus_time = focus_time
            this.breakUntiRest = break_until_rest
            this.break_time = break_time
            this.rest_time = rest_time
            this.setTimeFunction = setTimeFunction
            this.setStateFunction = setStateFunction
            this.setIsRunningFunction = setIsRunningFunction
            this.setAlreadyStartedFunction = setAlreadyStartedFunction
            this.intervalId = null;
            this.currentStepIndex = 0;
            this.started = false

            this.fillSequence()
    }

    fillSequence() {
        this.sequence = []
        for (let i = 0; i < this.breakUntiRest; i++) {
            this.sequence.push([new Time(this.focus_time), "focus"]);
            this.sequence.push([new Time(this.break_time), "break"]);
        }
        this.sequence.push([new Time(this.focus_time), "focus"]);
        this.sequence.push([new Time(this.rest_time), "rest"]);
    }

    restore() {
        this.currentStepIndex = 0
        this.started = false
        this.setAlreadyStartedFunction(false)
        this.fillSequence()
    }

    run() {
        this.started = true;
        this.setAlreadyStartedFunction(true)
        this.setIsRunningFunction(true)
        this.runCurrentStep();
    }

    pause() {
        this.setIsRunningFunction(false)
        clearInterval(this.intervalId);
    }
    
    private runCurrentStep() {

        function passTime(obj: any) {
            if (current_timer.subtractSecond()) {
                obj.setTimeFunction(current_timer.formatTime());
                obj.setStateFunction(current_state);
            } else {
                clearInterval(obj.intervalId);
                obj.currentStepIndex++;
                obj.setIsRunningFunction(false)
                obj.setTimeFunction(current_timer.formatTime());
                obj.setStateFunction('');
                if (obj.currentStepIndex >= obj.sequence.length) obj.restore()
            }
        }

        if (this.currentStepIndex >= this.sequence.length) this.restore()

        const [current_timer, current_state] = this.sequence[this.currentStepIndex];
        passTime(this)
        this.intervalId = setInterval(() => passTime(this), 1000);
    }

}

function Pomodoro() {
    const [focus_time, setFocusTime] = useState(0);
    const [break_time, setBreakTime] = useState(0);
    const [rest_time, setRestTime] = useState(0);
    const [break_until_rest, setBUR] = useState(1);
    const [is_running, setIsRunning] = useState(false)
    const [already_started, setAlreadyStarted] = useState(false)
    const [timer_state, setTimerState] = useState("");
    const [[formatted_minutes, formatted_seconds], setFormattedTime] = useState(["00", "00"]);
    const [timer, setTimer] = useState(new PomodoroObj(setFormattedTime, 
                                                       setTimerState, 
                                                       setIsRunning,
                                                       setAlreadyStarted, 
                                                       focus_time, 
                                                       break_time, 
                                                       rest_time,
                                                       break_until_rest
                                                      ));
    
    function defineTimer() {
        setTimer(new PomodoroObj(setFormattedTime, 
                                 setTimerState, 
                                 setIsRunning,
                                 setAlreadyStarted,
                                 focus_time, 
                                 break_time, 
                                 rest_time, 
                                 break_until_rest
                                ));
    }

    
    function runTimer() {
        timer.run()
    }

    function restoreTimer() {
        setFormattedTime(new Time(focus_time).formatTime())
        setTimerState('')
        defineTimer()
        timer.restore()
    }

    function pauseTimer() {
        timer.pause()
    }

    function defineBUR(e: any) {
        let count = e.target.value;
        if (count < 0) {
            e.target.value = 0;
            count = 0;
        }
        setBUR(count);
    }

    function defineTimes(event: any, type: string) {
        let time = Number(event.target.value);
        if (time > 99) {
            event.target.value = 99;
            time = 99;
        } else if (time < 0) {
            event.target.value = 0;
            time = 0;
        }
        switch (type) {
            case "focus":
                setFocusTime(time);
                break;
            case "break":
                setBreakTime(time);
                break;
            case "rest":
                setRestTime(time);
                break;
        }
    }

    useEffect(() => {
        defineTimer()
        setFormattedTime(new Time(focus_time).formatTime());
    }, [focus_time, break_time, rest_time, break_until_rest]);

    return (
        <div className="pomodoro">
            <div className="conteiner_watch">
                <div className="conteiner_timer_state">
                    <div className="timer_state">
                        <p>Foco</p>
                        <hr className={timer_state === 'focus' ? 'activated' : ''}/>
                    </div>
                    <div className="timer_state">
                        <p>Pausa</p>
                        <hr className={timer_state === 'break' ? 'activated' : ''}/>
                    </div>
                    <div className="timer_state">
                        <p>Descanso</p>
                        <hr className={timer_state === 'rest' ? 'activated' : ''}/>
                    </div>
                </div>
                <div className="clock">
                    <div>
                        <span id="minutes">{formatted_minutes}</span>
                    </div>
                    <div>
                        <span id="seconds">{formatted_seconds}</span>
                    </div>
                </div>
                <div className="buttons">
                    {!already_started ? (
                        <button className="button black_button" onClick={runTimer}>
                            iniciar
                        </button>
                    ) : is_running ? (
                        <button className="button black_button" onClick={pauseTimer}>
                            Pausar
                        </button>
                    ) : (
                        <>
                            <button className="button black_button" onClick={runTimer}>
                                Continuar
                            </button>
                            <button className="button black_button" onClick={restoreTimer}>
                                Recomeçar
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="pomodoro_config">
                <label htmlFor="tp_foco" className="config_input">
                    Digite o tempo de foco:
                </label>
                <input
                    onChange={(e) => defineTimes(e, "focus")}
                    name="tp_foco"
                    id="tp_foco"
                    type="number"
                    min="0"
                />
                <label htmlFor="tp_pausa" className="config_input">
                    Digite o tempo de pausa:
                </label>
                <input
                    onChange={(e) => defineTimes(e, "break")}
                    name="tp_pausa"
                    id="tp_pausa"
                    type="number"
                    min="0"
                />
                <label htmlFor="tp_pausa_longa" className="config_input">
                    Digite o tempo da pausa longa
                </label>
                <input
                    onChange={(e) => defineTimes(e, "rest")}
                    name="tp_pausa_longa"
                    id="tp_pausa_longa"
                    type="number"
                    min="0"
                />
                {/*
                <label htmlFor="focos_ate_pausa_longa">
                    <p>Digite o numero de focos até a pausa longa</p>
                    <input
                        onChange={defineBUR}
                        name="focos_ate_pausa_longa"
                        id="focos_ate_pausa_longa"
                        type="number"
                        min="1"
                    />
                </label>
                */}
            </div>
        </div>
    );
}

export default Pomodoro;
