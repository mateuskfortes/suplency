import { useContext } from "react";

import { CalculatorContext } from "../pages/study/Calculator";

export default function Display() {
    const { currentExpression, previousExpression } = useContext(CalculatorContext)

    return (
        <div className="display">
            <p className="previous_operation"> {previousExpression}</p>
            <p className="current_operation">{currentExpression}</p>
        </div>
    )
}