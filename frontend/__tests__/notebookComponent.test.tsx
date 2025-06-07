import { render } from "@testing-library/react";
import Notebook from "../src/components/Notebook/Notebook";
import { v4 as uuid } from 'uuid';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'


const sbId1 = uuid()
const sbId2 = uuid()
const pgId1 = uuid()
const pgId2 = uuid()
const pgId3 = uuid()
const pgId4 = uuid()
const defaultContentBase = {
    'last_subject': sbId1,
    'subject': [
        {
            'id': sbId1,
            'name': 'subject 1',
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
                            children: [{ text: 'sb 1, page 1' }],
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
                            children: [{ text: 'sb 1, page 2' }],
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
                            children: [{ text: 'sb 1, page 3' }],
                        },
                    ],
                    'subject': sbId1,
                }
            ]
        },
        {
            'id': sbId2,
            'name': 'subject 2',
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
                            children: [{ text: 'sb 2, page 1' }],
                        },
                    ],
                    'subject': sbId2,
                }
            ]
        }
    ]
}

describe('<Notebook />', () => {
	let defaultContent = JSON.parse(JSON.stringify(defaultContentBase));
	beforeEach(() => defaultContent = JSON.parse(JSON.stringify(defaultContentBase)));
  it('Renders without crashing', () => {
    const { container, getByTestId } = render(<Notebook content={defaultContent}/>);
    expect(container).toBeInTheDocument();
    const editable = getByTestId('editable');
    expect(editable).toBeInTheDocument();
    expect(editable.textContent).toBe('sb 1, page 1');
  });
  
  it('Should change page content', async() => {
    const { getByTestId } = render(<Notebook content={defaultContent}/>);
    const editable = getByTestId('editable');
		const pageIndex = getByTestId('page-index');
    expect(editable.textContent).toBe('sb 1, page 1');
    
    await userEvent.click(getByTestId('next-page'));
		expect(pageIndex.textContent).toBe('2');
    expect(editable.textContent).toBe('sb 1, page 2');

    await userEvent.click(getByTestId('previous-page'));
		expect(pageIndex.textContent).toBe('1');
    expect(editable.textContent).toBe('sb 1, page 1');
  });

	it('Should add a new page', async() => {
		const { getByTestId } = render(<Notebook content={defaultContent}/>);
		const editable = getByTestId('editable');
		expect(editable.textContent).toBe('sb 1, page 1');

		await userEvent.click(getByTestId('add-page'));
		expect(getByTestId('page-index').textContent).toBe('2');
		expect(editable.textContent?.replace('\ufeff', '')).toBe('');
	})

	it('Should delete a page', async() => {
		const { getByTestId } = render(<Notebook content={defaultContent}/>);
		const editable = getByTestId('editable');
		expect(editable.textContent).toBe('sb 1, page 1');

		await userEvent.click(getByTestId('delete-page'));
		expect(getByTestId('page-index').textContent).toBe('1');
		expect(editable.textContent).toBe('sb 1, page 2');
	})

	it('Should change subject', async() => {
		const { getByTestId } = render(<Notebook content={defaultContent}/>);
		const editable = getByTestId('editable');
		expect(editable.textContent).toBe('sb 1, page 1');

		await userEvent.click(getByTestId(sbId2));
		expect(getByTestId('page-index').textContent).toBe('1');
		expect(editable.textContent).toBe('sb 2, page 1');

		await userEvent.click(getByTestId(sbId1));
		expect(getByTestId('page-index').textContent).toBe('1');
		expect(editable.textContent).toBe('sb 1, page 1');
	})

    it('Should add a new subject', async() => {
        const { getByTestId } = render(<Notebook content={defaultContent}/>);
        const editable = getByTestId('editable');
        expect(editable.textContent).toBe('sb 1, page 1');

        await userEvent.click(getByTestId('add-subject'));
        await userEvent.keyboard('{Control>}[KeyA]{/Control}{Backspace}');
        await userEvent.type(getByTestId('new-name-input'), 'New Subject');
        await userEvent.click(getByTestId('new-subject-submit'));
        expect(getByTestId('subject-area').children.length).toBe(3);
        expect(getByTestId('subject-area').children[2].textContent).toBe('New Subject');

        expect(editable.textContent?.replace('\ufeff', '')).toBe('');
    })

    it('Should delete a subject', async() => {
        const { getByTestId } = render(<Notebook content={defaultContent}/>);
        const editable = getByTestId('editable');
        expect(editable.textContent).toBe('sb 1, page 1');
        expect(getByTestId('subject-area').children.length).toBe(2);

        await userEvent.click(getByTestId(sbId2));
        expect(getByTestId('page-index').textContent).toBe('1');
        expect(editable.textContent).toBe('sb 2, page 1');

        await userEvent.click(getByTestId(sbId2 + '-delete'));
        expect(getByTestId('subject-area').children.length).toBe(1);
        expect(getByTestId(sbId1)).toBeInTheDocument();
        expect(editable.textContent).toBe('sb 1, page 1');
        expect(getByTestId('page-index').textContent).toBe('1');
    })
})