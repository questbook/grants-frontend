import React, { KeyboardEvent, ReactElement, useRef } from 'react'
import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react'
import Editor, { composeDecorators } from '@draft-js-plugins/editor'
import createFocusPlugin from '@draft-js-plugins/focus'
import createImagePlugin from '@draft-js-plugins/image'
import createLinkifyPlugin from '@draft-js-plugins/linkify'
import createResizeablePlugin from '@draft-js-plugins/resizeable'
import {
	AtomicBlockUtils,
	ContentBlock,
	EditorCommand,
	EditorState,
	getDefaultKeyBinding,
	RichUtils } from 'draft-js'
import {
	BoldButton,
	ImageAdd,
	ItalicsButton,
	OlButton,
	UlButton,
	UnderlineButton,
} from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import Loader from 'src/libraries/ui/RichTextEditor/loader'
import { getUrlForIPFSHash, uploadToIPFS } from 'src/libraries/utils/ipfs'
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
	icon: ReactElement | undefined
	style: string
	// eslint-disable-next-line react/require-default-props
	label?: string | undefined
}) {
	return (
		<IconButton
			aria-label='save-image'
			bg='white'
			variant='link'
			_hover={{}}
			_active={{}}
			// _active={{ bg: active ? '#A0A7A7' : 'none' }}
			icon={
				icon ? (
					icon
				) : (
					<Text
						color={active ? 'black.100' : 'gray.500'}
						_hover={{ color: active ? 'none' : 'black.100' }}
					>
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
	{
		icon: (active: boolean) => (
			<BoldButton
				color={active ? 'black.100' : 'gray.500'}
				_hover={{ color: active ? 'none' : 'black.100' }}
			/>
		),
		style: 'BOLD',
	},
	{
		icon: (active: boolean) => (
			<ItalicsButton
				color={active ? 'black.100' : 'gray.500'}
				_hover={{ color: active ? 'none' : 'black.100' }}
			/>
		),
		style: 'ITALIC',
	},
	{
		icon: (active: boolean) => (
			<UnderlineButton
				color={active ? 'black.100' : 'gray.500'}
				_hover={{ color: active ? 'none' : 'black.100' }}
			/>
		),
		style: 'UNDERLINE',
	},
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
		<Flex>
			{
				INLINE_STYLES.map((type) => (
					<StyleButton
						key={type.style}
						active={currentStyle.has(type.style)}
						icon={type.icon(currentStyle.has(type.style))}
						onToggle={onToggle}
						style={type.style}
					/>
				))
			}
		</Flex>
	)
}

const HEADER_TYPES = [
	{ style: 'header-one', label: 'H1' },
	{ style: 'header-two', label: 'H2' },
	{ style: 'header-three', label: 'H3' },
]

function HeaderStyleControls({
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
		<Flex>
			{
				HEADER_TYPES.map((type) => (
					<StyleButton
						key={type.label}
						active={type.style === blockType}
						onToggle={onToggle}
						icon={undefined}
						style={type.style}
						label={type.label}
					/>
				))
			}
		</Flex>
	)
}

const BLOCK_TYPES = [
	{
		icon: (active: boolean) => (
			<UlButton
				color={active ? 'black.100' : 'gray.500'}
				_hover={{ color: active ? 'none' : 'black.100' }}
			/>
		),
		style: 'unordered-list-item',
	},
	{
		icon: (active: boolean) => (
			<OlButton
				color={active ? 'black.100' : 'gray.500'}
				_hover={{ color: active ? 'none' : 'black.100' }}
			/>
		),
		style: 'ordered-list-item',
	},
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
		<Flex>
			{
				BLOCK_TYPES.map((type) => (
					<StyleButton
						key={type.style}
						active={type.style === blockType}
						icon={type.icon(type.style === blockType)}
						onToggle={onToggle}
						style={type.style}
					/>
				))
			}
		</Flex>
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

	const onChange = (state: EditorState) => {
		setEditorState(state)
	}

	const handleKeyCommand = (
		command: EditorCommand,
		currentEditorState: EditorState,
	) => {
		const newState = RichUtils.handleKeyCommand(currentEditorState, command)
		if(newState) {
			setEditorState(newState)
			return 'handled'
		}

		return 'not-handled'
	}

	const mapKeyToEditorCommand = (e: KeyboardEvent) => {
		switch (e.keyCode) {
		case 9: // TAB
			const newEditorState = RichUtils.onTab(
				e,
				editorState,
				4 /* maxDepth */,
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

	const toast = useCustomToast()

	const handleImageUpload = async(
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if(event?.target?.files?.[0]) {
			setUploadingImage(true)
			const img = event.target.files[0]
			logger.info({ img }, 'Selected image (Text Editor)')
			const imageHash = (await uploadToIPFS(img)).hash
			logger.info({ imageHash }, 'Uploaded image hash (Text Editor)')
			if(!imageHash) {
				toast({
					title: 'Could not upload image to IPFS',
					status: 'error',
					duration: 3000
				})
				return
			}

			const url = getUrlForIPFSHash(imageHash)
			logger.info({ url }, 'Uploaded image URL (Text Editor)')
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
		<Flex
			direction='column'
			border={readOnly ? 'none' : '1px solid #C1BDB7'}
			w='100%'>
			<Flex
				display={readOnly ? 'none' : 'flex'}
				justify='start'
				border='1px solid #C1BDB7'
				flexWrap='wrap'
				gap={4}
				m={2}
				p={2}
				alignItems='center'
			>
				<HeaderStyleControls
					editorState={editorState}
					onToggle={
						(blockType) => {
							const newState = RichUtils.toggleBlockType(editorState, blockType)
							setEditorState(newState)
						}
					}
				/>

				<Box ml='auto' />

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

				<Box ml={2} />

				{
					!uploadingImage ? (
						<ImageAdd
							cursor='pointer'
							onClick={openInput}
							color='gray.500'
							_hover={{ color: 'black.100' }} />
					) : <Loader />
				}
			</Flex>
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

			<input
				style={{ display: 'none' }}
				ref={imageUploadRef}
				type='file'
				name='myImage'
				onChange={handleImageUpload}
				accept='image/jpg, image/jpeg, image/png'
			/>
		</Flex>
	)
}

TextEditor.defaultProps = { readOnly: false }

export default TextEditor