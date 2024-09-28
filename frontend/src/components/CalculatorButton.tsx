import { useContext } from "react";

import { CalculatorContext } from "./Calculator";

interface ArithmeticButtonProps {
    children?: React.ReactNode;
    value?: string;
    func?: () => void;
}

const CalculatorButton = ({ children, value, func }: ArithmeticButtonProps) => {
    const { appendToExpression, revertExpression } = useContext(CalculatorContext)

    function handleCLick() {
        if (value === '+/-') revertExpression()
        else if(value) appendToExpression(value)
    }

    return (
        <button onClick={func ?? handleCLick} className="arithmetic_button">
            {children ?? value}
        </button>
    )
}

export default CalculatorButton