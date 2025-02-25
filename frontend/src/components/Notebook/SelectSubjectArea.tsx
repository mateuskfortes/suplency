import { useContext, useRef, useEffect } from "react";
import Subject from "./Subject";
import { NotebookContext } from "./Notebook";
import NewSubjectButton from "./NewSubjectButton";

const SelectSubjectArea = () => {
    const { content } = useContext(NotebookContext);
    const subjArea = useRef<HTMLDivElement>(null);


    // Roll the bar with the mouse wheel
    const handlerWheel = (e: WheelEvent) => {
        e.preventDefault()
        if (subjArea.current) subjArea.current.scrollLeft += e.deltaY
    };
    useEffect(() => {
        const element = subjArea.current
        element?.addEventListener('wheel', handlerWheel, { passive: false })
        return () => element?.removeEventListener('wheel', handlerWheel)
    }, []);

    return (
        <div className="container_subject">
            <NewSubjectButton />
            <div className="subject_area" ref={subjArea} >
                {
                    content.subject.map(
                        (sb) => <Subject key={sb.id} id={sb.id} subjectName={sb.name} start={true} />
                    )
                }
            </div>
        </div>
    );
};

export default SelectSubjectArea;
