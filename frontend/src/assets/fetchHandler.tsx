const CSRFTOKENINPUT = document.querySelector('[name=csrfmiddlewaretoken]') as HTMLInputElement
let CSRFTOKEN = CSRFTOKENINPUT?.value

const URL = window.location.origin

const fetchHandler = async (url: string, 
                            method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
                            okFunc: (response: any) => void = () => {},
                            notOkFunc?: (error: any) => void,
                            body?: any,
                            contentType: string = 'application/json',) => {

    const headers: any = {}

    if (body) headers['Content-Type'] = contentType
    if (method != 'GET') headers['X-CSRFTOKEN'] = CSRFTOKEN
    fetch(`${URL}/${url}`, {
        method: method,
        headers: headers,
        body: body,
        credentials: 'include',
    })
    .then(async (response: any) => {
        let data;
        try {
            data = await response.json();
        } catch (error) {
            data = {};
        }
        if (response.ok) {
            okFunc({response, data})
            if ('csrftoken' in data) {
                CSRFTOKENINPUT.value = data.csrftoken
                CSRFTOKEN = data.csrftoken
            }
        }
        else if (notOkFunc) notOkFunc({response, data})
    }, (error: any) => alert('Ocorreu um erro ao tentar se conectar ao servidor.' + error))
}

export default fetchHandler