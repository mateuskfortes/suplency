import { createContext, MutableRefObject, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateEditor from '../../components/SlateEditor';
import SelectSubjectArea from '../../components/SelectSubjectArea';
import { NotebookContent, NotebookContextType } from '../../assets/NotebookTemplate';
import {Notebook as NotebookClass} from '../../assets/Notebook';
import SetPage from '../../components/SetPage';
import '../../assets/Notebook.scss';

export const NotebookContext = createContext<NotebookContextType>({
    editor: {} as ReactEditor,
    editable: { current: null } as MutableRefObject<HTMLDivElement | null>,
    notebookObj: {} as NotebookClass,
    currentPageIndex: 0,
    currentSubjectId: '',
});

let notebookContent: NotebookContent = {
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
                            children: [{ text: 'faaaaaaaaaaaaaaaaaaaalassssssss' }],
                        },
                    ],
                },
                {
                    id: '-2',
                    content: [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'segunda né pae  kkkkkkkkkkkk' }],
                        },
                    ]
                },
            ],
        },
        '-2': {
            name: 'New subject 2',
            currentPageIndex: 0,
            pages: [
                {
                    id: '-1',
                    content: [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'faaaaaaaaalei' }],
                        },
                    ],
                },
            ],
        },
        '-3': {
            name: 'New subject 3',
            currentPageIndex: 0,
            pages: [
                {
                    id: '-2',
                    content: [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'faaaaala nao' }],
                        },
                    ],
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
    const [notebookObj] = useState(new NotebookClass(notebookContent, editor, setCurrentPageIndex as (newIndex: Number) => void, setCurrentSubjectId as (newId: string) => void))

    return (
        <NotebookContext.Provider value={{ editor, editable, notebookObj, currentPageIndex, currentSubjectId }} >
            <div className="notebook">
                <div className="notebook_header">
                    <SelectSubjectArea />
                    <SetPage />
                </div>
                <SlateEditor  />
            </div>
        </NotebookContext.Provider>
    );
};

export default Notebook;
