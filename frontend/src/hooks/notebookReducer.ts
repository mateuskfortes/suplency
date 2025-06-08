import { useReducer } from "react";
import { ActionTemplate, 
        AddPagePayload, 
        AddSubjectPayload, 
        ChangePagePayload, 
        NotebookContentTemplate, 
        notebookStateTemplate,
        PageTemplate, 
        SubjectTemplate } from "../types/notebookTemplate";

// Utility function to find an object in a list by its ID, return the first object if not found, null if the list is empty
export const findObj = (list: any[], id: string) => list.find((obj: any) => obj.id === id) || list[0] || null;


// Utility function returns a new state with the updated subject
const updateSubject = (state: notebookStateTemplate, newSubject: SubjectTemplate) => {
    return {
        ...state,
        content: {
            ...state.content,
            subject: state.content.subject.map((sb: SubjectTemplate) => sb.id == newSubject.id ? newSubject : sb)
        },
        currentSubject: newSubject
    }
}


export const notebookReducer = (state: notebookStateTemplate, action: ActionTemplate) => {

    // Inserts a new page into the current subject in the new page number position
    const addPage = (st: notebookStateTemplate, { newPage, currentContent }: AddPagePayload) => {
        // Update page numbers
        const pages = st.currentSubject.page.map((pg: PageTemplate) => ({
            ...pg,
            number: pg.number >= newPage.number ? pg.number + 1 : pg.number,
        }))

        // Insert new page in the correct position
        pages.splice(newPage.number, 0, newPage)

        // Create a new subject object with the updated pages
        const updatedSb = {
            ...findObj(st.content.subject, st.currentSubject.id),
            page: pages
        }
        
        const newState = updateSubject(st, updatedSb)
        return changePage(newState, { id: newPage.id, currentContent });
    }

    // Changes the current page to the page with the given ID
    const changePage = (st: notebookStateTemplate = state, { id, currentContent }: ChangePagePayload) => {  
        if (st.currentPage) st.currentPage.content = currentContent // Save the current page content
      
        st.currentSubject.last_page = id || null  // Update the subjet's last page

        // Update the current page
        const currentPageHandler = findObj(st.currentSubject.page, id);
        st.updateEditorContent(currentPageHandler?.content) 
        
        return {
            ...st,
            currentPage: currentPageHandler
        };
    }

    // Deletes the current page from the current subject and updates the page numbers
    const deletePage = (st: notebookStateTemplate) => {

        // Update page numbers and remove the current page
        const pages = st.currentSubject.page.map((pg: PageTemplate) => ({
            ...pg,
            number: pg.number > st.currentPage.number ? pg.number - 1 : pg.number,
        })).filter((pg: PageTemplate) => pg.id !== st.currentPage.id)

        /// Create a new subject object with the updated pages
        const updatedSb = {
            ...st.currentSubject,
            page: pages
        }

        const newState = updateSubject(st, updatedSb)

        // Change the current page to the previous one
        // If the current page is the first one, set the current page to the first page
        const pgN = st.currentPage.number
        const newPageId = pgN > 0 ? 
                          newState.currentSubject.page[pgN - 1].id : 
                          newState.currentSubject.page[0]?.id

        return changePage(newState, { id: newPageId, currentContent: [] })
    }

    // Adds a new subject to the notebook and switches to it
    const addSubject = (st: notebookStateTemplate, { newSubject, currentContent }: AddSubjectPayload) => {
        const newState = {
            ...st,
            content: {
                ...st.content,
                subject: [...st.content.subject, newSubject]
            }
        }
        return changeSubject(newState, { id: newSubject.id, currentContent })
    }

    // Changes the current subject to the subject with the given ID
    const changeSubject = (st: notebookStateTemplate, { id, currentContent }: ChangePagePayload) => {
        if (st.currentPage) st.currentPage.content = currentContent // Save the current page content
        
        const currentSubjectHandler = findObj(st.content.subject, id)
        const currentPageHandler = currentSubjectHandler ? findObj(currentSubjectHandler.page, currentSubjectHandler.last_page) : null
        st.updateEditorContent(currentPageHandler?.content)
        return {
            ...st,
            content: {
                ...st.content,
                last_subject: currentSubjectHandler?.id || null
            },
            currentSubject: currentSubjectHandler,
            currentPage: currentPageHandler
        };
    }

    const setSubjectName = (st: notebookStateTemplate, id: string, name: string) => {
        if (name.length === 0) return st; // Prevent setting an empty name
        console.log("Setting subject name", id, name)
        return {
            ...st,
            content: {
                ...st.content,
                subject: st.content.subject.map((sb: SubjectTemplate) => sb.id === id ? { ...sb, name } : sb)
            },
            currentSubject: {
                ...st.currentSubject,
                name
            }
        }  
    }
    
    // Deletes the subject with the given ID and switches to the first subject
    const deleteSubject = (st: notebookStateTemplate, id: string) => {
        const newState = {
            ...st,
            content: {
                ...st.content,
                subject: st.content.subject.filter((sb: SubjectTemplate) => sb.id !== id)
            }
        }
        return changeSubject(newState, { id: newState.content.subject[0]?.id, currentContent: [] })
    }

    const setContent = (st: notebookStateTemplate, content: NotebookContentTemplate) => {
        const currentSubjectHandler = findObj(content.subject, content.last_subject)
        const currentPageHandler = currentSubjectHandler ? findObj(currentSubjectHandler.page, currentSubjectHandler.last_page) : null
        st.updateEditorContent(currentPageHandler?.content)
        return {
            ...st,
            content: content,
            currentSubject: currentSubjectHandler,
            currentPage: currentPageHandler,
        };
    }
 
    switch (action.type) {
        case "SET_CONTENT": return setContent(state, action.payload);   
        case "CHANGE_SUBJECT":return changeSubject(state, action.payload);
        case "CHANGE_PAGE": return changePage(state, action.payload);
        case "SET_SUBJECT_NAME": return setSubjectName(state, action.payload.id, action.payload.name);
        case "ADD_SUBJECT": return addSubject(state, action.payload);
        case "ADD_PAGE": return addPage(state, action.payload);
        case "DELETE_SUBJECT": return deleteSubject(state, action.payload);
        case "DELETE_PAGE": return deletePage(state)
        default:
            return state;
    }
};

const useNotebook = (initializer: notebookStateTemplate) => {
    return useReducer(notebookReducer, initializer)
}

export default useNotebook