import { Editor, Transforms, Element, Node } from 'slate';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
export const fontSizes = { sizes: ['8', '9', '10', '11', '12', '14', '18'], metric: 'pt', default: '12' };

export const colors = {
    grayScale: ['#FFFFFF', '#E0E0E0', '#C0C0C0', '#A0A0A0', '#808080', '#606060', '#404040', '#303030', '#202020', '#000000'],
    default: [
        'rgb(152, 0, 0)', 'rgb(255, 0, 0)', 'rgb(255, 153, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)',
        'rgb(0, 255, 255)', 'rgb(74, 134, 232)', 'rgb(0, 0, 255)', 'rgb(153, 0, 255)', 'rgb(255, 0, 255)',
    ],
};

// Definir os tipos para o texto e os elementos customizados
interface CustomText {
    text: string;
    bold?: boolean;
    italic?: boolean;
    color?: string;
    fontSize?: string;
    superscript?: boolean;
    subscript?: boolean;
    underline?: boolean
}

// Definir o tipo para elementos de parágrafo
interface ParagraphElement {
    type: 'paragraph';
    children: CustomText[];
}

// Definir o tipo para elementos de lista
interface ListItemElement {
    type: 'list-item';
    children: CustomText[];
}

interface BulletedListElement {
    type: 'bulleted-list';
    children: ListItemElement[];
}

interface NumberedListElement {
    type: 'numbered-list';
    children: ListItemElement[];
}

// União de todos os elementos customizados
type CustomElement = ParagraphElement | ListItemElement | BulletedListElement | NumberedListElement;

const CustomSlate = {
    isBlockActive(editor: Editor, format: string) {
        const [match] = Editor.nodes(editor, {
            match: (n: Node) => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === format,
        });
        return !!match;
    },

    isMarkActive(editor: Editor, markName: keyof CustomText) {
        const marks = Editor.marks(editor) as CustomText | undefined;
        return marks ? marks[markName] === true : false;
    },

    toggleMark(editor: Editor, markName: keyof CustomText) {
        const isActive = this.isMarkActive(editor, markName);
        if (isActive) Editor.removeMark(editor, markName);
        else Editor.addMark(editor, markName, true);
    },

    toggleScriptType(editor: Editor, scriptType: 'superscript' | 'subscript') {
        const isActive = this.isMarkActive(editor, scriptType);
        if (isActive) Editor.removeMark(editor, scriptType);
        else {
            switch (scriptType) {
                case 'superscript':
                    Editor.addMark(editor, 'superscript', true);
                    Editor.removeMark(editor, 'subscript');
                    break;
                case 'subscript':
                    Editor.addMark(editor, 'subscript', true);
                    Editor.removeMark(editor, 'superscript');
                    break;
            }
        }
    },

    toggleList(editor: Editor, format: any) {
        const isActive = this.isBlockActive(editor, format);
        
        Transforms.unwrapNodes(editor, {
            match: (n: Node) => !Editor.isEditor(n) && Element.isElement(n) && LIST_TYPES.includes((n as CustomElement).type),
            split: true,
        });

        // Verifica se o tipo é 'paragraph' ou 'list-item'
        const newType: CustomElement['type'] = isActive ? 'paragraph' : 'list-item';

        Transforms.setNodes(editor, { type: newType } as {type: 'paragraph'});

        if (!isActive) {
            const block = { type: format, children: []} as {type: 'paragraph', children: []};
            Transforms.wrapNodes(editor, block as Element);
        }
    },

    setColor(editor: Editor, color: string) {
        if (color === '#000000' || color === 'rgb(0, 0, 0)') Editor.removeMark(editor, 'color');
        else Editor.addMark(editor, 'color', color);
    },

    setFontSize(editor: Editor, fontSize: string) {
        if (fontSize === fontSizes.default) Editor.removeMark(editor, 'fontSize');
        else Editor.addMark(editor, 'fontSize', fontSize);
    }
};

export default CustomSlate;
