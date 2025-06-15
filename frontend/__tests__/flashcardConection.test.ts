import { vi } from "vitest";
import FlashcardConection, { DeleteAllFlashcardsRequest, DeleteFlashcardRequest, GetFlashcardRequest, PostFlashcardRequest } from "../src/services/flashcardConection";
import { ResponseFunctionArgsTemplate } from "../src/types/NotebookRequestTemplate";

const REQUEST_TIMEOUT = 1000

describe('flashcardConection', () => {
  const okFunc = vi.fn()
  const notOkFunc = vi.fn()
  const dataOk = {
    message: 'ok'
  }
  const mockFetch = vi.spyOn(global, 'fetch')
  
  beforeEach(() => {
    FlashcardConection.run()
    vi.clearAllMocks()
  });

  afterEach(() => {
    FlashcardConection.stop()
  });

  it('should get flashcards', async () => {
    const response = {
      ok: true,
      status: 200,
      json: async () => dataOk,
    } as Response
    mockFetch.mockResolvedValueOnce(response)
    FlashcardConection.add({ requestClass: GetFlashcardRequest, okFunction: okFunc, notOkFunction: notOkFunc })
    
    await new Promise(resolve => setTimeout(resolve, REQUEST_TIMEOUT));

    expect(notOkFunc).not.toHaveBeenCalled()
    expect(okFunc).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [ url, options ] = mockFetch.mock.calls[0]
    expect(url).toMatch(/\/flashcard$/)
    expect(options?.method).toBe('GET')
    expect(options?.headers).toEqual({})
    expect(options?.body).toBe(undefined)
    expect(options?.credentials).toBe('include')
  });

  it('Should Post flashcard', async () => {
    const response = {
      ok: true,
      status: 200,
      json: async () => dataOk,
    } as Response
    const body = {
      question: 'question',
      answer: 'answer',
      subject: ['subject']
    }
    mockFetch.mockResolvedValueOnce(response)
    FlashcardConection.add({ requestClass: PostFlashcardRequest, okFunction: okFunc, notOkFunction: notOkFunc, data: body })

    await new Promise(resolve => setTimeout(resolve, REQUEST_TIMEOUT));
    expect(notOkFunc).not.toHaveBeenCalled()
    expect(okFunc).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [ url, options ] = mockFetch.mock.calls[0]
    expect(url).toMatch(/\/flashcard$/)
    expect(options?.method).toBe('POST')
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      "X-CSRFTOKEN": undefined,
    })
    expect(options?.body).toEqual(JSON.stringify(body))
    expect(options?.credentials).toBe('include')
  })

  it('Should delete flashcard', async () => {
    const response = {
      ok: true,
      status: 200,
      json: async () => dataOk,
    } as Response
    const body = {
      id: 'fc'
    }
    mockFetch.mockResolvedValueOnce(response)
    FlashcardConection.add({ requestClass: DeleteFlashcardRequest, okFunction: okFunc, notOkFunction: notOkFunc, data: body })
    await new Promise(resolve => setTimeout(resolve, REQUEST_TIMEOUT));

    expect(notOkFunc).not.toHaveBeenCalled()
    expect(okFunc).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [ url, options ] = mockFetch.mock.calls[0]
    expect(url).toMatch(/\/flashcard$/)
    expect(options?.method).toBe('DELETE')
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      "X-CSRFTOKEN": undefined,
    })
    expect(options?.body).toEqual(JSON.stringify(body))
    expect(options?.credentials).toBe('include')
  })

  it('Should delete all flashcards', async () => {
    const response = {
      ok: true,
      status: 200,
      json: async () => dataOk,
    } as Response
    mockFetch.mockResolvedValueOnce(response)
    FlashcardConection.add({ requestClass: DeleteAllFlashcardsRequest, okFunction: okFunc, notOkFunction: notOkFunc, data: { id: 'all' } })
    await new Promise(resolve => setTimeout(resolve, REQUEST_TIMEOUT));

    expect(notOkFunc).not.toHaveBeenCalled()
    expect(okFunc).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [ url, options ] = mockFetch.mock.calls[0]
    expect(url).toMatch(/\/flashcard$/)
    expect(options?.method).toBe('DELETE')
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      "X-CSRFTOKEN": undefined,
    })
    expect(options?.body).toEqual(JSON.stringify({ id: 'all' }))
    expect(options?.credentials).toBe('include')
  })

  it('Should make requests in order', async () => {
    const executionLog: number[] = []

    for (let index = 0; index < 10; index++) {
      const response = {
        ok: true,
        status: 200,
        json: async () => ({ index }),
      } as Response

      mockFetch.mockResolvedValueOnce(response)

      const okFunc = ({ data }: ResponseFunctionArgsTemplate) => {
        executionLog.push(data?.index)
      }

      FlashcardConection.add({
        requestClass: GetFlashcardRequest,
        okFunction: okFunc,
        notOkFunction: notOkFunc,
      })
    }

    await FlashcardConection.fetch()

    expect(executionLog).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
});