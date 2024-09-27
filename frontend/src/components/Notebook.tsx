import { createContext, MutableRefObject, useEffect, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateEditor from './SlateEditor';
import SelectSubjectArea from './SelectSubjectArea';
import { NotebookContextType } from '../assets/NotebookTemplate';
import {Notebook as NotebookClass} from '../assets/NotebookClass';
import SetPage from './SetPage';

export const NotebookContext = createContext<NotebookContextType>({
    editor: {} as ReactEditor,
    editable: { current: null } as MutableRefObject<HTMLDivElement | null>,
    notebookObj: {} as NotebookClass,
    currentPageIndex: 0,
    currentSubjectId: '',
});



const Notebook = () => {
    const [editor] = useState(() => withHistory(withReact(createEditor())));
    const editable = useRef<HTMLDivElement | null>(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [currentSubjectId, setCurrentSubjectId] = useState('')
    const [notebookObj, setNotebookObj] = useState<NotebookClass | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${window.location.origin}/load-notebook`, {
                    method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const jsonData = await response.json();
                setNotebookObj(new NotebookClass(jsonData, editor, setCurrentPageIndex as (newIndex: Number) => void, setCurrentSubjectId as (newId: string) => void));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    async function saveNotebookContent() {
        try {
            const response = await fetch(`${window.location.origin}/save-notebook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notebookObj?.getNotebookContent()),
                credentials: 'include', 
            });
    
            if (!response.ok) {
                throw new Error('Erro ao enviar o conteúdo para o backend');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
    

    return (
        <NotebookContext.Provider value={{ editor, editable, notebookObj, currentPageIndex, currentSubjectId }} >
            { notebookObj && <div className="notebook">
                <div className="notebook_header">
                    <SelectSubjectArea />
                    <SetPage save={saveNotebookContent}/>
                </div>
                <SlateEditor  />
            </div>}
        </NotebookContext.Provider>
    );
};

export default Notebook;
