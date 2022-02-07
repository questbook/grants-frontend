/* eslint-disable max-classes-per-file */
import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';

// Custom overrides for each style
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 4,
  },
  BOLD: {
    color: '#395296',
    fontWeight: 'bold',
  },
  ANYCUSTOMSTYLE: {
    color: '#00e400',
  },
};

function TextEditor() {
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );
  const onChange = (state: EditorState) => {
    setEditorState(state);
  };

  // const handleKeyCommand = (command: any) => {
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     onChange(newState);
  //     return true;
  //   }
  //   return false;
  // };

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onChange(
            RichUtils.toggleInlineStyle(editorState, 'BOLD'),
          );
        }}
      >
        bold
      </button>

      <div>
        <Editor
          customStyleMap={styleMap}
          editorState={editorState}
          // handleKeyCommand={(command) => handleKeyCommand(command)}
          onChange={onChange}
          placeholder="Tell a story..."
          editorKey="foobar"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default TextEditor;
