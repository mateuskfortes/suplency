import { createContext, useContext, useEffect, useRef, useState } from "react";
import { PomodoroContext } from "./Pomodoro";
import TimerState from "./TimerState";
import ClockButtons from "./ClockButtons";

export const ClockContext = createContext({
	timerState: '',
	isStarted: false,
	isRunning: false,
	runTimer: () => { },
	pauseTimer: () => { },
	resetTimer: () => { },
})

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

const Clock = () => {
	const { times, isRunning, setIsRunning } = useContext(PomodoroContext)
	const [isStarted, setIsStarted] = useState(false)
	const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0)
	const [sequence, setSequence]: [any, any] = useState()
	const [[formattedMinutes, formattedSeconds], setFormattedTime] = useState(['', ''])
	const [timerState, setTimerState] = useState('')
	const intervalId = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		fillSequence()
		setFormattedTime(new Time(times.focus).formatTime())
	}, [times])

	function fillSequence() {
		let newSequence = []
		for (let i = 0; i < times.breaksUntilRest; i++) {
			newSequence.push([new Time(times.focus), "focus"]);
			newSequence.push([new Time(times.break), "break"]);
		}
		newSequence.push([new Time(times.focus), "focus"]);
		newSequence.push([new Time(times.rest), "rest"]);
		setSequence(newSequence)
	}

	function resetTimer() {
		setCurrentSequenceIndex(0)
		setIsStarted(false)
		setTimerState('')
		fillSequence()
		setFormattedTime(new Time(times.focus).formatTime())
	}

	function runTimer() {
		function passTime() {
			if (!intervalId.current) return;
			if (current_timer.subtractSecond()) {
				setFormattedTime(current_timer.formatTime());
				setTimerState(current_state);
			} else {
				clearInterval(intervalId.current);
				setCurrentSequenceIndex(prev => prev + 1)
				setIsRunning(false)
				setTimerState('');
				if (currentSequenceIndex == sequence.length - 1) resetTimer()
			}
		}

		if (currentSequenceIndex >= sequence.length) resetTimer()
		setIsStarted(true)
		setIsRunning(true)
		const [current_timer, current_state] = sequence[currentSequenceIndex];
		passTime()
		intervalId.current = setInterval(() => passTime(), 1000);
	}

	function pauseTimer() {
		if (!intervalId.current) return;
		setIsRunning(false)
		clearInterval(intervalId.current);
	}

	return (
		<ClockContext.Provider value={{
			timerState,
			isStarted,
			isRunning,
			runTimer,
			pauseTimer,
			resetTimer,
		}}>
			<div data-testid="clock" className="container_watch">
				<TimerState />
				<div className="clock">
					<div>
						<span data-testid="clock-minutes" id="minutes">{formattedMinutes}</span>
					</div>
					<div>
						<span data-testid="clock-seconds" id="seconds">{formattedSeconds}</span>
					</div>
				</div>
				<ClockButtons />
			</div>
		</ClockContext.Provider>
	)
}

export default Clock