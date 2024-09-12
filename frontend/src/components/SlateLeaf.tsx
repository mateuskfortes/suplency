const SlateLeaf = ({ attributes, children, leaf }: any) => {
    const style = { 
        color: leaf.color || 'inherit',
        fontSize: leaf.fontSize || '12px',
    }
    attributes = {
        ...attributes,
        style, 
    }

    if (leaf.bold) children = <strong>{children}</strong>
    if (leaf.underline) children = <u>{children}</u>
    if (leaf.italic) children = <i>{children}</i>
    if (leaf.superscript) children = <sup>{children}</sup>
    else if (leaf.subscript) children = <sub>{children}</sub>

    return (
        <span {...attributes} >
            {children}
        </span>
    );

};

export default SlateLeaf