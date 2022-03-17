/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef } from 'react';
import {
  ContentState,
  convertFromRaw,
  EditorState,
} from 'draft-js';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/image/lib/plugin.css';
import { Link } from '@chakra-ui/react';
import createLinkifyPlugin from '@draft-js-plugins/linkify';

const linkifyPlugin = createLinkifyPlugin({
  component(props) {
    // eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
    // return <a {...props} onClick={() => alert('Clicked on Link!')} />;
    return (
      <Link {...props} onClick={() => window.open(props.href, '_blank')} isExternal />
    );
  },
});
const resizeablePlugin = createResizeablePlugin();
const decorator = composeDecorators(resizeablePlugin.decorator);
const imagePlugin = createImagePlugin({ decorator });
const plugins = [resizeablePlugin, imagePlugin, linkifyPlugin];

function TextViewer({
  // value: editorState,
  // onChange: setEditorState,
  grantDetails,
}: {
  // value: EditorState;
  // onChange: (editorState: EditorState) => void;
  grantDetails: string;
}) {
  const ref = useRef(null);
  const [editorState, setEditorState] = React.useState(() => {
    try {
      const o = JSON.parse(grantDetails);
      return EditorState.createWithContent(convertFromRaw(o));
    } catch (e) {
      if (grantDetails) {
        return EditorState.createWithContent(ContentState.createFromText(grantDetails));
      }
      return EditorState.createEmpty();
    }
  });

  useEffect(() => {
    try {
      const o = JSON.parse(grantDetails);
      const newState = EditorState.createWithContent(convertFromRaw(o));
      EditorState.push(newState, ContentState.createFromText(grantDetails), 'change-block-data');
    } catch (e) {
      if (grantDetails) {
        const newState = EditorState.createWithContent(ContentState.createFromText(grantDetails));
        EditorState.push(newState, ContentState.createFromText(grantDetails), 'change-block-data');
      } else {
        const newState = EditorState.createEmpty();
        EditorState.push(newState, ContentState.createFromText(grantDetails), 'change-block-data');
      }
    }
  }, [grantDetails]);

  const onChange = (state: EditorState) => {
    setEditorState(state);
  };

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
        editorKey="foo"
        spellCheck={false}
        plugins={plugins}
        onChange={onChange}
        readOnly
      />
    </div>
  );
}

export default TextViewer;
