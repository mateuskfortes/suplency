import { useState } from "react";
import { renderHook } from "@testing-library/react";
import { findObj, notebookReducer } from "../src/assets/notebookReducer";
import { describe, it, expect, vi } from "vitest";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { createEditor } from "slate";
import { emptyPage } from "../src/components/Notebook/Notebook";
import { v4 as uuid } from "uuid";
import { AddPageAction } from "../src/types/notebookTemplate";


const sbId = uuid()
const pgId = uuid()
const defaultContent = {
    'last_subject': sbId,
    'subject': [
        {
            'id': sbId,
            'name': 'subject',
            'color': 'red',
            'last_page': pgId,
            'page': [
                {
                    'id': pgId,
                    'number': 0,
                    'color': 'green',
                    'content': [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'page 1' }],
                        },
                    ],
                    'subject': sbId,
                },
                {
                    'id': pgId,
                    'number': 1,
                    'color': 'red',
                    'content': [
                        {
                            type: 'paragraph', 
                            children: [{ text: 'page 2' }],
                        },
                    ],
                    'subject': sbId,
                }
            ]
        }
    ]
}

describe("Notebook Reducer", () => {
    const [ editor ] = renderHook(() => useState(() => withHistory(withReact(createEditor())))).result.current
    const currentSubjectHandler = findObj(defaultContent.subject, defaultContent.last_subject);
    const currentPageHandler = findObj(currentSubjectHandler.page, currentSubjectHandler.last_page);
    const updateEditorContent = vi.fn((content: any = prevState.currentPage.content) => {
            const point = { path: [0, 0], offset: 0 };
            editor.selection = { anchor: point, focus: point };
            editor.children = content || emptyPage;
        });
    const prevState = {
        editor,
        content: defaultContent,
        currentSubject: currentSubjectHandler,
        currentPage: currentPageHandler,
        updateEditorContent,
    }

    it("Should add a page", () => {
        const action: AddPageAction = {
            type: "ADD_PAGE",
            payload: {
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
        const finalState = notebookReducer(prevState, action)

        // Check if the page was added
        expect(finalState.currentSubject.page).toHaveLength(3)
        expect(Object.is(finalState.currentSubject.page[1], action.payload)).toBeTruthy()

        // Check if the new page is now the current page
        expect(Object.is(finalState.currentPage, action.payload)).toBeTruthy()

        // Check if the page 1 was not modified
        expect(Object.is(finalState.currentSubject.page[0], finalState.currentSubject.page[0])).toBeTruthy()

        // Check if the old page 2 is now page 3
        const prevPg2 = prevState.currentSubject.page[1]
        const nowPg3 = finalState.currentSubject.page[2]
        expect(nowPg3.id).toEqual(prevPg2.id)
        expect(nowPg3.number).toEqual(prevPg2.number + 1)
        expect(Object.is(prevPg2.content, nowPg3.content)).toBeTruthy()
    })
}) 