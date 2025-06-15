import { MutableRefObject } from 'react';
import { Descendant } from 'slate'
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
	last_page?: string | null,
	page: PageTemplate[]
}

export type NotebookContentTemplate = {
	last_subject: string | null,
	subject: SubjectTemplate[]
}

export type notebookStateTemplate = {
	content: NotebookContentTemplate,
	currentSubject: SubjectTemplate | null,
	currentPage: PageTemplate | null,
	updateEditorContent: (content: CustomElement[] | undefined) => void,
}

export type EditableType = MutableRefObject<typeof Editable | null>;

export interface NotebookContextType {
	editor: ReactEditor;
	editable: any;
	content: NotebookContentTemplate;
	currentSubject: SubjectTemplate | null;
	currentPage: PageTemplate | null;
	changeSubject: (id: string, savePage?: boolean) => void;
	changePage: (id: string) => void;
	changePageByNumber: (number: number) => void;
	addPage: () => void;
	addSubject: (name: string) => void;
	setSubjectName: (newName: string) => void;
	deleteSubject: (id: string) => void;
	deletePage: () => void;
}

export type AddPagePayload = {
	newPage: PageTemplate,
	currentContent: Descendant[] // current page content
}

export type AddPageAction = {
	type: "ADD_PAGE",
	payload: AddPagePayload
}

export type ChangePagePayload = {
	id: string, // page id
	currentContent: Descendant[] // current page content
}

export type ChangePageAction = {
	type: "CHANGE_PAGE",
	payload: ChangePagePayload
}

export type DeletePageAction = {
	type: "DELETE_PAGE"
}

export type AddSubjectPayload = {
	newSubject: SubjectTemplate,
	currentContent: Descendant[] // current page content
}

export type AddSubjectAction = {
	type: "ADD_SUBJECT",
	payload: AddSubjectPayload
}

export type ChangeSubjectPayload = {
	id: string, // subject id
	currentContent: Descendant[] // current page content
}

export type ChangeSubjectAction = {
	type: "CHANGE_SUBJECT",
	payload: ChangeSubjectPayload // subject id
}

export type SetSubjectNamePayload = {
	id: string, // subject id
	name: string // new subject name
}

export type SetSubjectNameAction = {
	type: "SET_SUBJECT_NAME",
	payload: SetSubjectNamePayload
}

export type DeleteSubjectAction = {
	type: "DELETE_SUBJECT",
	payload: string // subject id
}

export type SetContentAction = {
	type: "SET_CONTENT",
	payload: NotebookContentTemplate
}

export type ActionTemplate = AddPageAction
	| ChangePageAction
	| DeletePageAction
	| AddSubjectAction
	| ChangeSubjectAction
	| SetSubjectNameAction
	| DeleteSubjectAction
	| SetContentAction;