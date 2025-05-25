import { useContext } from 'react'
import { Slate, Editable } from 'slate-react'
import FormatButtonsArea from './FormatButtonsArea';
import SlateLeaf from './SlateLeaf';
import SlateElement from './SlateElement';
import { emptyPage, NotebookContext } from './Notebook';

const SlateEditor = () => {
    const { editor, currentPage, editable } = useContext(NotebookContext)

    const renderElement = (props: any) => {
        return <SlateElement {...props} />
    }

    const renderLeaf = (props: any) => {
        return <SlateLeaf {...props} />
    }

    const content = currentPage?.content || emptyPage

    return (
        <div className="slate_editor">
            <Slate editor={editor} initialValue={content} >
                <FormatButtonsArea />
                { currentPage ? 
                    <Editable
                        ref={editable}
                        className="editable"
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        />
                    : 
                    <div className="empty_page">
                        <p>Page not found</p>
                    </div>
                }
            </Slate>
        </div>
    )
}

export default SlateEditor