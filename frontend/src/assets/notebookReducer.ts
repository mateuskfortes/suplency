import { useReducer } from "react";


export const findObj = (list: any, id: string) => list.find((obj: any) => obj.id === id) || list[0];

const useNotebook = (initializer: any) => {
    const notebookReducer = (state: any, action: any) => {

        const addPage = () => {
            // Update page
            const pages = state.currentSubject.page.map((pg: any) => ({
                ...pg,
                number: pg.number >= action.payload.number ? pg.number + 1 : pg.number,
            }))
            pages.splice(action.payload.number, 0, action.payload)
            
            findObj(state.content.subject, state.currentSubject.id).page = pages

            return changePage({...state}, action.payload.id);
        }
    
        const changePage = (st: any = state, id: string = action.payload) => {
            findObj(st.content.subject, st.currentSubject.id).last_page = id
            const currentPageHandler = findObj(st.currentSubject.page, id);
            st.updateEditorContent(currentPageHandler.content)
            return {
                ...st,
                currentPage: currentPageHandler
            };
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
            case "DELETE_SUBJECT":
                return {
                    ...state,
                    content: {
                        ...state.content,
                        subject: state.content.subject.filter((sb: any) => sb.id !== action.payload)
                    }
                };
    
    
            case "DELETE_PAGE":
                return {
                    ...state,
                    currentSubject: {
                        ...state.currentSubject,
                        page: state.currentSubject.page.filter((pg: any) => pg.id !== action.payload)
                    }
                };
            default:
                return state;
        }
    };
    return useReducer(notebookReducer, initializer)
}

export default useNotebook