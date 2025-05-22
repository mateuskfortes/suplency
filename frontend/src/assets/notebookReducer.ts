import { useReducer } from "react";

// Utility function to find an object in a list by its ID
export const findObj = (list: any, id: string) => list.find((obj: any) => obj.id === id) || list[0];

const updateSubject = (state: any, newSubject: any) => {
    return {
        ...state,
        content: {
            ...state.content,
            subject: state.content.subject.map((sb: any) => sb.id == newSubject.id ? newSubject : sb)
        },
        currentSubject: newSubject
    }
}

const useNotebook = (initializer: any) => {
    const notebookReducer = (state: any, action: any) => {

        const addPage = () => {
            // Update page
            const pages = state.currentSubject.page.map((pg: any) => ({
                ...pg,
                number: pg.number >= action.payload.number ? pg.number + 1 : pg.number,
            }))
            pages.splice(action.payload.number, 0, action.payload)
            const updatedSb = {
                ...findObj(state.content.subject, state.currentSubject.id),
                page: pages
            }
            
            const newState = updateSubject(state, updatedSb)
            return changePage(newState, action.payload.id);
        }
    
        const changePage = (st: any = state, id: string = action.payload) => {
            st.currentPage.content = st.editor.children
            findObj(st.content.subject, st.currentSubject.id).last_page = id
            const currentPageHandler = findObj(st.currentSubject.page, id);
            st.updateEditorContent(currentPageHandler.content) 
            
            return {
                ...st,
                currentPage: currentPageHandler
            };
        }

        const deletePage = () => {
            const pages = state.currentSubject.page.map((pg: any) => ({
                ...pg,
                number: pg.number > state.currentPage.number ? pg.number - 1 : pg.number,
            })).filter((pg: any) => pg.id !== state.currentPage.id)

            const updatedSb = {
                ...state.currentSubject,
                page: pages
            }

            const newState = updateSubject(state, updatedSb)
            console.log('antes', state.currentSubject.page)
            console.log('dps', pages)
            const pgN = state.currentPage.number
            return changePage(newState, pgN > 0 ? 
                                        newState.currentSubject.page[pgN - 1].id : 
                                        newState.currentSubject.page[0].id)
        }
    
        const addSubject = () => {
            const newState = {
                ...state,
                content: {
                    ...state.content,
                    subject: [...state.content.subject, action.payload]
                }
            }
            return changeSubject(newState, action.payload.id)
        }
    
        const changeSubject = (st: any = state, id: string = action.payload) => {
            const currentSubjectHandler = findObj(st.content.subject, id)
            const currentPageHandler = findObj(currentSubjectHandler.page, currentSubjectHandler.last_page)
            st.updateEditorContent(currentPageHandler.content)
            return {
                ...st,
                currentSubject: currentSubjectHandler,
                currentPage: currentPageHandler
            };
        }
        
        const deleteSubject = () => {
            const newState = {
                ...state,
                content: {
                    ...state.content,
                    subject: state.content.subject.filter((sb: any) => sb.id !== action.payload)
                }
            }
            return changeSubject(newState, newState.content.subject[0].id)
        }

        const setContent = () => {
            const currentSubjectHandler = findObj(action.payload.subject, action.payload.last_subject)
            const currentPageHandler = findObj(currentSubjectHandler.page, currentSubjectHandler.last_page)
            state.updateEditorContent(currentPageHandler.content)
            return {
                ...state,
                content: action.payload,
                currentSubject: currentSubjectHandler,
                currentPage: currentPageHandler,
            };
    
        }
     
        switch (action.type) {
            case "SET_CONTENT": return setContent()
            case "CHANGE_SUBJECT":return changeSubject()
            case "CHANGE_PAGE": return changePage()
            case "ADD_SUBJECT": return addSubject()
            case "ADD_PAGE": return addPage();
            case "DELETE_SUBJECT": return deleteSubject()
            case "DELETE_PAGE": return deletePage()
            default:
                return state;
        }
    };
    return useReducer(notebookReducer, initializer)
}

export default useNotebook