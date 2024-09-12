import { useContext, useState } from "react";
import CustomSlate, { grayScale, colors } from "../assets/CustomSlate";
import { NotebookContext } from "../pages/study/Notebook";

function ColorInput({ children }: any) {
    const [isPaletteVisible, setIsPaletteVisible] = useState(false)
    const { editor, editable } = useContext(NotebookContext)

    const handlerColor = (color: any) => {
        CustomSlate.setColor(editor, color)
        if (editable.current) editable.current.focus()
    }
    const toggleIsPaletteVisible = () => {
        setIsPaletteVisible(!isPaletteVisible)
    }

    return (
        <div className="conteiner_color format_input">
            <div className="color_icon" onClick={toggleIsPaletteVisible}>
                {children}
            </div>
            { isPaletteVisible && (
                <table className="color_palette">
                    <tbody>
                        <tr>
                            {grayScale.map((color, index) => (
                                <td>
                                    <div
                                        className="color_input"
                                        key={index} 
                                        style={{backgroundColor: color }}
                                        onClick={() => handlerColor(color)}>
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            {colors.map((color, index) => (
                                <td>
                                    <div  
                                        className="color_input"
                                        key={index} 
                                        style={{ backgroundColor: color }}
                                        onClick={() => handlerColor(color)}>
                                    </div> 
                                </td>
                            ))}
                        </tr> 
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ColorInput;
