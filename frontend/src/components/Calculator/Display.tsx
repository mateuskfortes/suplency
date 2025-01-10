import { useContext, useEffect, useRef } from "react";
import { CalculatorContext } from "./Calculator";

const INITIAL_FONT_SIZE = 50;

export default function Display() {
    const { currentExpression, previousExpression } = useContext(CalculatorContext);
    const display = useRef<HTMLDivElement | null>(null);
    const displayCalc = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        if (currentExpression === '' && displayCalc.current) {
            displayCalc.current.style.fontSize = `${getInitialFontSize()}px`;
        } else {
            adjustFontSize();
        }
    }, [currentExpression]);

    const getInitialFontSize = () => {
        if (displayCalc.current) {
            return parseFloat(window.getComputedStyle(displayCalc.current).fontSize);
        }
        return 50; 
    };

    const CalcBiggerDisplay = () => {
        if (display.current && displayCalc.current) {
            const parentWidth = display.current.offsetWidth;
            const contentWidth = displayCalc.current.offsetWidth
            return contentWidth > parentWidth
        }
    }

    const adjustFontSize = () => {
        if (display.current && displayCalc.current) {
            while (true) {
                let newFontSize = parseInt(displayCalc.current.style.fontSize.replace('px', ''))
                if (CalcBiggerDisplay()) {
                    displayCalc.current.style.fontSize = `${newFontSize-1}px`;
                } else if (newFontSize < INITIAL_FONT_SIZE) {
                    displayCalc.current.style.fontSize = `${newFontSize+1}px`;
                    if (CalcBiggerDisplay()) {
                        displayCalc.current.style.fontSize = `${newFontSize-1}px`;
                        return
                    }
                } else {
                    return;
                }
            }
        }
    };

    return (
        <div className="display" ref={display}>
            <p className="previous_operation"> {previousExpression}</p>
            <p className="current_operation" ref={displayCalc} >
                {currentExpression}
            </p>
        </div>
    );
}
