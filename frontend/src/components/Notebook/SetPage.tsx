import { useContext } from "react"
import { NotebookContext } from "./Notebook"
import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";

const SetPage = () => {
    const { changePageByNumber, currentPage, addPage, deletePage } = useContext(NotebookContext)

    const previousPage = () => changePageByNumber(currentPage.number-1)
    const nextPage = () => changePageByNumber(currentPage.number+1)
    const addPageHandler = () => {
        addPage()
    }

    return (
        <div className="set_page_area">
            <div className="page_index">{currentPage.number+1}</div>
            <div className="button_area">
                <button onClick={previousPage}><PiArrowLeftBold /></button>
                <button onClick={nextPage}><PiArrowRightBold /></button>
                <button onClick={addPageHandler}><RiPagesLine /></button>
                <button onClick={deletePage}><MdDeleteForever/></button>
            </div>
        </div>
    )
}

export default SetPage