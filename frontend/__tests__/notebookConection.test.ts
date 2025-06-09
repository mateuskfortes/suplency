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
    vi.clearAllMocks()
    NotebookConection.run()
  });
  
  afterEach(() => {
    NotebookConection.stop()
  })
  
  it.only('Should get the notebook', async () => {
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
});