import { Editor, Transforms, Element, Node } from 'slate';

const LIST_TYPES = ['numbered-list', 'bulleted-list']
export const fontSizes = [ '8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '18pt']
export const defaultFontSize = '12pt'

export const grayScale = [
    '#FFFFFF', '#E0E0E0', '#C0C0C0', '#A0A0A0', '#808080', 
    '#606060', '#404040', '#303030', '#202020', '#000000'
];
export const colors = [
    'rgb(152, 0, 0)', 'rgb(255, 0, 0)', 'rgb(255, 153, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 
    'rgb(0, 255, 255)', 'rgb(74, 134, 232)', 'rgb(0, 0, 255)', 'rgb(153, 0, 255)', 'rgb(255, 0, 255)',
]

const CustomSlate = {
    isBlockActive(editor: Editor, format: string) {
        const [match] = Editor.nodes(editor, {
            match: (n: Node) => {
                return (
                    !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    n.type === format
                );
            },
        });
        return !!match;
    },

    isMarkActive(editor: Editor, markName: string) {
        const marks = Editor.marks(editor);
        return marks ? marks[markName] === true : false;
    },

    toggleMark(editor: Editor, markName: string) {
        const isActive = this.isMarkActive(editor, markName)
        if (isActive)Editor.removeMark(editor, markName)
        else Editor.addMark(editor, markName, true)
    },

    toggleScriptType(editor: Editor, scriptType: string) {
        const isActive = this.isMarkActive(editor, scriptType)
        if (isActive) Editor.removeMark(editor, scriptType)
        else {
            switch (scriptType) {
                case 'superscript':
                    Editor.addMark(editor, 'superscript', true)
                    Editor.removeMark(editor, 'subscript')
                    break
                case 'subscript':
                    Editor.addMark(editor, 'subscript', true)
                    Editor.removeMark(editor, 'superscript')
                    break
            }
        }
    },
    
    toggleList(editor: Editor, format: string) {
        const isActive = CustomSlate.isBlockActive(editor, format);
        Transforms.unwrapNodes(editor, {
            match: (n: Node) =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                LIST_TYPES.includes(n.type),
            split: true,
        });
        const newType = isActive ? 'paragraph' : 'list-item';
        Transforms.setNodes(editor, { type: newType });
        if (!isActive) {
            const block = { type: format, children: [] };
            Transforms.wrapNodes(editor, block)
        }
    },

    setColor(editor: Editor, color: string) {
        if (color == '#000000' || color == 'rgb(0, 0, 0)') Editor.removeMark(editor, 'color')
        else Editor.addMark(editor, 'color', color)
    },

    setFontSize(editor: Editor, fontSize: string) {
        if (fontSize == '12px') Editor.removeMark(editor, 'fontSize')
        else Editor.addMark(editor, 'fontSize', fontSize)
    }
};

export default CustomSlate;
