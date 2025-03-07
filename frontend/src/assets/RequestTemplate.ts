

export type ArgsTemplate = [ResponseFunctionTemplate, ResponseFunctionTemplate, PostOrPutPageDataTemplate]

export type NotebookConectionAddArgsTemplate = {
    requestClass: any,  
    data?: PostOrPutPageDataTemplate, 
    okFunction?: ResponseFunctionTemplate, 
    notOkFunction?: ResponseFunctionTemplate,
}

export type NotebookConectionTemplate = {
    requests: any[],
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

export interface PostOrPutPageDataTemplate {
    id?: string;
    number?: string;
    color?: string;
    content?: Object;
    subject?: string;
    last_subject?: string;
    last_page?: string;
}

export interface BaseRequestTemplate {
    okFunction: ResponseFunctionTemplate
    notOkFunction: ResponseFunctionTemplate
}

export interface PostPageRequestTemplate extends BaseRequestTemplate {
    method: 'POST';
    data: PostOrPutPageDataTemplate;
}

export interface PutPageRequestTemplate extends BaseRequestTemplate {
    method: 'PUT';
    data: PostOrPutPageDataTemplate;
}