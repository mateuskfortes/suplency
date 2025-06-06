export type ArgsTemplate = [ResponseFunctionTemplate, ResponseFunctionTemplate, DataTemplate]

export type NotebookConectionAddArgsTemplate = {
    requestClass: any,  
    data?: DataTemplate, 
    okFunction?: ResponseFunctionTemplate, 
    notOkFunction?: ResponseFunctionTemplate,
}

export type NotebookConectionTemplate = {
    requests: any[],
    running: boolean,
    add: (args: NotebookConectionAddArgsTemplate) => void,
    fetch: () => Promise<undefined>,
    run: () => void,
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface ResponseFunctionArgsTemplate {
    response?: object;
    data?: object;
}

export type ResponseFunctionTemplate = ({}: ResponseFunctionArgsTemplate) => boolean | void

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

export type DataTemplate = NotebookPutDataTemplate 
                    | SubjectPostDataTemplate | SubjectPutDataTemplate | SubjectDeleteDataTemplate
                    | PagePostDataTemplate | PagePutDataTemplate | PageDeleteDataTemplate

export interface BaseRequestTemplate {
    okFunction: ResponseFunctionTemplate
    notOkFunction: ResponseFunctionTemplate
    data: DataTemplate;
}


interface PostRequestTemplate {
    method: 'POST'
}

interface PutRequestTemplate {
    method: 'PUT'
}

interface DeleteRequestTemplate {
    method: 'DELETE'
}

export interface PutNotebookRequestTemplate extends BaseRequestTemplate, PutRequestTemplate {
    data: NotebookPutDataTemplate;
}

// Subject Requests
export interface PostSubjectRequestTemplate extends BaseRequestTemplate, PostRequestTemplate {
    data: SubjectPostDataTemplate;
}

export interface PutSubjectRequestTemplate extends BaseRequestTemplate, PutRequestTemplate {
    data: SubjectPutDataTemplate;
}

export interface DeleteSubjectRequestTemplate extends BaseRequestTemplate, DeleteRequestTemplate {
    data: SubjectDeleteDataTemplate;
}

// Page Requests
export interface PostPageRequestTemplate extends BaseRequestTemplate, PostRequestTemplate {
    data: PagePostDataTemplate;
}

export interface PutPageRequestTemplate extends BaseRequestTemplate, PutRequestTemplate {
    data: PagePutDataTemplate;
}

export interface DeletePageRequestTemplate extends BaseRequestTemplate, DeleteRequestTemplate {
    data: PageDeleteDataTemplate;
}
