import { useContext } from "react"
import { NotebookContext } from "../pages/study/Notebook"

const SelectInput = ({ options, onChange, ...props }: any) => {
    const { editable } = useContext(NotebookContext)

    const handlerOnChange = (e: any) => {
        onChange(e.target.value)
        editable.current?.focus()
    }

    return (
        <select {...props} onChange={handlerOnChange}>
            {options.map((op: string, index: any) => {
                return <option key={index} value={op}>{op}</option>
            })}
        </select>
    )
}

export default SelectInput