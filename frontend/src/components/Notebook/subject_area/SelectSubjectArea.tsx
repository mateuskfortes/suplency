import { useContext, useRef, useEffect } from "react";
import Subject from "./Subject";
import { NotebookContext } from "../Notebook";
import NewSubjectButton from "./NewSubjectButton";
import EmptySubjectArea from "./EmptySubjectArea";

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
            <div data-testid="subject-area" className="subject_area" ref={subjArea} >
                { content.subject.length > 0 ?
                    content.subject.map(
                        (sb) => <Subject key={sb.id} id={sb.id} subjectName={sb.name} start={true} />
                    )
                    :
                    <EmptySubjectArea />
                }
            </div>
        </div>
    );
};

export default SelectSubjectArea;
