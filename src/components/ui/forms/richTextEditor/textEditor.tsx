import React, { useRef } from 'react'
import {
	Flex, IconButton, Image, Link, Text,
} from '@chakra-ui/react'
import Editor, { composeDecorators } from '@draft-js-plugins/editor'
import createFocusPlugin from '@draft-js-plugins/focus'
import createImagePlugin from '@draft-js-plugins/image'
import createLinkifyPlugin from '@draft-js-plugins/linkify'
import createResizeablePlugin from '@draft-js-plugins/resizeable'
import {
	AtomicBlockUtils,
	EditorState,
	getDefaultKeyBinding,
	RichUtils,
} from 'draft-js'
import Loader from 'src/components/ui/loader'
import { getUrlForIPFSHash, uploadToIPFS } from 'src/utils/ipfsUtils'
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
const focusPlugin = createFocusPlugin()
const resizeablePlugin = createResizeablePlugin()
const decorator = composeDecorators(resizeablePlugin.decorator)
const imagePlugin = createImagePlugin({ decorator })
const plugins = [focusPlugin, resizeablePlugin, imagePlugin, linkifyPlugin]

function StyleButton({
	onToggle,
	active,
	icon,
	style,
	label,
}: {
  onToggle: (style: string) => void
  active: boolean
  icon: string | undefined
  style: string
  // eslint-disable-next-line react/require-default-props
  label?: string | undefined
}) {
	return (
		<IconButton
			aria-label='save-image'
			bg={active ? '#A0A7A7' : 'none'}
			_hover={{ bg: active ? '#A0A7A7' : 'none' }}
			_active={{ bg: active ? '#A0A7A7' : 'none' }}
			icon={
				icon ? <Image src={icon} /> : (
					<Text>
						{label}
					</Text>
				)
			}
			onMouseDown={
				(e) => {
					e.preventDefault()
					onToggle(style)
				}
			}
		/>
	)
}

const INLINE_STYLES = [
	{ label: '/ui_icons/bold_button.svg', style: 'BOLD' },
	{ label: '/ui_icons/italics_button.svg', style: 'ITALIC' },
	{ label: '/ui_icons/underline_button.svg', style: 'UNDERLINE' },
]

function InlineStyleControls({
	editorState,
	onToggle,
}: {
  editorState: EditorState
  onToggle: (style: string) => void
}) {
	const currentStyle = editorState.getCurrentInlineStyle()
	return (
		<div className='RichEditor-controls'>
			{
				INLINE_STYLES.map((type) => (
					<StyleButton
						key={type.label}
						active={currentStyle.has(type.style)}
						icon={type.label}
						onToggle={onToggle}
						style={type.style}
					/>
				))
			}
		</div>
	)
}

const BLOCK_TYPES = [
	{ style: 'header-one', label: 'h1' },
	{ style: 'header-two', label: 'h2' },
	{ style: 'header-three', label: 'h3' },
	{ icon: '/ui_icons/ul_button.svg', style: 'unordered-list-item' },
	{ icon: '/ui_icons/ol_button.svg', style: 'ordered-list-item' },
]

function BlockStyleControls({
	editorState,
	onToggle,
}: {
  editorState: EditorState
  onToggle: (style: string) => void
}) {
	const selection = editorState.getSelection()
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(selection.getStartKey())
		.getType()

	return (
		<div className='RichEditor-controls'>
			{
				BLOCK_TYPES.map((type) => (
					<StyleButton
						key={type.label || type.icon}
						active={type.style === blockType}
						icon={type.icon}
						onToggle={onToggle}
						style={type.style}
						label={type.label}
					/>
				))
			}
		</div>
	)
}

