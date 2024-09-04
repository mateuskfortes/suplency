const SlateLeaf = ({ attributes, children, leaf }: any) => {
    return (
        <span 
            {...attributes} 
            style={{ 
                fontWeight: leaf.bold ? 'bold' : 'normal',
            }}
        >{children}</span>
    );
};

export default SlateLeaf