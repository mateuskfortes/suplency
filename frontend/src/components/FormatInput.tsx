import { useContext } from "react"
import { NotebookContext } from "../pages/study/Notebook"

const FormatInput = ({ onClick, children }: any) => {
    const { editable } = useContext(NotebookContext)

    const execFunc = () => {
        onClick()
        editable.current?.focus()
    }

    return (
        <button 
            className="format_input"
            onClick={execFunc} >{children}</button>
    )
}

export default FormatInput