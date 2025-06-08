import { useContext, useEffect, useRef, useState } from "react"
import { NotebookContext } from "../Notebook"
import { TbX } from "react-icons/tb";

const Subject = ({ id, subjectName, start = false }: any) => {
	const { setSubjectName, changeSubject, deleteSubject } = useContext(NotebookContext)

	const [isEditable, setIsEditable] = useState(!start)
	const subjectContainer = useRef<HTMLSpanElement | null>(null)

	// Set the subject name to be editable
	const setEditable = () => setIsEditable(true)
	const setNotEditable = async () => {
		setIsEditable(false)
		if (!subjectContainer.current) return
		if (subjectContainer.current.innerText != subjectName
			&& subjectContainer.current.innerText?.length > 0) {
			console.log(subjectContainer.current.innerText)
			return setSubjectName(subjectContainer.current.innerText)
		}
		subjectContainer.current.innerText = subjectName // Reset to original name if no change
	}

	const deleteSubjectHandler = (e: any) => {
		e.stopPropagation()
		deleteSubject(id)
	}


	useEffect(() => { if (subjectContainer.current) subjectContainer.current.focus() }, [])

	return (
		<div
			className="subject"
			onKeyDown={e => e.key == 'Enter' ? setNotEditable() : null}
			onBlur={setNotEditable}
			onDoubleClick={setEditable}
			onClick={() => changeSubject(id)}
			data-testid={id}>
			<span
				id={id}
				data-testid={`${id}-name`}
				contentEditable={isEditable}
				ref={subjectContainer}
				suppressContentEditableWarning={true}>
				{subjectName}
			</span>
			<span>
				<TbX data-testid={`${id}-delete`} onClick={deleteSubjectHandler} />
			</span>
		</div>
	)
}

export default Subject