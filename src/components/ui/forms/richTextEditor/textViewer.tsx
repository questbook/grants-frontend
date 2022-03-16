/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react';
import {
  EditorState,
} from 'draft-js';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/image/lib/plugin.css';

const resizeablePlugin = createResizeablePlugin();
const decorator = composeDecorators(resizeablePlugin.decorator);
const imagePlugin = createImagePlugin({ decorator });
const plugins = [resizeablePlugin, imagePlugin];

function TextViewer({
  value: editorState,
}: {
  value: EditorState;
}) {
  const ref = useRef(null);

  function getBlockStyle(block: any) {
    switch (block.getType()) {
      case 'header-one':
        return 'RichEditor-h1';
      case 'header-two':
        return 'RichEditor-h2';
      case 'header-three':
        return 'RichEditor-h3';
      default:
        return '';
    }
  }

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      {/* eslintjsx-a11y/no-static-element-interactions */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <Editor
        // eslint-disable-next-line react/jsx-no-bind
        blockStyleFn={getBlockStyle}
        ref={ref}
        editorState={editorState}
        editorKey="foobar"
        spellCheck={false}
        readOnly
        plugins={plugins}
        onChange={() => {}}
      />
    </div>
  );
}

export default TextViewer;
