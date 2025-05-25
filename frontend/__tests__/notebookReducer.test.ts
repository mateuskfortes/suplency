import { findObj, notebookReducer } from "../src/assets/notebookReducer";
import { describe, it, expect, vi, beforeEach, assert } from "vitest";
import { v4 as uuid } from "uuid";
import { AddPageAction, AddSubjectAction, ChangePageAction, ChangeSubjectAction, DeletePageAction, DeleteSubjectAction, notebookStateTemplate, SetContentAction } from "../src/types/notebookTemplate";


const sbId1 = uuid()
const sbId2 = uuid()
const pgId1 = uuid()
const pgId2 = uuid()
const pgId3 = uuid()
const pgId4 = uuid()
const defaultContent = {
    'last_subject': sbId1,
    'subject': [
        {
            'id': sbId1,
            'name': 'subject',
            'color': 'red',
            'last_page': pgId1,
            'page': [
                {
                    'id': pgId1,
                    'number': 0,
                    'color': 'green',
                    'content': [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'page 1' }],
                        },
                    ],
                    'subject': sbId1,
                },
                {
                    'id': pgId2,
                    'number': 1,
                    'color': 'red',
                    'content': [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'page 2' }],
                        },
                    ],
                    'subject': sbId1,
                },
                {
                    'id': pgId3,
                    'number': 2,
                    'color': 'yellow',
                    'content': [
                        {
                            type: 'paragraph',
                            children: [{ text: 'page 3' }],
                        },
                    ],
                    'subject': sbId1,
                }
            ]
        },
        {
            'id': sbId2,
            'name': 'subject',
            'color': 'red',
            'last_page': pgId4,
            'page': [
                {
                    'id': pgId4,
                    'number': 0,
                    'color': 'green',
                    'content': [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'page 1' }],
                        },
                    ],
                    'subject': sbId2,
                }
            ]
        }
    ]
}

