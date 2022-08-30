import React, { useEffect, useRef } from 'react'
import { Link } from '@chakra-ui/react'
import Editor, { composeDecorators } from '@draft-js-plugins/editor'
import createImagePlugin from '@draft-js-plugins/image'
import createLinkifyPlugin from '@draft-js-plugins/linkify'
import createResizeablePlugin from '@draft-js-plugins/resizeable'
import {
	ContentState,
	convertFromRaw,
	EditorState,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import '@draft-js-plugins/image/lib/plugin.css'

const linkifyPlugin = createLinkifyPlugin({
	component(props) {
		// return <a {...props} onClick={() => alert('Clicked on Link!')} />;
		return (
			<Link
				{...props}
				onClick={() => window.open(props.href, '_blank')}
				isExternal />
		)
	},
})
const resizeablePlugin = createResizeablePlugin()
const decorator = composeDecorators(resizeablePlugin.decorator)
const imagePlugin = createImagePlugin({ decorator })
const plugins = [resizeablePlugin, imagePlugin, linkifyPlugin]

function TextViewer({
	// value: editorState,
	// onChange: setEditorState,
	text,
}: {
  // value: EditorState;
  // onChange: (editorState: EditorState) => void;
  text: string
}) {
	const ref = useRef(null)
	const [editorState, setEditorState] = React.useState(() => {
		try {
			const o = JSON.parse(text)
			return EditorState.createWithContent(convertFromRaw(o))
		} catch(e) {
			if(text) {
				return EditorState.createWithContent(ContentState.createFromText(text))
			}

			return EditorState.createEmpty()
		}
	})

	useEffect(() => {
		try {
			const o = JSON.parse(text)
			const newState = EditorState.createWithContent(convertFromRaw(o))
			EditorState.push(newState, ContentState.createFromText(text), 'change-block-data')
		} catch(e) {
			if(text) {
				const newState = EditorState.createWithContent(ContentState.createFromText(text))
				EditorState.push(newState, ContentState.createFromText(text), 'change-block-data')
			} else {
				const newState = EditorState.createEmpty()
				EditorState.push(newState, ContentState.createFromText(text), 'change-block-data')
			}
		}
	}, [text])

	const onChange = (state: EditorState) => {
		setEditorState(state)
	}

	function getBlockStyle(block: any) {
		switch (block.getType()) {
		case 'header-one':
			return 'RichEditor-h1'
		case 'header-two':
			return 'RichEditor-h2'
		case 'header-three':
			return 'RichEditor-h3'
		default:
			return ''
		}
	}

	return (
		<div>
			<Editor
				blockStyleFn={getBlockStyle}
				ref={ref}
				editorState={editorState}
				editorKey='foo'
				spellCheck={false}
				plugins={plugins}
				onChange={onChange}
				readOnly
			/>
		</div>
	)
}

export default TextViewer
