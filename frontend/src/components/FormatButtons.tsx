import { useContext } from "react"
import CustomSlate from "../assets/CustomSlate"
import { NotebookContext } from "../pages/study/Notebook"

const FormatButtons = () => {
    const { editor, editable } = useContext(NotebookContext)

    const toggleBold = () => {
        
    }

    return (
        <div className="conteiner_format_buttons">
            <input 
                type="button" 
                onClick={() => {
                    CustomSlate.toggleBold(editor)
                    if (editable.current) editable.current.focus()
                }} 
                value="negro"
            />
            <input 
                type="button" 
                value="Lista" 
                onClick={() => {
                    CustomSlate.toggleList(editor, 'bulleted-list')
                    if (editable.current) editable.current.focus()
                }} 
            />
        </div>
    )
}

export default FormatButtons