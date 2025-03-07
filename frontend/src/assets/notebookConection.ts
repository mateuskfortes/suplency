import fetchHandler from "./fetchHandler"
import { NotebookConectionAddArgsTemplate, NotebookConectionTemplate, PostOrPutPageDataTemplate, PostPageRequestTemplate, PutPageRequestTemplate, RequestMethod, ResponseFunctionTemplate } from "./RequestTemplate"

const NotebookConection: NotebookConectionTemplate = {
    requests: [],
    add(args: NotebookConectionAddArgsTemplate) {
        if (!args.okFunction) args.okFunction = () => {}
        if (!args.notOkFunction) args.notOkFunction = () => {}
        this.requests.push(new args.requestClass(args.okFunction, args.notOkFunction, args.data))
    },
    async run() {
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
                    ok = false
                }
                if (!ok) await new Promise(resolve => setTimeout(resolve, 1000));
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
    data: PostOrPutPageDataTemplate

    constructor(okFunction: ResponseFunctionTemplate, notOkFunction: ResponseFunctionTemplate = () => {}, data: PostOrPutPageDataTemplate) {
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

export class PostPageRequest extends PostRequest implements PostPageRequestTemplate {
    route = 'page'

}

export class PutPageRequest extends PutRequest implements PutPageRequestTemplate {
    route = 'page'
}

export class DeletePageRequest extends DeleteRequest {
    route = 'page'
}


export default NotebookConection