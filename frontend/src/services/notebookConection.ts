import fetchHandler from "./fetchHandler"
import { DataTemplate, NotebookConectionAddArgsTemplate, NotebookConectionTemplate, RequestMethod, ResponseFunctionTemplate } from "../types/RequestTemplate"

const NotebookConection: NotebookConectionTemplate = {
    requests: [],
    running: false,
    add(args: NotebookConectionAddArgsTemplate) {
        if (!args.okFunction) args.okFunction = () => {}
        if (!args.notOkFunction) args.notOkFunction = () => {}
        this.requests.push(new args.requestClass(args.okFunction, args.notOkFunction, args.data))
    },
    async run() {
        if (this.running) return
        this.running = true // Set the running flag to true to prevent multiple runs
        
        while(true) {
            await this.fetch()
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    },
    async fetch() {
        for (const req of this.requests) {
            let ok = true
            do {
                try {
                    await req.fetch()
                }
                catch (error) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    break
                }
                ok = true
            } while (!ok)
        }
        this.requests = []
        return
    }
}

export class GetRequest {
    route = ''
    method: RequestMethod = 'GET'
    okFunction: ResponseFunctionTemplate
    notOkFunction: ResponseFunctionTemplate
    data: DataTemplate

    constructor(okFunction: ResponseFunctionTemplate, notOkFunction: ResponseFunctionTemplate = () => {}, data: DataTemplate) {
        this.okFunction = okFunction
        this.notOkFunction = notOkFunction
        this.data = data
    }

    async fetch() {
        return await fetchHandler(this.route, this.method, this.okFunction, this.notOkFunction, this.data)
    }
} 

class PutRequest extends GetRequest {
    method: 'PUT' = 'PUT'
}

class PostRequest extends GetRequest {
    method: 'POST' = 'POST'
}

class DeleteRequest extends GetRequest {
    method: 'DELETE' = 'DELETE'
}

export class GetNotebookRequest extends GetRequest {
    route = 'notebook'
}

export class PutNotebookRequest extends PutRequest {
    route = 'notebook'
}

export class PostSubjectRequest extends PostRequest {
    route = 'subject'
}

export class PutSubjectRequest extends PutRequest {
    route = 'subject'
} 

export class DeleteSubjectRequest extends DeleteRequest {
    route = 'subject'
}

export class PostPageRequest extends PostRequest {
    route = 'page'
}

export class PutPageRequest extends PutRequest {
    route = 'page'
}

export class DeletePageRequest extends DeleteRequest {
    route = 'page'
}


export default NotebookConection