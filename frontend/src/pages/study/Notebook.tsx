import { createContext, MutableRefObject, useRef, useState } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import '../../assets/Notebook.scss'
import FormatButtons from '../../components/FormatButtons';
import SlateLeaf from '../../components/SlateLeaf';
import SlateElement from '../../components/SlateElement';

const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: 'Pimerio negoço', bold: true }],
    },
]

export const NotebookContext = createContext({
    editor: {} as ReactEditor,
    editable: { current: null } as MutableRefObject<HTMLDivElement | null>,
})

const Notebook = () => {
    const [editor] = useState(() => withReact(createEditor()))
    const editable = useRef<HTMLDivElement | null>(null)

    const renderElement = (props: any) => {
        return <SlateElement {...props} />
    }

    const renderLeaf = (props: any) => {
        return <SlateLeaf {...props} />
    } 

    return (
        <NotebookContext.Provider value={{ editor, editable }}>
            <div className='notebook'>
                <Slate editor={editor} initialValue={initialValue}>
                    <FormatButtons />
                    <Editable 
                        ref={editable}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                    />
                </Slate>
            </div>
        </NotebookContext.Provider>
    )
}

export default Notebook