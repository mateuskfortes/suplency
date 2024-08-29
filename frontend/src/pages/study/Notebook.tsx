import { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const Notebook = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}>
      <Editor 
        editorState={editorState} 
        onChange={handleEditorChange} 
        placeholder="Type something..."
      />
    </div>
  );
};

export default Notebook;
