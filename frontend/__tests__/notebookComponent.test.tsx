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
    expect(editable.textContent).toBe('sb 1, page 1');
    
    await userEvent.click(getByTestId('next-page'));
    expect(editable.textContent).toBe('sb 1, page 2');

    await userEvent.click(getByTestId('previous-page'));
    expect(editable.textContent).toBe('sb 1, page 1');
  });
})