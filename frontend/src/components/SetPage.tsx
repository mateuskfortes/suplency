import { useContext } from "react"
import { NotebookContext } from "./Notebook"
import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";

const SetPage = ({save}: any) => {
    const { notebookObj, currentPageIndex } = useContext(NotebookContext)

    const previousPage = () => notebookObj?.setCurrentPage(currentPageIndex-1)
    const nextPage = () => notebookObj?.setCurrentPage(currentPageIndex+1)
    const addPage = () => notebookObj?.addPage()

    return (
        <div className="set_page_area">
            <div className="page_index">{currentPageIndex+1}</div>
            <div className="button_area">
                <button onClick={previousPage}><PiArrowLeftBold /></button>
                <button onClick={nextPage}><PiArrowRightBold /></button>
                <button onClick={addPage}><RiPagesLine /></button>
                <button onClick={save}>Salvar</button>
            </div>
        </div>
    )
}

export default SetPage