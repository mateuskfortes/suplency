import { useContext, useMemo } from 'react'
import { Slate, Editable } from 'slate-react'
import FormatButtonsArea from './FormatButtonsArea';
import SlateLeaf from './SlateLeaf';
import SlateElement from './SlateElement';
import { NotebookContext } from '../pages/study/Notebook';

const SlateEditor = () => {
    const { editor, editable, currentContent } = useContext(NotebookContext)

    const renderElement = (props: any) => {
        return <SlateElement {...props} />
    }

    const renderLeaf = (props: any) => {
        return <SlateLeaf {...props} />
    }

    return (
        <Slate 
            editor={editor} 
            initialValue={currentContent}>
            <FormatButtonsArea />
            <Editable 
                ref={editable}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
            />
        </Slate>
    )
}

export default SlateEditor