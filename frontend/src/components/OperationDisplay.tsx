import { useContext } from "react";

import { CalculatorContext } from "../pages/study/Calculator";

export default function OperationDisplay() {
    function formatOperation(str: string, replacements: Record<string, string>): string {
        let result = str;
        
        for (const [original, replacement] of Object.entries(replacements)) {
            const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedOriginal, 'g');
            result = result.replace(regex, replacement);
        }
        
        return result;
    }

    const { operation, prev_operation } = useContext(CalculatorContext)

    const replacements = {
        '.': ',',
        '*': 'x',
    }

    const formatted_operation = formatOperation(operation, replacements)
    const formatted_prev_operation = formatOperation(prev_operation, replacements)

    return (
        <div className="operation_display">
            <p className="previous_operation"> {formatted_prev_operation}</p>
            <p className="current_operation">{formatted_operation}</p>
        </div>
    )
}