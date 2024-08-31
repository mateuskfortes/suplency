import CalculatorButton from "./CalculatorButton";

import { CalculatorContext } from "../pages/study/Calculator";
import { useContext, memo } from "react";

const ButtonsLayout = memo(() => {
    const { deleteLastCharacter, clearExpression, evaluateExpression } = useContext(CalculatorContext)
    
    return (
        <div className="buttons_layout">
            <section className="left">
                <div className="gray_buttons">
                    <CalculatorButton func={clearExpression} value="AC" />
                    <CalculatorButton value="none" children="+/-" />
                    <CalculatorButton value="%" />
                </div>
                <div className="white_buttons">
                    <CalculatorButton value="7" />
                    <CalculatorButton value="8" />
                    <CalculatorButton value="9" />
                    <CalculatorButton value="4" />
                    <CalculatorButton value="5" />
                    <CalculatorButton value="6" />
                    <CalculatorButton value="1" />
                    <CalculatorButton value="2" />
                    <CalculatorButton value="3" />
                    <CalculatorButton value="," />
                    <CalculatorButton value="0" />
                    <CalculatorButton func={deleteLastCharacter}  value="Back"/>
                </div>
            </section>
            <section className="right">
                <CalculatorButton value="/" />
                <CalculatorButton value="x" />
                <CalculatorButton value="-" />
                <CalculatorButton value="+" />
                <CalculatorButton func={evaluateExpression} value="=" />
            </section>
        </div>
    )
})

export default ButtonsLayout