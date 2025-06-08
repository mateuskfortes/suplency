import { useContext } from "react";

import { CalculatorContext } from "./Calculator";

interface ArithmeticButtonProps {
	children?: React.ReactNode;
	value?: string;
	func?: () => void;
	operator?: boolean;
}

const CalculatorButton = ({ children, value, func, operator }: ArithmeticButtonProps) => {
	const { currentExpression, appendToExpression, deleteLastCharacter, revertExpression } = useContext(CalculatorContext)

	function handleCLick() {
		if (value) {
			const lastChar = currentExpression[currentExpression.length - 1]
			const lastOperator = ['x', '-', '+', '÷'].includes(lastChar)
			if (operator && lastOperator) deleteLastCharacter()
			switch (value) {
				case '+/-':
					revertExpression()
					break
				case 'x':
				case '-':
				case '+':
				case '÷':
					appendToExpression(value)
					break
				case '%':
					if (lastChar != '%') appendToExpression(value)
					break
				default:
					appendToExpression(value)
			}
		}
	}

	return (
		<button onClick={func ?? handleCLick} className="arithmetic_button">
			{children ?? value}
		</button>
	)
}

export default CalculatorButton