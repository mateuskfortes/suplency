import { useContext } from "react";

import { CalculatorContext } from "../pages/study/Calculator";

interface ArithmeticButtonProps {
    value?: any;
    color: string;
    children: React.ReactNode;
    func?: any;
}

export default function ArithmeticButton({ value, color, children, func }: ArithmeticButtonProps) {
    const { addOperation } = useContext(CalculatorContext)

    function operationFunction() {
        addOperation(value)
    }

    return (
        <button onClick={func ? func : operationFunction} className={"arithmetic_button " + color}>
            {children}
        </button>
    )
}
