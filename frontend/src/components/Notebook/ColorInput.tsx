import { useContext, useEffect, useRef, useState } from "react";
import CustomSlate, { colors } from "../../assets/CustomSlate";
import { NotebookContext } from "./Notebook";

function ColorInput({ children }: any) {
    const [isPaletteVisible, setIsPaletteVisible] = useState(false)
    const { editor, editable } = useContext(NotebookContext)
    const paletteRef = useRef<HTMLButtonElement>(null)

    const handlerColor = (color: any) => {
        CustomSlate.setColor(editor, color)
        if (editable.current) editable.current.focus()
    }
    const showPalette = () => {
        setIsPaletteVisible(true)
    }

    useEffect (() => {
        if (isPaletteVisible) paletteRef.current?.focus()
    }, [isPaletteVisible])

    return (
        <button className="conteiner_color format_input">
            <div className="color_icon" onClick={showPalette}>
                {children}
            </div>
            { isPaletteVisible && (
                <button className="color_palette" ref={paletteRef} onBlur={() => setIsPaletteVisible(false)}>
                    <table>
                        <tbody>
                            <tr>
                                {colors.grayScale.map((color, index) => (
                                    <td key={index} >
                                        <div
                                            className="color_input"
                                            style={{backgroundColor: color }}
                                            onClick={() => handlerColor(color)}>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                {colors.default.map((color, index) => (
                                    <td key={index}>
                                        <div  
                                            className="color_input"
                                            style={{ backgroundColor: color }}
                                            onClick={() => handlerColor(color)}>
                                        </div> 
                                    </td>
                                ))}
                            </tr> 
                        </tbody>
                    </table>
                </button>
            )}
        </button>
    );
}

export default ColorInput;
