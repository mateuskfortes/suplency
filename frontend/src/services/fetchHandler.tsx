import { RequestMethod, ResponseFunctionTemplate } from "../types/RequestTemplate"

const CSRFTOKENINPUT = document.querySelector('[name=csrfmiddlewaretoken]') as HTMLInputElement
let CSRFTOKEN = CSRFTOKENINPUT?.value

//const URL = window.location.origin
const URL = 'http://localhost:80'

const fetchHandler = async (url: string,
	method: RequestMethod,
	okFunc: ResponseFunctionTemplate = ({ }) => { },
	notOkFunc?: ResponseFunctionTemplate,
	body?: any,
	contentType: string = 'application/json',) => {

	const headers: any = {}

	if (body) headers['Content-Type'] = contentType
	if (method != 'GET') headers['X-CSRFTOKEN'] = CSRFTOKEN
	const response = await fetch(`${URL}/${url}`, {
		method: method,
		headers: headers,
		body: contentType == 'application/json' ? JSON.stringify(body) : body,
		credentials: 'include',
	})
	let data;
	try {
		data = await response.json();
	} catch (error) {
		data = {};
	}
	if (response.ok) {
		if ('csrftoken' in data) {
			CSRFTOKENINPUT.value = data.csrftoken
			CSRFTOKEN = data.csrftoken
		}
		okFunc({ response, data })
		return true
	}
	if (notOkFunc) notOkFunc({ response, data })
	return false
}

export default fetchHandler