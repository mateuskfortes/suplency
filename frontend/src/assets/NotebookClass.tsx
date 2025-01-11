import { Descendant, Editor } from 'slate'
import { PageContent, SubjectContent, NotebookContent } from './NotebookTemplate'
import fetchHandler from './fetchHandler'

class Page {
    id: string
    content : Descendant[]

    constructor({ id, content }: PageContent) {
        this.id = id
        this.content = content
    }
}

class Subject {
    name: string | null;
    pages: Page[];
    currentPageIndex: number;
    currentNegativePageId: number

    constructor({ name, currentPageIndex, pages }: SubjectContent) {
        this.name = name;
        this.currentPageIndex = currentPageIndex;
        let lowestPageId = 0
        this.pages = pages.map(pg => {
            const id = parseInt(pg.id)
            if (id < lowestPageId) lowestPageId = id 
            return new Page(pg)
        });
        this.currentNegativePageId = lowestPageId
    }

    getData() {
        return { 
            name: this.name, 
            currentPageIndex: this.currentPageIndex, 
            pages: this.pages 
        }
    }

    addNegativeId() {
        return String(this.currentNegativePageId--)
    }
    
    addPage(update: (newId: string) => void, subjectId: string) {
        const newPageIndex = ++this.currentPageIndex
        const newPageId = this.addNegativeId()
        this.pages.splice(newPageIndex, 0, new Page({ 
                id: newPageId, 
                content: [
                    {
                        type: 'paragraph', 
                        children: [{ text: '' }],
                    },
                ],
            }))
        fetchHandler('page', 
                    'POST', 
                    ({ data }) => {
                        this.pages[newPageIndex].id = data.id
                        update(data.id)
                    }, 
                    ({}) => {}, 
                    JSON.stringify({ number: newPageIndex, subject: subjectId }))
    }
    
    setCurrentPage(newPage: number) {
        if (newPage >= 0 && newPage < this.pages.length) {
            this.currentPageIndex = newPage
            return true
        }
        return false
    }

    setName(newName: string) {
        this.name = newName
    }
    
}

export class Notebook {
    currentSubjectId: string
    subjects: Record<string, Subject>
    editor: Editor
    setPageIndex: (newIndex: Number) => void
    setCurrentSubjectId: (newId: string) => void
    setUpdateId: (newId: string) => void
    currentNegativeSubjectId: number

    constructor({ currentSubjectId, subjects }: NotebookContent, editor: Editor, setPageIndex: (newIndex: Number) => void, setCurrentSubjectId: (newId: string) => void, setUpdateId: (newId: string) => void) {
        this.currentSubjectId = currentSubjectId
        this.editor = editor
        this.setPageIndex = setPageIndex
        this.setCurrentSubjectId = setCurrentSubjectId
        this.setUpdateId = setUpdateId
        this.subjects = {}
        this.currentNegativeSubjectId = 0
        Object.keys(subjects).map(sbKey => {
            if (parseInt(sbKey) < this.currentNegativeSubjectId) this.currentNegativeSubjectId = parseInt(sbKey)
            return this.subjects[sbKey] = new Subject(subjects[sbKey])
        })
    }

    updateEditorContent() {
        const point = { path: [0, 0], offset: 0 }
        this.editor.selection = { anchor: point, focus: point };
        this.editor.children = this.getContent()
        this.setPageIndex(this.getCurrentPageIndex())
        this.setCurrentSubjectId(this.currentSubjectId)
    }

    getCurrentSubject() {
        return this.subjects[this.currentSubjectId]
    }

    getCurrentPage() {
        const currentSubject = this.getCurrentSubject()
        return currentSubject.pages[currentSubject.currentPageIndex]
    }

    getCurrentPageIndex() {
        return this.getCurrentSubject().currentPageIndex
    }

    getContent() {
        return this.getCurrentPage().content
    }

    getSubjectsContentArray() {
        let content: SubjectContent[] = []
        Object.keys(this.subjects).map((sbKey: string) => {
            let subjectData: SubjectContent = this.subjects[sbKey].getData()
            subjectData.id = sbKey
            content.push(subjectData)
        })
        return content
    }

    setSubjectName(subjectId: string, newName: string | null) {
        this.subjects[subjectId].name = newName
    }

    updateContent(content: Descendant[]) {
        this.getCurrentPage().content = content
    }

    setCurrentSubject(subjectId: string) {
        this.updateContent(this.editor.children)
        this.currentSubjectId = subjectId
        this.updateEditorContent()
    }

    setCurrentPage(newPage: number) {
        this.updateContent(this.editor.children)
        if (this.getCurrentSubject().setCurrentPage(newPage)) {
            this.updateEditorContent()
            return true
        }
        return false
    }

    addPage() {
        this.updateContent(this.editor.children)
        this.getCurrentSubject().addPage(this.setUpdateId, this.currentSubjectId)
        this.updateEditorContent()
    }

    addSubject(subjectName: string) {
        this.updateContent(this.editor.children)
        const newSubjectId = --this.currentNegativeSubjectId
        const newPageId = '-1'
        const newSubject = new Subject({
            name: subjectName, 
            currentPageIndex: 0, 
            pages: [
                {
                    id: newPageId,
                    content: [
                        {
                            type: 'paragraph', 
                            children: [{ text: '' }],
                        },
                    ],
                },
            ],
        })
        this.subjects[newSubjectId] = newSubject

        this.setCurrentSubject(String(this.currentNegativeSubjectId))
        this.updateEditorContent()

        fetchHandler('subject', 
                    'POST', 
                    ({ data }) => {
                        if (this.currentSubjectId == newSubjectId.toString()) this.currentSubjectId = data.subject_id
                        delete this.subjects[newSubjectId]
                        this.subjects[data.subject_id] = newSubject

                        newSubject.pages[0].id = data.page_id
                        this.setUpdateId(data.subject_id)
                    }, 
                    ({}) => {}, 
                    JSON.stringify({ name: subjectName }))
    }

    saveSubject() {
        
    }
}