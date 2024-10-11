import { IoBackspaceOutline } from "react-icons/io5";
import { FaDivide } from "react-icons/fa6";
import CalculatorButton from "./CalculatorButton";
import { CalculatorContext } from "./Calculator";
import { useContext, memo } from "react";

const ButtonsLayout = memo(() => {
    const { deleteLastCharacter, clearExpression, evaluateExpression } = useContext(CalculatorContext)
    
    return (
        <div className="buttons_layout">
            <section className="left">
                <div className="gray_buttons">
                    <CalculatorButton func={clearExpression} value="AC" />
                    <CalculatorButton value="+/-" children="+/-" operator/>
                    <CalculatorButton value="%" operator/>
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
                    <CalculatorButton func={deleteLastCharacter}  children={<IoBackspaceOutline />}/>
                </div>
            </section>
            <section className="right">
                <CalculatorButton value="&divide;" children={<FaDivide />} operator />
                <CalculatorButton value="x" operator />
                <CalculatorButton value="-" operator />
                <CalculatorButton value="+" operator />
                <CalculatorButton func={evaluateExpression} value="=" />
            </section>
        </div>
    )
})

export default ButtonsLayout