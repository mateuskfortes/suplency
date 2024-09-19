import { useContext, useEffect, useRef, useState } from "react"
import { NotebookContext } from "../pages/study/Notebook"

const Subject = ({ id, subjectName, start=false }: any) => {
    const { notebookObj } = useContext(NotebookContext)
    const [ isEditable, setIsEditable ] = useState(!start)
    const subjectContainer = useRef<HTMLSpanElement | null>(null)

    const setEditable = () => setIsEditable(true)
    const setNotEditable = () =>{
        setIsEditable(false)
        if (subjectContainer.current) notebookObj.setSubjectName(id, subjectContainer.current.textContent)
    }

    useEffect(() => { if (subjectContainer.current) subjectContainer.current.focus() } , [])

    return (
        <div 
        className="subject" 
        onKeyDown={e => e.key == 'Enter' ? setNotEditable() : null}
        onBlur={setNotEditable}
        onDoubleClick={setEditable}
        onClick={() => notebookObj.setCurrentSubject(id)}>
            <span
            id={id}
            contentEditable={isEditable}
            ref={subjectContainer}
            suppressContentEditableWarning={true}>
                {subjectName}
            </span>
        </div>
    )
}

export default Subject