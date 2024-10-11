const SlateElement = ({ element, attributes, children }: any) => {
    switch (element.type) {
        case 'bulleted-list':
            return <ul {...attributes} >{children}</ul>;
        case 'numbered-list':
            return <ol {...attributes} >{children}</ol>;
        case 'list-item':
            return <li {...attributes} >{children}</li>; 
        case 'paragraph':
            return <p {...attributes} >{children}</p>
        default: 
            return <div {...attributes} >{children}</div>
    }
}

export default SlateElement