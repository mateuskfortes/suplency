import { createContext, MutableRefObject, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import SlateEditor from '../../components/SlateEditor';
import '../../assets/Notebook.scss';

export const NotebookContext = createContext({
    editor: {} as ReactEditor,
    editable: { current: null } as MutableRefObject<HTMLDivElement | null>,
    currentContent: {},
});

const notebookContent = {
    'lastSubject': '-1',
    'subjects': {
        '-1': {
            'name': 'New subject',
            'lastPage': '0',
            'pages': [
                {
                    'id': '-1',
                    'content': [
                        {
                            type: 'paragraph',
                            children: [{ text: 'faaaaaaaaaaaaaaaaaaaala' }],
                        },
                    ]
                }
            ]
        }
    }
}

const Notebook = () => {
    const [ editor ] = useState(() => withReact(createEditor()));
    const editable = useRef<HTMLDivElement | null>(null);
    const [ subjectId, setSubject ] = useState(notebookContent.lastSubject)
    const [ pageIndex, setPage ] = useState(notebookContent.subjects[subjectId].lastPage)
    const [ currentContent, setCurrentContent ] = useState(notebookContent.subjects[subjectId].pages[parseInt(pageIndex)].content);
    console.log(currentContent)

    return (
        <NotebookContext.Provider value={{ editor, editable, currentContent }}>
            <div className='notebook'>
                <SlateEditor />
            </div>
        </NotebookContext.Provider>
    );
};

export default Notebook;
