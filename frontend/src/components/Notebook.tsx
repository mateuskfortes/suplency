import { createContext, MutableRefObject, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateEditor from './SlateEditor';
import SelectSubjectArea from './SelectSubjectArea';
import { NotebookContent, NotebookContextType } from '../assets/NotebookTemplate';
import {Notebook as NotebookClass} from '../assets/NotebookClass';
import SetPage from './SetPage';

export const NotebookContext = createContext<NotebookContextType>({
    editor: {} as ReactEditor,
    editable: { current: null } as MutableRefObject<HTMLDivElement | null>,
    notebookObj: {} as NotebookClass,
    currentPageIndex: 0,
    currentSubjectId: '',
});

const init: NotebookContent =  {
    "currentSubjectId": "-1",
    "subjects": {
        "-1": {
            "name": "História",
            "currentPageIndex": 0,
            "pages": [
                {
                    "id": "-1",
                    "content": [
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "Tópicos:",
                                    "bold": true,
                                    "fontFamily": "Courier New",
                                    "fontSize": "18",
                                }
                            ]
                        },
                        {
                            "type": "numbered-list",
                            "children": [
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Introdução",
                                            "color": "rgb(153, 0, 255)",
                                            "fontFamily": "Georgia"
                                        }
                                    ]
                                },
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Causas da Revolução Industrial",
                                            "color": "rgb(153, 0, 255)",
                                            "fontFamily": "Georgia"
                                        }
                                    ]
                                },
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Impactos sociais e econômicos",
                                            "color": "rgb(153, 0, 255)",
                                            "fontFamily": "Georgia"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "    A Revolução Industrial começou no século XVIII, na Inglaterra, e marcou uma mudança significativa nos métodos de produção. A transição de uma economia agrícola para uma economia baseada em indústrias foi alimentada por inovações tecnológicas, como a máquina a vapor.",
                                    "fontFamily": "Georgia"
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": ""
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "Causas:",
                                    "fontSize": "18",
                                    "bold": true,
                                    "fontFamily": "Courier New",
                                    "italic": true
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": ""
                                }
                            ]
                        },
                        {
                            "type": "bulleted-list",
                            "children": [
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Avanço da ciência e tecnologia.",
                                            "fontFamily": "Georgia",
                                            "color": "rgb(153, 0, 255)"
                                        }
                                    ]
                                },
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Disponibilidade de capital para investimento.",
                                            "fontFamily": "Georgia",
                                            "color": "rgb(153, 0, 255)"
                                        }
                                    ]
                                },
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Crescimento populacional, o que levou à demanda por mais produtos.",
                                            "fontFamily": "Georgia",
                                            "color": "rgb(153, 0, 255)"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "Impactos:",
                                    "fontFamily": "Courier New",
                                    "bold": true,
                                    "fontSize": "18"
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "fontFamily": "Courier New",
                                    "bold": true,
                                    "fontSize": "18",
                                    "text": ""
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "fontFamily": "Georgia",
                                    "text": "     A Revolução Industrial trouxe mudanças sociais profundas, como o êxodo rural e o crescimento das cidades. A classe trabalhadora enfrentava condições difíceis, enquanto a classe empresarial se beneficiava da riqueza gerada pelas fábricas."
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "-2",
                    "content": [
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "A Primeira Guerra Mundial: ",
                                    "fontFamily": "Courier New",
                                    "italic": true,
                                    "fontSize": "18",
                                    "bold": true,
                                    "color": "rgb(255, 0, 0)"
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "fontFamily": "Courier New",
                                    "italic": true,
                                    "fontSize": "18",
                                    "bold": true,
                                    "text": ""
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "fontFamily": "Courier New",
                                    "italic": true,
                                    "fontSize": "18",
                                    "bold": true,
                                    "text": "Tópicos:"
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": ""
                                }
                            ]
                        },
                        {
                            "type": "numbered-list",
                            "children": [
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Causas da Guerra",
                                            "color": "rgb(255, 0, 255)"
                                        }
                                    ]
                                },
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Alianças",
                                            "color": "rgb(255, 0, 255)"
                                        }
                                    ]
                                },
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Consequências",
                                            "color": "rgb(255, 0, 255)"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "    A Primeira Guerra Mundial (1914-1918) foi um conflito de grandes proporções que envolveu diversos países ao redor do mundo. As tensões entre as nações europeias e suas colônias contribuíram para o início do conflito."
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": ""
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "Causas:",
                                    "italic": true,
                                    "fontFamily": "Courier New",
                                    "bold": true,
                                    "fontSize": "18"
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": ""
                                }
                            ]
                        },
                        {
                            "type": "bulleted-list",
                            "children": [
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Nacionalismo exacerbado.",
                                            "color": "rgb(255, 0, 255)"
                                        }
                                    ]
                                },
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Disputas territoriais.",
                                            "color": "rgb(255, 0, 255)"
                                        }
                                    ]
                                },
                                {
                                    "type": "list-item",
                                    "children": [
                                        {
                                            "text": "Assassínio do arquiduque Franz Ferdinand.",
                                            "color": "rgb(255, 0, 255)"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "Consequências:",
                                    "fontFamily": "Courier New",
                                    "fontSize": "18",
                                    "bold": true
                                },
                                {
                                    "fontFamily": "Courier New",
                                    "fontSize": "18",
                                    "text": " "
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "fontFamily": "Courier New",
                                    "fontSize": "18",
                                    "text": ""
                                }
                            ]
                        },
                        {
                            "type": "paragraph",
                            "children": [
                                {
                                    "text": "    O Tratado de Versalhes, que encerrou a guerra, impôs pesadas sanções à Alemanha, alterando significativamente o mapa político da Europa. O fim da guerra também levou à criação da Liga das Nações, uma tentativa de manter a paz no futuro."
                                }
                            ]
                        }
                    ]
                },
                
            ]
        }
    }
}


const Notebook = () => {
    const [editor] = useState(() => withHistory(withReact(createEditor())));
    const editable = useRef<HTMLDivElement | null>(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [currentSubjectId, setCurrentSubjectId] = useState('')
    const [notebookObj] = useState(new NotebookClass(
        init, 
        editor, 
        setCurrentPageIndex as (newIndex: Number) => void, 
        setCurrentSubjectId as (newId: string) => void)
    )

    return (
        <NotebookContext.Provider value={{ editor, editable, notebookObj, currentPageIndex, currentSubjectId }} >
            <div className="notebook">
                <div className="notebook_header">
                    <SelectSubjectArea />
                    <SetPage />
                    <SetPage />
                </div>
                <SlateEditor  />
            </div>
        </NotebookContext.Provider>
    );
};

export default Notebook;
