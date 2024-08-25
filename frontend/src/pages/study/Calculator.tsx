import { createContext, useRef, useState } from "react"

import { evaluate } from "mathjs"

import ButtonsDisplay from "../../components/ButtonsDisplay"
import NumbersDisplay from "../../components/OperationDisplay"
import './css/calculator.scss'

export const CalculatorContext = createContext({
    operation: '',
    prev_operation: '',
    addOperation: (opr: string) => {},
    backOperation: () => {},
    clearOperation: () => {},
    makeOperation: () => {},
})

function Calculator() {
    const [operation, setOperation] = useState('')
    const prev_operation_ref = useRef('')

    function addOperation(opr: string) {
        setOperation(prev => prev + opr)
    }

    function backOperation() {
        setOperation(prev => prev.slice(0, -1))
    }
    
    function clearOperation() {
        prev_operation_ref.current = ''
        setOperation('')
    }
    
    function makeOperation() {
        setOperation(prev => {
            try {
                prev_operation_ref.current = prev 
                return evaluate(prev).toString()
            } catch {
                prev_operation_ref.current = 'error'
                return ''
            }
        })
    }

    const prev_operation = prev_operation_ref.current
    
    return (
        <CalculatorContext.Provider value={{operation, prev_operation, addOperation, backOperation, clearOperation, makeOperation}}>
            <div className="calculator">
                <NumbersDisplay />
                <ButtonsDisplay />
            </div>
        </CalculatorContext.Provider>
    )
}

export default Calculator