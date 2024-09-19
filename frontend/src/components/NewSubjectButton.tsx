import { useContext, useState, useRef, useEffect } from "react";
import { NotebookContext } from "./Notebook";
import { FaPlus } from "react-icons/fa";

const defaultName = 'New subject';

const NewSubjectButton = () => {
    const { notebookObj } = useContext(NotebookContext);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newName, setNewName] = useState(defaultName);
    const formRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handlerCreateSubject = (e: any) => {
        e.preventDefault();
        notebookObj.addSubject(newName);
        setNewName(defaultName);
        setIsFormVisible(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (!formRef.current?.contains(event.target as Node)) {
            setIsFormVisible(false);
        }
    };

    useEffect(() => {
        if (isFormVisible) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isFormVisible]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <button className="new_subject_button" onClick={() => setIsFormVisible(true)}>
                <FaPlus />
            </button>
            {isFormVisible && (
                <div className="new_subject_form" ref={formRef}>
                    <form onSubmit={handlerCreateSubject}>
                        <div className="inputs">
                            <label htmlFor="newName">Nome da nova matéria:</label>
                            <input
                                id="newName"
                                type="text"
                                value={newName}
                                ref={inputRef}
                                onChange={e => setNewName(e.target.value)}
                            />
                        </div>
                        <button className="black_button button create_subject" type="submit">Criar</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default NewSubjectButton;
