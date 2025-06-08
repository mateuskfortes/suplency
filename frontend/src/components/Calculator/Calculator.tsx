import { createContext, useState } from "react";
import { evaluate } from "mathjs";

import ButtonsLayout from "./ButtonsLayout";
import Display from "./Display";

export const CalculatorContext = createContext({
	currentExpression: '',
	previousExpression: '',
	appendToExpression: (input: string) => { console.log(input) },
	revertExpression: () => { },
	deleteLastCharacter: () => { },
	clearExpression: () => { },
	evaluateExpression: () => { },
});

function Calculator() {
	const [currentExpression, setCurrentExpression] = useState('');
	const [previousExpression, setPreviousExpression] = useState('');

	function formatExpression(expression: string, toMathFormat: boolean = true): string {
		const replacements: Record<string, string> = toMathFormat ? {
			',': '.',
			'x': '*',
			'%': '/100',
			'÷': '/',
			'revert': '-',
		} : {
			'.': ',',
		};

		return Object.entries(replacements).reduce((formattedExpression, [original, replacement]) => {
			const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = new RegExp(escapedOriginal, 'g');
			return formattedExpression.replace(regex, replacement);
		}, expression);
	}

	function appendToExpression(input: string) {
		setCurrentExpression(prev => prev + input);
	}

	function revertExpression() {
		setCurrentExpression(prev => 'revert(' + prev + ')')
	}

	function deleteLastCharacter() {
		setCurrentExpression(prev => prev.slice(0, -1));
	}

	function clearExpression() {
		setPreviousExpression('')
		setCurrentExpression('');
	}

	function evaluateExpression() {
		setCurrentExpression(prev => {
			try {
				setPreviousExpression(prev)
				const mathFormat = formatExpression(prev)
				const result = evaluate(mathFormat).toString();
				const viewFormat = formatExpression(result, false);
				return viewFormat
			} catch {
				setPreviousExpression('Error');
				return '';
			}
		});
	}

	return (
		<CalculatorContext.Provider value={{
			currentExpression,
			previousExpression,
			appendToExpression,
			revertExpression,
			deleteLastCharacter,
			clearExpression,
			evaluateExpression
		}}>
			<div className="calculator">
				<Display />
				<ButtonsLayout />
			</div>
		</CalculatorContext.Provider>
	);
}

export default Calculator;
