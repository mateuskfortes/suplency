import { useContext, useEffect, useRef, useState } from "react"
import { NotebookContext } from "./Notebook"
import { TbX } from "react-icons/tb";

const Subject = ({ id, subjectName, start=false }: any) => {
    const { setSubjectName, changeSubject, deleteSubject } = useContext(NotebookContext)

    const [ isEditable, setIsEditable ] = useState(!start)
    const subjectContainer = useRef<HTMLSpanElement | null>(null)
    
    const [ nameBackup, setNameBackup ] = useState('')
    useEffect(() => {
        if (isEditable && subjectContainer.current) setNameBackup(subjectContainer.current.innerText) 
    }, [isEditable])

    // Set the subject name to be editable
    const setEditable = () => setIsEditable(true)
    const setNotEditable = async () =>{
        setIsEditable(false)
        if (subjectContainer.current) if (! await setSubjectName(subjectContainer.current.innerText)) {
            subjectContainer.current.innerText = nameBackup
        }
    }

    useEffect(() => { if (subjectContainer.current) subjectContainer.current.focus() } , [])

    return (
        <div 
        className="subject" 
        onKeyDown={e => e.key == 'Enter' ? setNotEditable() : null}
        onBlur={setNotEditable}
        onDoubleClick={setEditable}
        onClick={() => changeSubject(id)}>
            <span
            id={id}
            contentEditable={isEditable}
            ref={subjectContainer}
            suppressContentEditableWarning={true}>
                {subjectName}
            </span>
            <span>
                <TbX onClick={() => deleteSubject(id)} />
            </span>
        </div>
    )
}

export default Subject