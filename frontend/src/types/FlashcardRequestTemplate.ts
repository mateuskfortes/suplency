import { RequestMethod, ResponseFunctionTemplate } from "./NotebookRequestTemplate";

export type FlashcardConectionAddArgsTemplate = {
	requestClass: RequestConstructorTemplate,
	data?: FlashcardDataTemplate,
	okFunction?: ResponseFunctionTemplate,
	notOkFunction?: ResponseFunctionTemplate ,
}

export type FlashcardConectionTemplate = {
	requests: any[],
	running: boolean,
	add: (args: FlashcardConectionAddArgsTemplate) => void,
	fetch: () => Promise<undefined>,
	run: () => void,
	stop: () => void,
}

type FlashcardPostDataTemplate = {
	question: string;
	answer: string;
	subject?: string[]
}

type FlashcardDeleteDataTemplate = {
	id: string;
}

export type FlashcardDataTemplate = FlashcardPostDataTemplate | FlashcardDeleteDataTemplate | undefined

export interface RequestBase {
	route: string
	method: RequestMethod
	okFunction: ResponseFunctionTemplate
	notOkFunction: ResponseFunctionTemplate
	data: FlashcardDataTemplate
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

export interface RequestConstructorTemplate {
	new (
		okFunction: ResponseFunctionTemplate,
		notOkFunction: ResponseFunctionTemplate,
		data: FlashcardDataTemplate
	): RequestBase
}