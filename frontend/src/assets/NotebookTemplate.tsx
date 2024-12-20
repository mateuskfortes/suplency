import { MutableRefObject } from 'react';
import { Descendant, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { Notebook } from './NotebookClass';

interface ParagraphElement {
    type: 'paragraph' | 'numbered-list';
    children: CustomText[];
}

type CustomElement = ParagraphElement;
type CustomText = { 
    children?: CustomText[], 
    italic?: boolean, 
    color?: string, 
    type?: string, 
    text?: string, 
    bold?: boolean, 
    fontFamily?: string, 
    fontSize?: string };

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

export interface PageContent {
    id: string;
    content: Descendant[];
}

export interface SubjectContent {
    id?: string;
    name: string | null;
    currentPageIndex: number;
    pages: PageContent[];
}

export interface NotebookContent {
    currentSubjectId: string;
    subjects: Record<string, SubjectContent>;
}

export interface NotebookContextType {
    editor: ReactEditor;
    editable: MutableRefObject<HTMLDivElement | null>;
    notebookObj: Notebook;
    currentPageIndex: number;
    currentSubjectId: string;
}
