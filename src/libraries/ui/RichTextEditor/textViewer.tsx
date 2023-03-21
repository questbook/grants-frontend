import React from 'react'
import { Button } from '@chakra-ui/react'
import Editor, { composeDecorators } from '@draft-js-plugins/editor'
import createImagePlugin from '@draft-js-plugins/image'
import createLinkifyPlugin from '@draft-js-plugins/linkify'
import createResizeablePlugin from '@draft-js-plugins/resizeable'
import { ContentBlock, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import '@draft-js-plugins/image/lib/plugin.css'

const linkifyPlugin = createLinkifyPlugin({
	component(props) {
		return (
			<Button
				{...props}
				variant='link'
				color='accent.azure'
				fontWeight='400'
				onClick={() => window.open(props.href, '_blank')}
			/>
		)
	},
})
const resizeablePlugin = createResizeablePlugin()
const decorator = composeDecorators(resizeablePlugin.decorator)
const imagePlugin = createImagePlugin({ decorator })
const plugins = [resizeablePlugin, imagePlugin, linkifyPlugin]

function TextViewer({
	value: editorState,
	onChange: setEditorState,
}: {
	value: EditorState
	onChange: (editorState: EditorState) => void
}) {

	// Let this onChange function be there.
	// It is required for the linkify plugin to work.
	const onChange = (state: EditorState) => {
		setEditorState(state)
	}

	function getBlockStyle(block: ContentBlock) {
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
		<Editor
			blockStyleFn={getBlockStyle}
			editorState={editorState}
			onChange={onChange}
			editorKey='foobar'
			spellCheck={false}
			plugins={plugins}
			readOnly
		/>
	)
}

export default TextViewer
