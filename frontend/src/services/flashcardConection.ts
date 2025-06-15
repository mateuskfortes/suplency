import { FlashcardConectionTemplate, FlashcardConectionAddArgsTemplate, FlashcardDataTemplate } from "../types/FlashcardRequestTemplate"
import { RequestMethod, ResponseFunctionTemplate } from "../types/NotebookRequestTemplate"
import fetchHandler from "./fetchHandler"

const FlashcardConection: FlashcardConectionTemplate = {
	requests: [],
	running: false,
	add(args: FlashcardConectionAddArgsTemplate) {
		if (!args.okFunction) args.okFunction = () => { }
		if (!args.notOkFunction) args.notOkFunction = () => { }
		this.requests.push(new args.requestClass(args.okFunction, args.notOkFunction, args.data))
	},
	async run() {
		if (this.running) return
		this.running = true // Set the running flag to true to prevent multiple runs
    while (this.running) {
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
	},
	stop() {
		this.running = false
	}
}

class GetRequest {
	route = ''
	method: RequestMethod = 'GET'
	okFunction: ResponseFunctionTemplate
	notOkFunction: ResponseFunctionTemplate
	data: FlashcardDataTemplate

	constructor(okFunction: ResponseFunctionTemplate, notOkFunction: ResponseFunctionTemplate = () => { }, data: FlashcardDataTemplate) {
		this.okFunction = okFunction
		this.notOkFunction = notOkFunction
		this.data = data
	}

	async fetch() {
		return await fetchHandler(this.route, this.method, this.okFunction, this.notOkFunction, this.data)
	}
}

class PostRequest extends GetRequest {
	method: RequestMethod = 'POST'
}

class DeleteRequest extends GetRequest {
	method: RequestMethod = 'DELETE'
}

export class GetFlashcardRequest extends GetRequest {
	route = 'flashcard'
}

export class PostFlashcardRequest extends PostRequest {
	route = 'flashcard'
}

export class DeleteFlashcardRequest extends DeleteRequest {
	route = 'flashcard'
}

export class DeleteAllFlashcardsRequest extends DeleteRequest {
	route = 'flashcard'
  data: FlashcardDataTemplate = {
    id: 'all'
  }
}

export default FlashcardConection