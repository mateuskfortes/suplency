import { createContext, MutableRefObject, useEffect, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateEditor from './SlateEditor';
import SelectSubjectArea from './SelectSubjectArea';
import { NotebookContent, NotebookContextType } from '../assets/NotebookTemplate';
import { Notebook as NotebookClass } from '../assets/NotebookClass';
import SetPage from './SetPage';

export const NotebookContext = createContext<NotebookContextType>({
    editor: {} as ReactEditor,
    editable: { current: null } as MutableRefObject<HTMLDivElement | null>,
    notebookObj: {} as NotebookClass,
    currentPageIndex: 0,
    currentSubjectId: '',
});

const jsonData: NotebookContent = {
    currentSubjectId: '-1',
    subjects: {
        '-1': {
            name: 'New subject',
            currentPageIndex: 0,
            pages: [
                {
                    id: '-1',
                    content: [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'Página 1',  }],
                        },
                    ],
                },
                {
                    id: '-2',
                    content: [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'Página 2' }],
                        },
                    ]
                },
            ],
        },
    },
};


const Notebook = () => {
    const [editor] = useState(() => withHistory(withReact(createEditor())));
    const editable = useRef<HTMLDivElement | null>(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [currentSubjectId, setCurrentSubjectId] = useState('')
    const [notebookObj,] = useState<NotebookClass>(new NotebookClass(jsonData, editor, setCurrentPageIndex as (newIndex: Number) => void, setCurrentSubjectId as (newId: string) => void))

    return (
        <NotebookContext.Provider value={{ editor, editable, notebookObj, currentPageIndex, currentSubjectId }} >
            { notebookObj && <div className="notebook">
                <div className="notebook_header">
                    <SelectSubjectArea />
                    <SetPage />
                </div>
                <SlateEditor  />
            </div>}
        </NotebookContext.Provider>
    );
};

export default Notebook;
