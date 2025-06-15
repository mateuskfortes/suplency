import { vi } from "vitest";
import NotebookConection, { GetNotebookRequest } from "../src/services/notebookConection";

describe('notebookConection', () => {
  const okFunc = vi.fn()
  const notOkFunc = vi.fn()
  const dataOk = {
    message: 'ok'
  }
  const dataError = {
    message: 'error',
  }
  const mockFetch = vi.spyOn(global, 'fetch')
  
  beforeEach(() => {
    NotebookConection.run()
    vi.clearAllMocks()
  });

  afterEach(() => {
    NotebookConection.stop()
  });

  it('Should get the notebook', async () => {
    const response = {
      ok: true,
      status: 200,
      json: async () => dataOk,
    } as Response
    mockFetch.mockResolvedValueOnce(response)

    NotebookConection.add({ requestClass: GetNotebookRequest, okFunction: okFunc, notOkFunction: notOkFunc })
    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(notOkFunc).not.toHaveBeenCalled()
    expect(okFunc).toHaveBeenCalled()

    const callArgs = okFunc.mock.calls[0][0]
    expect(callArgs.data).toEqual(dataOk)
    expect(callArgs.response.ok).toBe(true)
    expect(callArgs.response.status).toBe(200)
  }); 

  it('Should make requests in order', async () => {
    const executionLog: number[] = []

    for (let index = 0; index < 10; index++) {
      const response = {
        ok: true,
        status: 200,
        json: async () => ({ index }),
      } as Response

      mockFetch.mockResolvedValueOnce(response)

      const okFunc = ({ data }: any) => {
        executionLog.push(data.index)
      }

      NotebookConection.add({
        requestClass: GetNotebookRequest,
        okFunction: okFunc,
        notOkFunction: notOkFunc,
        data: {},
      })
    }

    await NotebookConection.fetch()

    expect(executionLog).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
});