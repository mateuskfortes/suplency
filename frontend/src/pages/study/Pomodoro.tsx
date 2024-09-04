import { createContext, useReducer } from "react"
import InputArea from "../../components/InputArea";
import Clock from "../../components/Clock";
import '../../assets/Pomodoro.scss'

export const PomodoroContext = createContext({
    times: {
        focus: 0,
        break: 0,
        rest: 0,
        breaksUntilRest: 1,
    },
    dispatchTimes: ({type, payload}: {type: string, payload: string}) => {  
        console.log(type, payload)
    }
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
    const [times, dispatchTimes] = useReducer(reducer, {
        focus: 0,
        break: 0,
        rest: 0,
        breaksUntilRest: 1,
    })

    return (
        <PomodoroContext.Provider value={{ times, dispatchTimes }}>
            <div className="pomodoro">
                <Clock />
                <InputArea />
            </div>
        </PomodoroContext.Provider>
        <PomodoroContext.Provider value={{ times, dispatchTimes }}>
            <div className="pomodoro">
                <Clock />
                <InputArea />
            </div>
        </PomodoroContext.Provider>
    )
}

export default Pomodoro