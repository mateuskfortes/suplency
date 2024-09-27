import { useContext } from 'react'
import { Slate, Editable } from 'slate-react'
import FormatButtonsArea from './FormatButtonsArea';
import SlateLeaf from './SlateLeaf';
import SlateElement from './SlateElement';
import { NotebookContext } from './Notebook';

const SlateEditor = () => {
    const { editor, editable, notebookObj } = useContext(NotebookContext)

    const renderElement = (props: any) => {
        return <SlateElement {...props} />
    }

    const renderLeaf = (props: any) => {
        return <SlateLeaf {...props} />
    }

    return (
        <div className="slate_editor">
            <Slate editor={editor} initialValue={notebookObj.getContent()} onChange={r => console.log(notebookObj.getNotebookContent())}>
                <FormatButtonsArea />
                <Editable 
                    className="editable"
                    ref={editable}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    />
            </Slate>
        </div>
    )
}

export default SlateEditor