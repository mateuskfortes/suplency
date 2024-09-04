const SlateElement = ({ element, attributes, children }: any) => {
    switch (element.type) {
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        default: 
            return (
                <p {...attributes}>
                    {children}
                </p>
            )
    }
}

export default SlateElement