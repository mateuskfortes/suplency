import { useContext } from "react"
import { NotebookContext } from "./Notebook"
import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";

const SetPage = () => {
    const { changePageByNumber, currentPage, addPage } = useContext(NotebookContext)

    const previousPage = () => changePageByNumber(currentPage.number-1)
    const nextPage = () => changePageByNumber(currentPage.number+1)

    return (
        <div className="set_page_area">
            <div className="page_index">{currentPage.number+1}</div>
            <div className="button_area">
                <button onClick={previousPage}><PiArrowLeftBold /></button>
                <button onClick={nextPage}><PiArrowRightBold /></button>
                <button onClick={addPage}><RiPagesLine /></button>
            </div>
        </div>
    )
}

export default SetPage