import { MutableRefObject } from 'react';
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { Editable } from 'slate-react'

export interface CustomText {
    text: string;
    bold?: boolean;
    italic?: boolean;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    superscript?: boolean;
    subscript?: boolean;
    underline?: boolean
}

interface ParagraphElement {
    type: 'paragraph';
    children: CustomText[];
}

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

export type CustomElement = ParagraphElement | ListItemElement | BulletedListElement | NumberedListElement;

export type PageTemplate = {
    id: string,
    number: number,
    color?: string,
    content: any[],
    subject?: string,
}

export type SubjectTemplate = {
    id: string,
    name: string,
    color?: string,
    last_page?: string,
    page: PageTemplate[]
}

export type NotebookContentTemplate = {
    last_subject: string,
    subject: SubjectTemplate[]
}

export type notebookStateTemplate = {
    editor: BaseEditor & ReactEditor,
    content: NotebookContentTemplate,
    currentSubject: SubjectTemplate,
    currentPage: PageTemplate,
    updateEditorContent: (content: CustomElement[]) => void,
}

export type EditableType = MutableRefObject<typeof Editable | null>;

export interface NotebookContextType {
    editor: ReactEditor;
    editable: any;
    content: NotebookContentTemplate;
    currentSubject: SubjectTemplate;
    currentPage: PageTemplate;
    changeSubject: (id: string, savePage?: boolean) => void;
    changePage: (id: string) => void;
    changePageByNumber: (number: number) => void;
    addPage: () => void;
    addSubject: (name: string) => void;
    setSubjectName: (newName: string) => void;
    deleteSubject: (id: string) => void;
    deletePage: () => void;
}

export type AddPageAction = {
    type: "ADD_PAGE",
    payload: PageTemplate
}

export type ChangePageAction = {
    type: "CHANGE_PAGE",
    payload: string // page id
}

export type DeletePageAction = {
    type: "DELETE_PAGE"
}

export type AddSubjectAction = {
    type: "ADD_SUBJECT",
    payload: SubjectTemplate
}

export type ChangeSubjectAction = {
    type: "CHANGE_SUBJECT",
    payload: string // subject id
}

export type DeleteSubjectAction = {
    type: "DELETE_SUBJECT",
    payload: string // subject id
}

export type SetContentAction = {
    type: "SET_CONTENT",
    payload: NotebookContentTemplate
}

export type ActionTemplate = AddPageAction | ChangePageAction | DeletePageAction | AddSubjectAction | ChangeSubjectAction | DeleteSubjectAction | SetContentAction;