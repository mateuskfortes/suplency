import ArithmeticButton from "./ArithmeticButton";

import { CalculatorContext } from "../pages/study/Calculator";
import { useContext } from "react";
import { memo } from "react";

const ButtonsDisplay = memo(() => {
    const { backOperation, makeOperation, clearOperation } = useContext(CalculatorContext)

    return (
        <div className="buttons_display">
            <section className="left">
                <div className="gray_buttons">
                    <ArithmeticButton func={clearOperation} color="gray"children="AC" />
                    <ArithmeticButton value="7" color="gray"children="+/-" />
                    <ArithmeticButton value="7" color="gray"children="%" />
                </div>
                <div className="white_buttons">
                    <ArithmeticButton value="7" color="white"children="7" />
                    <ArithmeticButton value="8" color="white"children="8" />
                    <ArithmeticButton value="9" color="white"children="9" />
                    <ArithmeticButton value="4" color="white"children="4" />
                    <ArithmeticButton value="5" color="white"children="5" />
                    <ArithmeticButton value="6" color="white"children="6" />
                    <ArithmeticButton value="1" color="white"children="1" />
                    <ArithmeticButton value="2" color="white"children="2" />
                    <ArithmeticButton value="3" color="white"children="3" />
                    <ArithmeticButton value="." color="white"children="," />
                    <ArithmeticButton value="0" color="white"children="0" />
                    <ArithmeticButton func={backOperation} color="white" children="Back"/>
                </div>
            </section>
            <section className="right">
                <ArithmeticButton value="/" color="purple"children="/" />
                <ArithmeticButton value="*" color="purple"children="x" />
                <ArithmeticButton value="-" color="purple"children="-" />
                <ArithmeticButton value="+" color="purple"children="+" />
                <ArithmeticButton func={makeOperation} color="purple"children="=" />
            </section>
        </div>
    )
})

export default ButtonsDisplay