import { createContext, useEffect, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateEditor from './SlateEditor';
import SelectSubjectArea from './SelectSubjectArea';
import { NotebookContextType, NotebookContent, SubjectContent, PageContent } from '../../assets/NotebookTemplate';
import SetPage from './SetPage';
import { v4 as uuid } from "uuid";
import fetchHandler from '../../assets/fetchHandler';

// Creates a context for managing notebook state
export const NotebookContext = createContext<NotebookContextType>({
    editor: {} as ReactEditor,
    content: {} as NotebookContent,
    currentSubject: {} as SubjectContent,
    currentPage: {} as PageContent,
    changeSubject: () => {},
    changePage: () => {},
    changePageByNumber: () => {},
    addPage: () => {},
    addSubject: () => {},
    setSubjectName: () => new Promise(() => {}),
    deleteSubject: () => {},
    deletePage: () => {},
});

export const emptyPage = [
    {
        type: 'paragraph', 
        children: [{ text: '' }],
    },
]

// Utility function to locate an object within a list by its ID oterwise returns the first item
const findObj = (list: any, id: string) => list.find((obj: any) => obj.id === id) || list[0];

const Notebook = ({ content }: any) => {
    // Initializes the Slate editor instance 
    const [editor] = useState(() => withHistory(withReact(createEditor())));

    // Determines the initial subject and page based on the last accessed values
    const currentSubjectHandler = findObj(content.subject, content.last_subject);
    const [currentSubject, setCurrentSubject] = useState(currentSubjectHandler);
    const [currentPage, setCurrentPage] = useState(findObj(currentSubjectHandler.page, currentSubjectHandler.last_page));

    useEffect(() => {
        setCurrentSubject(currentSubjectHandler)
        const currentPageHandler = findObj(currentSubjectHandler.page, currentSubjectHandler.last_page)
        setCurrentPage(currentPageHandler)
        updateEditorContent(currentPageHandler.content)
    }, [content])

    // Updates the editor's content and resets the cursor position
    const updateEditorContent = (content: any) => {
        const point = { path: [0, 0], offset: 0 };
        editor.selection = { anchor: point, focus: point };
        editor.children = content || emptyPage;
    };
        
    // conected
    // Adds a new page to the current subject and switches focus to it
    const addPage = () => {
        const id = uuid();
        const number = currentSubject.page.length
        const data = {
            id: id,
            number: number,
            content: emptyPage,
            subject: currentSubject.id
        }
        const okFunction = () => {
            currentSubject.page.push(data);
            changePage(id);
        }
        const notOkFunction = () => {}
        fetchHandler('page', 'POST', okFunction, notOkFunction, data)
    };

    const saveCurrentPage = async () => {
        const okFunction = () => currentPage.content = editor.children;
        const savePageData = {
            id: currentPage.id,
            content: editor.children,
        }
        await fetchHandler('page', 'PUT', okFunction, () => {}, savePageData)
    }

    // conected
    // Changes the currently selected page by ID
    const changePage = async (id: string) => {
        const newPage = findObj(currentSubject.page, id);
        await saveCurrentPage()
        const okFunction = () => {
            currentSubject.last_page = id;
            setCurrentPage(newPage);
            updateEditorContent(newPage.content);
        }
        const changePageData = {
            id: currentSubject.id,
            last_page: newPage.id
        }
        fetchHandler('subject', 'PUT', okFunction, () => {}, changePageData)
    };

    // conected
    // Changes the currently selected page based on its index within the subject
    const changePageByNumber = (number: number) => {
        if (currentSubject.page.length > number && number >= 0) {
            const newPage = currentSubject.page[number];
            changePage(newPage.id)
        }
    };

    // conected
    // Deletes the currently selected page if there is more than one, reassigning page numbers accordingly
    const deletePage = () => {
        if (currentSubject.page.length > 1) {
            const okFunction = () => {
                const pgNumber = currentPage.number
                currentSubject.page.forEach((pg: any) => {
                    if (pg.number > currentPage.number) pg.number--;
                });
                currentSubject.page = currentSubject.page.filter((pg: any) => pg.id !== currentPage.id);
                changePage(pgNumber > 0 ? currentSubject.page[pgNumber - 1].id : currentSubject.page[0].id);
            }
            const data = {
                id: currentPage.id
            }
            fetchHandler('page', 'DELETE', okFunction, () => {}, data)
        }
    };
    
    // conected
    // Adds a new subject with an initial page and switches focus to it
    const addSubject = (name: string) => {
        const sbId = uuid();
        const pgId = uuid();
        const okFunction = () =>  {
            content.subject.push({
                id: sbId,
                name: name,
                last_page: pgId,
                page: [
                    {
                        id: pgId,
                        content: emptyPage,
                        number: 0,
                    }
                ],
            });
            changeSubject(sbId);
        }
        const data = {
            id: sbId,
            name: name,
            page_id: pgId,
        }
        fetchHandler('subject', 
                    'POST',
                    okFunction,
                    () => {},
                    data,)
    };

    // conected
    // Changes the currently selected subject by ID
    const changeSubject = async (id: string) => {
        const newSubject = findObj(content.subject, id);
        const newPage = findObj(newSubject.page, newSubject.last_page);
        await saveCurrentPage()
        const okFunction = () => {
            setCurrentSubject(newSubject);
            setCurrentPage(newPage);
            updateEditorContent(newPage.content);
        }
        const data = {
            last_subject: newSubject.id
        }
        fetchHandler('notebook', 'PUT', okFunction, () => {}, data)
    };

    // conected
    // Updates the name of the currently selected subject. Returns true if the name had change
    const setSubjectName = async (newName: string) => {
        let changed = false
        const okFunction = () => {
            currentSubject.name = newName;
            changed = true
        }
        const notOkFunction = () => {}
        const data = {
            id: currentSubject.id,
            name: newName
        }
        await fetchHandler('subject', 'PUT', okFunction, notOkFunction, data)
        return changed
    };

    // conected
    // Deletes a subject if there is more than one, and switches focus to the first remaining subject
    const deleteSubject = (id: string) => {
        if (content.subject.length > 1) {
            const okFunction = () => {
                content.subject = content.subject.filter((sb: any) => sb.id !== id);
                changeSubject(content.subject[0].id);
            }
            const notOkFunction = () => {}
            const data = {
                id: id
            }
            fetchHandler('subject', 'DELETE', okFunction, notOkFunction, data)
        }
    };

    return (
        <NotebookContext.Provider value={{ 
            editor, 
            content, 
            currentSubject, 
            currentPage, 
            changeSubject, 
            changePage, 
            changePageByNumber, 
            addPage, 
            addSubject,
            setSubjectName,
            deleteSubject,
            deletePage, 
        }}>
            <div className="notebook">
                <div className="notebook_header">
                    <SelectSubjectArea />
                    <SetPage />
                </div>
                <SlateEditor />
            </div>
        </NotebookContext.Provider>
    );
};

export default Notebook;
