import { createContext, useEffect, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateEditor from './page_area/SlateEditor';
import SelectSubjectArea from './subject_area/SelectSubjectArea';
import SetPage from './page_area/SetPage';
import { v4 as uuid } from "uuid";
import NotebookConection, { DeletePageRequest, DeleteSubjectRequest, PostPageRequest, PostSubjectRequest, PutNotebookRequest, PutPageRequest, PutSubjectRequest } from '../../services/notebookConection';
import useNotebook, { findObj } from '../../hooks/notebookReducer';
import { EditableType, NotebookContentTemplate, NotebookContextType, notebookStateTemplate, PageTemplate, SubjectTemplate } from '../../types/notebookTemplate';

// Creates a context for managing notebook state
export const NotebookContext = createContext<NotebookContextType>({
	editor: {} as ReactEditor,
	editable: {} as EditableType,
	content: {} as NotebookContentTemplate,
	currentSubject: {} as SubjectTemplate,
	currentPage: {} as PageTemplate,
	changeSubject: () => { },
	changePage: () => { },
	changePageByNumber: () => { },
	addPage: () => { },
	addSubject: () => { },
	setSubjectName: () => { },
	deleteSubject: () => { },
	deletePage: () => { },
});

export const emptyPage = [
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
]

//NotebookConection.run()

const Notebook = ({ content }: { content: NotebookContentTemplate }) => {
	// Initializes the Slate editor instance 
	const [editor] = useState(() => withHistory(withReact(createEditor())));

	const editable = useRef<EditableType | null>(null);

	// Determines the initial subject and page based on the last accessed values
	const currentSubjectHandler = findObj(content.subject, content.last_subject ?? '');

	// Updates the editor's content and resets the cursor position
	const updateEditorContent = (content: any) => {
		const point = { path: [0, 0], offset: 0 };
		editor.selection = { anchor: point, focus: point };
		editor.children = content || emptyPage;
	};

	const initialState: notebookStateTemplate = {
		content: content,
		currentSubject: currentSubjectHandler,
		currentPage: currentSubjectHandler ? findObj(currentSubjectHandler.page, currentSubjectHandler.last_page ?? '') : null,
		updateEditorContent,
	}

	const [state, dispatch] = useNotebook(initialState)

	useEffect(() => {
		dispatch({ type: 'SET_CONTENT', payload: content })
	}, [content])

	// Runs the NotebookConection to manage the connection with the backend
	useEffect(() => { NotebookConection.run() }, [])

	// Adds a new page to the current subject in next position
	const addPage = () => {
		if (!state.currentSubject) return
		const id = uuid();
		const crNumber = state.currentPage?.number
		const number = crNumber !== undefined ? crNumber + 1 : 0
		const data = {
			id: id,
			number: number,
			content: emptyPage,
			subject: state.currentSubject.id
		}
		NotebookConection.add({ requestClass: PostPageRequest, data })
		dispatch({ type: 'ADD_PAGE', payload: { newPage: data, currentContent: editor.children } })
	};

	const saveCurrentPage = () => {
		if (!state.currentPage) return

		const savePageData = {
			id: state.currentPage.id,
			content: editor.children,
		}
		NotebookConection.add({ requestClass: PutPageRequest, data: savePageData })
	}

	// Changes the currently selected page by ID
	const changePage = async (id: string, savePage: boolean = true) => {
		if (!state.currentSubject) return

		const data = {
			id: state.currentSubject.id,
			last_page: id,
		}
		NotebookConection.add({ requestClass: PutSubjectRequest, data: data })
		if (savePage) saveCurrentPage()
		dispatch({ type: 'CHANGE_PAGE', payload: { id, currentContent: editor.children } })
	};

	// Changes the currently selected page based on its index within the subject
	const changePageByNumber = (number: number) => {
		if (state.currentSubject && state.currentSubject.page.length > number && number >= 0) {
			const newPage = state.currentSubject.page[number];
			changePage(newPage.id)
		}
	};

	// Deletes the currently selected page if there is more than one, reassigning page numbers accordingly
	const deletePage = () => {
		if (!state.currentPage) return

		const data = {
			id: state.currentPage.id
		}
		NotebookConection.add({ requestClass: DeletePageRequest, data })
		dispatch({ type: 'DELETE_PAGE' })
	};

	// Adds a new subject with an initial page and switches focus to it
	const addSubject = (name: string) => {
		const sbId = uuid();
		const pgId = uuid();
		const data = {
			id: sbId,
			name: name,
			page_id: pgId,
		}
		NotebookConection.add({ requestClass: PostSubjectRequest, data: data })

		const payload = {
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
		}
		dispatch({ type: 'ADD_SUBJECT', payload: { newSubject: payload, currentContent: editor.children } })
	};

	// Changes the currently selected subject by ID
	const changeSubject = async (id: string, savePage: boolean = true) => {
		const data = {
			last_subject: id
		}
		NotebookConection.add({ requestClass: PutNotebookRequest, data: data })
		dispatch({ type: 'CHANGE_SUBJECT', payload: { id, currentContent: editor.children } })
		if (savePage) saveCurrentPage()
	};

	// Updates the name of the currently selected subject
	const setSubjectName = (newName: string) => {
		if (!state.currentSubject) return

		const data = {
			id: state.currentSubject.id,
			name: newName
		}
		NotebookConection.add({ requestClass: PutSubjectRequest, data: data })
		dispatch({ type: 'SET_SUBJECT_NAME', payload: { id: state.currentSubject.id, name: newName } })
	};

	// Deletes a subject if there is more than one, and switches focus to the first remaining subject
	const deleteSubject = (id: string) => {
		NotebookConection.add({ requestClass: DeleteSubjectRequest, data: { id } })
		dispatch({ type: 'DELETE_SUBJECT', payload: id })
	};

	return (
		<NotebookContext.Provider value={{
			editor,
			editable,
			content: state.content,
			currentSubject: state.currentSubject,
			currentPage: state.currentPage,
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
