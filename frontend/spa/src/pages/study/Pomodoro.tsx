import { useState, useEffect, useRef } from "react";

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
    sequence: [Time, string][] = [];
    current_time: [string, string];
    iterator: any;

    constructor(focus_time: number, break_time: number, rest_time: number, break_until_rest: number) {
        for (let i = 0; i < break_until_rest; i++) {
            this.sequence.push([new Time(focus_time), "focus"]);
            this.sequence.push([new Time(break_time), "break"]);
        }
        this.sequence.push([new Time(focus_time), "focus"]);
        this.sequence.push([new Time(rest_time), "rest"]);

        this.current_time = this.sequence[0][0].formatTime();
        this.iterator = this.start();
    }

    async *start() {
        for (const [current_timer, current_state] of this.sequence) {
            while (current_timer.subtractSecond()) {
                this.current_time = current_timer.formatTime();
                yield [this.current_time, current_state];
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }
}

function Pomodoro() {
    const [timer, setTimer] = useState(new PomodoroObj(0, 0, 0, 0));
    const [focus_time, setFocusTime] = useState(0);
    const [break_time, setBreakTime] = useState(0);
    const [rest_time, setRestTime] = useState(0);
    const [break_until_rest, setBUR] = useState(0);
    const [[formatted_minutes, formatted_seconds], setFormattedTime] = useState(["00", "00"]);
    const [timer_state, setTimerState] = useState("");
    const [is_running, setIsRunning] = useState(false);
    const runningRef = useRef(is_running);

    useEffect(() => {
        let new_timer = new PomodoroObj(focus_time, break_time, rest_time, break_until_rest);
        setTimer(new_timer);
        setFormattedTime(new_timer.current_time);
    }, [focus_time, break_time, rest_time, break_until_rest]);

    useEffect(() => {
        runningRef.current = is_running;

        const run = async () => {
            while (runningRef.current) {
                const { value, done } = await timer.iterator.next();
                if (done || !runningRef.current) break;
                setFormattedTime(value[0]);
                setTimerState(value[1]);
            }
            setIsRunning(false);
            setTimerState("");
        };

        if (is_running) {
            run();
        }
    }, [is_running, timer]);

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

    function start_stop() {
        setIsRunning(!is_running);
    }

    return (
        <div className="pomodoro">
            {timer_state}
            <div className="conteiner_watch">
                <div>
                    <span id="estado_timer"></span>
                    <span id="estado_foco" className="estado"></span>
                    <span id="estado_pausa" className="estado"></span>
                    <span id="estado_descanso" className="estado"></span>
                </div>
                <div className="watch">
                    <div>
                        <span id="minutes">{formatted_minutes}</span>
                    </div>
                    <div>
                        <span id="seconds">{formatted_seconds}</span>
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={start_stop} id="start/stop">
                        {!is_running ? "Iniciar" : "Parar"}
                    </button>
                </div>
            </div>

            <label htmlFor="tp_foco">
                <p>Digite o tempo de foco:</p>
                <input
                    onChange={(e) => defineTimes(e, "focus")}
                    name="tp_foco"
                    id="tp_foco"
                    type="number"
                    min="0"
                />
            </label>
            <label htmlFor="tp_pausa">
                <p>Digite o tempo de pausa:</p>
                <input
                    onChange={(e) => defineTimes(e, "break")}
                    name="tp_pausa"
                    id="tp_pausa"
                    type="number"
                    min="0"
                />
            </label>
            <label htmlFor="tp_pausa_longa">
                <p>Digite o tempo da pausa longa</p>
                <input
                    onChange={(e) => defineTimes(e, "rest")}
                    name="tp_pausa_longa"
                    id="tp_pausa_longa"
                    type="number"
                    min="0"
                />
            </label>
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
        </div>
    );
}

export default Pomodoro;
