import { useContext, useRef, useEffect } from "react";
import Subject from "./Subject";
import { NotebookContext } from "./Notebook";
import NewSubjectButton from "./NewSubjectButton";

const SelectSubjectArea = () => {
    const { notebookObj } = useContext(NotebookContext);
    const subjArea = useRef<HTMLDivElement>(null);

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
                    notebookObj?.getSubjectsContentArray().map(
                        ({id, name}) => <Subject key={id} id={id} subjectName={name} start={true} />
                    )
                }
            </div>
        </div>
    );
};

export default SelectSubjectArea;