function TextEditor({
	placeholder,
	value: editorState,
	onChange: setEditorState,
	readOnly,
}: {
  placeholder: string | undefined
  value: EditorState
  onChange: (editorState: EditorState) => void
  readOnly?: boolean
}) {
	const ref = useRef(null)
	const imageUploadRef = useRef(null)
	const [uploadingImage, setUploadingImage] = React.useState(false)

	const [focused, setFocused] = React.useState(false)
	// const [editorState, setEditorState] = React.useState(() => EditorState.createWithContent(
	//   convertFromRaw(
	//     JSON.parse(
	//       '{"blocks":[{"key":"9ka6i","text":"yolojonknjkn',
	//     ),
	//   ),
	// ));

	const onChange = (state: EditorState) => {
		setEditorState(state)
	}

	const handleKeyCommand = (command: any, currentEditorState: any) => {
		const newState = RichUtils.handleKeyCommand(currentEditorState, command)
		if(newState) {
			setEditorState(newState)
			return 'handled'
		}

		return 'not-handled'
	}

	const mapKeyToEditorCommand = (e: any) => {
		// eslint-disable-next-line default-case
		switch (e.keyCode) {
		case 9: // TAB
			// eslint-disable-next-line no-case-declarations
			const newEditorState = RichUtils.onTab(
				e,
				editorState,
				4, /* maxDepth */
			)
			if(newEditorState !== editorState) {
				setEditorState(newEditorState)
			}

			return null
		}

		return getDefaultKeyBinding(e)
	}

	const openInput = () => {
		if(imageUploadRef.current) {
			(imageUploadRef.current as HTMLInputElement).click()
		}
	}

	const handleImageUpload = async(
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if(event.target.files && event.target.files[0]) {
			setUploadingImage(true)
			const img = event.target.files[0]
			const imageHash = (await uploadToIPFS(img)).hash
			const url = getUrlForIPFSHash(imageHash)
			const contentState = editorState.getCurrentContent()
			const contentStateWithEntity = contentState.createEntity(
				'image',
				'IMMUTABLE',
				{ src: url },
			)
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
			const newEditorState = EditorState.set(editorState, {
				currentContent: contentStateWithEntity,
			})
			setEditorState(
				AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '),
			)
			setUploadingImage(false)
			setFocused(true)
			if(imageUploadRef.current) {
				(imageUploadRef.current as HTMLInputElement).value = ''
			}
		}
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

	function renderPlaceholder() {
		const contentState = editorState.getCurrentContent()
		if(!contentState.hasText()) {
			if(contentState.getBlockMap().first().getType() !== 'unstyled') {
				return false
			}
		}

		return true
	}

	return (
		<div>
			{/* <button
        type="button"
        onClick={() => {
          const richText = JSON.stringify(
            convertToRaw(editorState.getCurrentContent()),
          );
          // console.log(richText);
        }}
      >
        save
      </button> */}

			<Flex
				bg='#E8E9E9'
				h='56px'
				borderRadius='8px 8px 0 0'
				border='1px solid #D0D3D3'
				borderBottom='none'
				alignItems='center'
			>
				<BlockStyleControls
					editorState={editorState}
					onToggle={
						(blockType) => {
							const newState = RichUtils.toggleBlockType(editorState, blockType)
							setEditorState(newState)
						}
					}
				/>

				<InlineStyleControls
					editorState={editorState}
					onToggle={
						(inlineStyle) => {
							const newState = RichUtils.toggleInlineStyle(
								editorState,
								inlineStyle,
							)
							setEditorState(newState)
						}
					}
				/>

				<IconButton
					aria-label='save-image'
					bg='none'
					_active={{ bg: 'none' }}
					_hover={{ bg: 'none' }}
					style={{ transition: 'none' }}
					icon={
						!uploadingImage ? (
							<Image src='/ui_icons/add_image.svg' />
						) : (
							<Loader />
						)
					}
					onClick={openInput}
				/>
			</Flex>

			<input
				style={{ display: 'none' }}
				ref={imageUploadRef}
				type='file'
				name='myImage'
				onChange={handleImageUpload}
				accept='image/jpg, image/jpeg, image/png'
			/>
			<div
				className={focused ? 'richTextContainer focus' : 'richTextContainer'}
				onClick={
					() => {
						if(focused || !ref || !ref.current) {
							return
						}

						(ref.current as HTMLElement)?.focus()
					}
				}
			>
				<Editor
					// eslint-disable-next-line react/jsx-no-bind
					blockStyleFn={getBlockStyle}
					ref={ref}
					editorState={editorState}
					handleKeyCommand={handleKeyCommand}
					keyBindingFn={mapKeyToEditorCommand}
					onChange={onChange}
					placeholder={renderPlaceholder() ? placeholder : ''}
					editorKey='foobar'
					spellCheck={false}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					plugins={plugins}
					readOnly={readOnly}
				/>
			</div>
		</div>
	)
}

TextEditor.defaultProps = { readOnly: false }

export default TextEditor
