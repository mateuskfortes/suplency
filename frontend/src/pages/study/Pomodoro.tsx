import { createContext, useReducer, useState } from "react"
import InputArea from "../../components/InputArea";
import Clock from "../../components/Clock";
import '../../assets/Pomodoro.scss'

export const PomodoroContext = createContext({
    toggleIsInputVisible: () => {},
    times: {
        focus: 0,
        break: 0,
        rest: 0,
        breaksUntilRest: 1,
    },
    dispatchTimes: ({type, payload}: {type: string, payload: string}) => {  
        console.log(type, payload)
    },
    isRunning: false,
    setIsRunning: (b: boolean) => {console.log(b)},
})

const reducer = (state: any, action: any) => {
    const time = Math.min(99, Math.max(0, Number(action.payload)));
    switch (action.type) {
        case "focus":
            return {...state, focus: time}
        case "break":
            return {...state, break: time}
        case "rest":
            return {...state, rest: time}
    }
}

const Pomodoro = () => {
    const [isRunning, setIsRunning] = useState(false)
    const [isInputVisible, setIsInputVisible] = useState(false)
    const [times, dispatchTimes] = useReducer(reducer, {
        focus: 1,
        break: 1,
        rest: 1,
        breaksUntilRest: 1,
    })

    const toggleIsInputVisible = () => {
        setIsInputVisible(!isInputVisible)
    }

    return (
        <PomodoroContext.Provider value={{ isRunning, setIsRunning, toggleIsInputVisible, times, dispatchTimes }}>
            <div className="pomodoro">
                <Clock />
                { isInputVisible && <InputArea /> }
            </div>
        </PomodoroContext.Provider>
    )
}

export default Pomodoro