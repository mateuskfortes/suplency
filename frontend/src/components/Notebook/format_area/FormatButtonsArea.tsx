import { useContext } from "react"
import { NotebookContext } from "../Notebook"
import CustomSlate, { fontSizes, fontFamilies } from "../editor/CustomSlate"
import FormatInput from "./FormatInput"
import ColorInput from "./ColorInput";
import SelectInput from "./SelectInput";


import { FaBold } from "react-icons/fa6";
import { FiUnderline, FiItalic } from "react-icons/fi";
import { IoListOutline } from "react-icons/io5";
import { MdOutlineFormatListNumbered, MdFormatColorText } from "react-icons/md"
import { RiSuperscript2, RiSubscript2 } from "react-icons/ri";

const FormatButtonsArea = () => {
	const { editor } = useContext(NotebookContext)

	const toggleBold = () => CustomSlate.toggleMark(editor, 'bold')
	const toggleUnderline = () => CustomSlate.toggleMark(editor, 'underline')
	const toggleItalic = () => CustomSlate.toggleMark(editor, 'italic')
	const toggleBulletedList = () => CustomSlate.toggleList(editor, 'bulleted-list')
	const toggleNumberedList = () => CustomSlate.toggleList(editor, 'numbered-list')
	const toggleSuperscript = () => CustomSlate.toggleScriptType(editor, 'superscript')
	const toggleSubscript = () => CustomSlate.toggleScriptType(editor, 'subscript')
	const setFontSize = (fontSize: string) => CustomSlate.setFontSize(editor, fontSize)
	const setFontFamily = (fontFamily: string) => CustomSlate.setFontFamily(editor, fontFamily)

	return (
		<div className="conteiner_format_buttons">
			<FormatInput children={<FaBold />} onClick={toggleBold} />
			<FormatInput children={<FiUnderline />} onClick={toggleUnderline} />
			<FormatInput children={<FiItalic />} onClick={toggleItalic} />
			<FormatInput children={<IoListOutline />} onClick={toggleBulletedList} />
			<FormatInput children={<MdOutlineFormatListNumbered />} onClick={toggleNumberedList} />
			<FormatInput children={<RiSuperscript2 />} onClick={toggleSuperscript} />
			<FormatInput children={<RiSubscript2 />} onClick={toggleSubscript} />
			<ColorInput children={<MdFormatColorText />} />
			<SelectInput options={fontSizes.sizes} onChange={setFontSize} defaultValue={fontSizes.default} />
			<SelectInput options={fontFamilies.fonts} onChange={setFontFamily} defaultValue={fontFamilies.default} />
		</div>
	)
}

export default FormatButtonsArea