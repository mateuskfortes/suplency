import { FlashcardDataTemplate } from "./FlashcardRequestTemplate";

export type ArgsTemplate = [ResponseFunctionTemplate, ResponseFunctionTemplate, NotebookDataTemplate]

export type NotebookConectionAddArgsTemplate = {
	requestClass: RequestConstructorTemplate,
	data?: NotebookDataTemplate,
	okFunction?: ResponseFunctionTemplate,
	notOkFunction?: ResponseFunctionTemplate,
}

export type NotebookConectionTemplate = {
	requests: RequestBase[],
	running: boolean,
	add: (args: NotebookConectionAddArgsTemplate) => void,
	fetch: () => Promise<undefined>,
	run: () => void,
	stop: () => void,
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface ResponseFunctionArgsTemplate {
	response?: Response;
	data?: any;
}

export type ResponseFunctionTemplate = ({ }: ResponseFunctionArgsTemplate) => boolean | void

export interface NotebookPutDataTemplate {
	last_subject: string;
}

export interface SubjectPostDataTemplate {
	id?: string;
	name?: string;
	color?: string;
	page_id?: string;
}

export interface SubjectPutDataTemplate {
	id: string;
	name?: string;
	color?: string;
	last_page?: string;
}

export interface SubjectDeleteDataTemplate {
	id: string
}

export interface PagePostDataTemplate {
	id?: string;
	number: number
	color?: string;
	content?: {};
	subject: string
}

export interface PagePutDataTemplate {
	id: string;
	number?: number
	color?: string;
	content?: {};
}

export interface PageDeleteDataTemplate {
	id: string;
}

export type NotebookDataTemplate = NotebookPutDataTemplate
	| SubjectPostDataTemplate 
	| SubjectPutDataTemplate 
	| SubjectDeleteDataTemplate
	| PagePostDataTemplate 
	| PagePutDataTemplate 
	| PageDeleteDataTemplate 
	| undefined

export interface RequestBase {
	route: string
	method: RequestMethod
	okFunction: ResponseFunctionTemplate
	notOkFunction: ResponseFunctionTemplate
	data: NotebookDataTemplate
	fetch(): Promise<boolean>
}

export interface GetRequestInterface extends RequestBase {
	method: 'GET'
}

export interface PostRequestInterface extends RequestBase {
	method: 'POST'
}

export interface PutRequestInterface extends RequestBase {
	method: 'PUT'
}

export interface DeleteRequestInterface extends RequestBase {
	method: 'DELETE'
}

export interface RequestConstructorTemplate {
	new (
		okFunction: ResponseFunctionTemplate,
		notOkFunction: ResponseFunctionTemplate,
		data: NotebookDataTemplate
	): RequestBase
}