describe("Notebook Reducer", () => {
    const currentSubjectHandler = findObj(defaultContent.subject, defaultContent.last_subject);
    const currentPageHandler = findObj(currentSubjectHandler.page, currentSubjectHandler.last_page);
    const updateEditorContent = vi.fn();
    let prevState: notebookStateTemplate = {
        content: defaultContent,
        currentSubject: currentSubjectHandler,
        currentPage: currentPageHandler,
        updateEditorContent,
    }

    // Reset the state before each test
    beforeEach(() => {
        prevState = JSON.parse(JSON.stringify(prevState))
        prevState.updateEditorContent = updateEditorContent
    })

    // Simulate the content of the current page
    const prevContent = [
        { text: 'different page' },
    ]

    it("Should change page", () => {

        const action: ChangePageAction = {
            type: "CHANGE_PAGE",
            payload: {
                id: pgId2,
                currentContent: prevContent,
            }
        }
        const finalState = notebookReducer(prevState, action)

        // Check if the page was changed
        expect(finalState.currentPage.id).toEqual(pgId2)
        expect(finalState.currentSubject.last_page).toEqual(pgId2)

        // Check if the previous content was saved
        assert.deepEqual(prevState.currentPage.content, prevContent)
    })

    it("Should add a page", () => {
        const action: AddPageAction = {
            type: "ADD_PAGE",
            payload: {
                currentContent: prevContent,
                newPage: {
                    id: uuid(),
                    number: 1,
                    content: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'new page 2' }],
                        },
                    ]
                }
            }
        }
        const finalState = notebookReducer(prevState, action)

        // Check if the page was added
        expect(finalState.currentSubject.page).toHaveLength(4)
        assert.deepEqual(finalState.currentSubject.page[1], action.payload.newPage)

        // Check if the new page is now the current page
        assert.deepEqual(finalState.currentPage, action.payload.newPage)

        // Check if the page 1 was not modified
        assert.deepEqual(finalState.currentSubject.page[0], finalState.currentSubject.page[0])

        // Check if the old page 2 is now page 3
        const prevPg2 = prevState.currentSubject.page[1]
        const nowPg3 = finalState.currentSubject.page[2]
        expect(nowPg3.id).toEqual(prevPg2.id)
        expect(nowPg3.number).toEqual(prevPg2.number + 1)
        assert.deepEqual(prevPg2.content, nowPg3.content)

        // Check if the previous content was saved
        assert.deepEqual(prevState.currentPage.content, prevContent)
    })

    it("Should delete page", () => {
        const action: DeletePageAction = {
            type: "DELETE_PAGE"
        }

        const finalState = notebookReducer(prevState, action)

        // Check if the page was deleted
        expect(finalState.currentSubject.page).toHaveLength(2)
        expect(finalState.currentPage.id).toEqual(pgId2)
        expect(finalState.currentSubject.last_page).toEqual(pgId2)
    })

    it("Should change subject", () => {
        const prevContent = [
            { text: 'different page' },
        ]

        const action: ChangeSubjectAction = {
            type: "CHANGE_SUBJECT",
            payload: {
                id: sbId2,
                currentContent: prevContent,
            }
        }
        const finalState = notebookReducer(prevState, action)

        // Check if the subject was changed
        expect(finalState.currentSubject.id).toEqual(sbId2)
        expect(finalState.currentPage.id).toEqual(pgId4)
        expect(finalState.content.last_subject).toEqual(sbId2)

        // Check if the previous content was saved
        assert.deepEqual(prevState.currentPage.content, prevContent)

        // Check if the previous content was saved
        assert.deepEqual(prevState.currentPage.content, prevContent)
    })

    it("Should add subject", () => {
        const newSubject = {
            id: uuid(),
            name: "new subject",
            color: "blue",
            page: [
                {
                    id: uuid(),
                    number: 0,
                    color: "red",
                    content: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'new page 1' }],
                        },
                    ]
                }
            ]
        }
        const action: AddSubjectAction = {
            type: "ADD_SUBJECT",
            payload: {
                newSubject,
                currentContent: prevContent,
            }
        }
        const finalState = notebookReducer(prevState, action)

        // Check if the subject was added
        expect(finalState.content.subject).toHaveLength(3)

        // Check if the new subject is now the current subject
        assert.deepEqual(finalState.currentSubject, newSubject)

        // Check if the previous content was saved
        assert.deepEqual(prevState.currentPage.content, prevContent)
    })

    it("Should delete subject", () => {
        const action: DeleteSubjectAction = {
            type: "DELETE_SUBJECT",
            payload: sbId2,
        }
        const finalState = notebookReducer(prevState, action)

        // Check if the subject was deleted
        expect(finalState.content.subject).toHaveLength(1)
        expect(finalState.currentSubject.id).toEqual(sbId1)
        expect(finalState.currentPage.id).toEqual(pgId1)
    })

    it("Should set content", () => {
        const newContent = {
            last_subject: sbId2,
            subject: [
                {
                    id: sbId2,
                    name: 'subject',
                    color: 'red',
                    last_page: pgId4,
                    page: [
                        {
                            id: pgId4,
                            number: 0,
                            color: 'green',
                            content: [
                                {
                                    type: 'paragraph', 
                                    children: [{ text: 'page 1' }],
                                },
                            ],
                            subject: sbId2,
                        }
                    ]
                }
            ]
        };
        const action: SetContentAction = {
            type: "SET_CONTENT",
            payload: newContent
        };
        const finalState = notebookReducer(prevState, action);

        assert.deepEqual(finalState.content, newContent);
        assert.deepEqual(finalState.currentSubject, newContent.subject[0])
        assert.deepEqual(finalState.currentPage, newContent.subject[0].page[0])
    })

    it("Should delete last page", () => {
        const action: DeletePageAction = {
            type: "DELETE_PAGE"
        }

        prevState.currentSubject.page = [
            {
                id: pgId1,
                number: 0,
                color: 'red',
                content: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'page 1' }],
                    },
                ],
                subject: sbId1,
            },
        ]

        const finalState = notebookReducer(prevState, action)

        // Check if the page was deleted
        expect(finalState.currentSubject.page).toHaveLength(0)
        expect(finalState.currentSubject.last_page).toEqual(null)
        expect(finalState.currentPage).toEqual(null)
    })

    it("Should delete last subject", () => {
        const action: DeleteSubjectAction = {
            type: "DELETE_SUBJECT",
            payload: sbId1,
        }
        prevState.content.subject = [
            {
                id: sbId1,
                name: 'subject',
                color: 'red',
                last_page: pgId1,
                page: [
                    {
                        id: pgId1,
                        number: 0,
                        color: 'red',
                        content: [
                            {
                                type: 'paragraph',
                                children: [{ text: 'page 1' }],
                            },
                        ],
                        subject: sbId1,
                    },
                ]
            }
        ]
        const finalState = notebookReducer(prevState, action)

        // Check if the subject was deleted
        expect(finalState.content.subject).toHaveLength(0)
        expect(finalState.currentSubject).toEqual(null)
        expect(finalState.currentPage).toEqual(null)
        expect(finalState.content.last_subject).toEqual(null)
    })
}) 