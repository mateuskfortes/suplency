import { Editor, Transforms, Element as SlateElement, Node } from 'slate';

interface CustomElement extends SlateElement {
    type: string;
    children: CustomText[];
}

interface CustomText {
    text: string;
    bold?: boolean;
}

interface EditorMarks {
    bold: boolean;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const CustomSlate = {
    toggleBold(editor: Editor) {
        const marks: EditorMarks | null = Editor.marks(editor) as EditorMarks | null;
        const isBold = marks ? marks.bold === true : false;
        if (isBold) {
            Editor.removeMark(editor, 'bold');
        } else {
            Editor.addMark(editor, 'bold', true);
        }
    },

    isBlockActive(editor: Editor, format: string) {
        const [match] = Editor.nodes(editor, {
            match: (n: Node) => {
                return (
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as CustomElement).type === format
                );
            },
        });
        return !!match;
    },

    toggleList(editor: Editor, format: string) {
        const isActive = CustomSlate.isBlockActive(editor, format);
        const isList = LIST_TYPES.includes(format);

        Transforms.unwrapNodes(editor, {
            match: (n: Node) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes((n as CustomElement).type),
            split: true,
        });

        const newType = isActive ? 'paragraph' : isList ? 'list-item' : 'paragraph';
        Transforms.setNodes(editor, { type: newType } as Partial<CustomElement>);

        if (!isActive && isList) {
            const block = { type: format, children: [] } as CustomElement;
            Transforms.wrapNodes(editor, block);
            Transforms.setNodes(
                editor,
                { type: 'list-item' } as Partial<CustomElement>,
                {
                    match: (n: Node) =>
                        !Editor.isEditor(n) &&
                        SlateElement.isElement(n) &&
                        (n as CustomElement).type === 'paragraph',
                }
            );
        }
    },
};

export default CustomSlate;
