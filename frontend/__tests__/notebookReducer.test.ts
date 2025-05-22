import React, { act, Children, useState } from "react";
import { renderHook } from "@testing-library/react";
import useNotebook, { findObj } from "../src/assets/notebookReducer";
import { describe, it, expect, vi } from "vitest";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { createEditor } from "slate";
import { emptyPage } from "../src/components/Notebook/Notebook";
import { defaultContent } from "../src/pages/Study";

describe("Notebook Reducer", () => {
    const createNotebookReducer = () => {
        const [ editor ] = renderHook(() => useState(() => withHistory(withReact(createEditor())))).result.current
        const currentSubjectHandler = findObj(defaultContent.subject, defaultContent.last_subject);
        const currentPageHandler = findObj(currentSubjectHandler.page, currentSubjectHandler.last_page);
        const updateEditorContent = vi.fn((content: any = state.currentPage.content) => {
                const point = { path: [0, 0], offset: 0 };
                editor.selection = { anchor: point, focus: point };
                editor.children = content || emptyPage;
            });
            
        const initialState = {
            editor,
            content: defaultContent,
            currentSubject: currentSubjectHandler,
            currentPage: currentPageHandler,
            updateEditorContent,
        }

        const [ state, dispatch ] = renderHook(() => useNotebook(initialState)).result.current

        return {
            state,
            dispatch,
            initialState,
        }
    }

    it("should initialize the state correctly", () => {
        const { state, initialState } = createNotebookReducer()

        expect(JSON.stringify(state)).toEqual(JSON.stringify(initialState))
    })
}) 