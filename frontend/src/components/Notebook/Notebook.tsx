import { createContext, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateEditor from './SlateEditor';
import SelectSubjectArea from './SelectSubjectArea';
import {  NotebookContextType, NotebookContent, SubjectContent, PageContent } from '../../assets/NotebookTemplate';
import SetPage from './SetPage';
import { v4 as uuid } from "uuid"

export const NotebookContext = createContext<NotebookContextType>({
    editor: {} as ReactEditor,
    save: {} as NotebookContent,
    currentSubject: {} as SubjectContent,
    currentPage: {} as PageContent,
    changeSubject: () => {},
    changePage: () => {},
    changePageByNumber: () => {},
    addPage: () => {},
    addSubject: () => {},
    setSubjectName: () => {}
});

/*
{
    'last_subject': self.subject.id,
    'subject': [
        {
            'id': str(self.subject.id),
            'name': 'Subject test',
            'color': 'red',
            'last_page': self.page.id,
            'page': [
                {
                    'id': str(self.page.id),
                    'number': 0,
                    'color': 'green',
                    'content': {'text': 'test'},
                    'subject': self.subject.id,
                }
            ]
        }
    ]
}
*/

const findObj = (list: any, id: string) => {
    return list.find((obj: any) => obj.id === id) || list[0]
}

const Notebook = ({content}: any) => {
    const [editor] = useState(() => withHistory(withReact(createEditor())));

    const [ save ] = useState(content)

    // Set the initial page and subject of the editor

    const sb = findObj(content.subject, content.last_subject)
    const [ currentSubject, setCurrentSubject ] = useState(sb)
    const [ currentPage, setCurrentPage ] = useState(findObj(sb.page, sb.last_page))

    const updateEditorContent = (content: any) => {
        const point = { path: [0, 0], offset: 0 }
        editor.selection = { anchor: point, focus: point };
        editor.children = content
    }

    // change the current subject by id
    const changeSubject = (id: string) => {
        currentPage.content = editor.children
        const newSubject = findObj(save.subject, id)
        const newPage = findObj(newSubject.page, newSubject.last_page)
        setCurrentSubject(newSubject)
        setCurrentPage(newPage)
        updateEditorContent(newPage.content)
    }

    // change the current page by id
    const changePage = (id: string) => {
        currentPage.content = editor.children
        currentSubject.last_page = id
        const newPage = findObj(currentSubject.page, id)
        setCurrentPage(newPage)
        updateEditorContent(newPage.content)
    }

    // change the current page by the page number
    const changePageByNumber = (number: number) => {
        if (currentSubject.page.length > number && number >= 0) {
            currentPage.content = editor.children
            const newPage = currentSubject.page[number]
            currentSubject.last_page = newPage.id
            setCurrentPage(newPage)
            updateEditorContent(newPage.content)
        }
    }

    // add a new page and change the focus to it
    const addPage = () => {
        const id = uuid()
        currentSubject.page.push({
            id: id,
            content: [
                {
                    type: 'paragraph', 
                    children: [{ text: '' }],
                },
            ],
            number: currentSubject.page.length,
        })
        changePage(id)
    }

    // add a new subject and change the focus to it
    const addSubject = (name: string) => {
        const sbId = uuid()
        const pgId = uuid()
        save.subject.push({
            id: sbId,
            name: name,
            last_page: pgId,
            page: [
                {
                    id: pgId,
                    content: [
                        {
                            type: 'paragraph', 
                            children: [{ text: '' }],
                        },
                    ],
                    number: 0,
                }
            ],
        })
        changeSubject(sbId)
    }

    const setSubjectName = (newName: string) => {
        currentSubject.name = newName
    }

    const deleteSubject = (id: string) => {
        
    }

    return (
        <NotebookContext.Provider value={{ 
            editor, 
            save, 
            currentSubject, 
            currentPage, 
            changeSubject, 
            changePage, 
            changePageByNumber, 
            addPage, 
            addSubject,
            setSubjectName }} >
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
