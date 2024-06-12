import React, { KeyboardEvent, useRef } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdOutlinePreview } from 'react-icons/md'
import { Button, Flex } from '@chakra-ui/react'
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
	ImageAdd,
} from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import CommentTextViewer from 'src/libraries/ui/RichTextEditor/commentTextViewer'
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


function CommentsTextEditor({
	placeholder,
	value: editorState,
	onChange: setEditorState,
	readOnly,
	input,
	preview,
	setPreview,
	editMode,
	setEditMode,
}: {
	placeholder: string | undefined
	value: EditorState
	onChange: (editorState: EditorState) => void
	readOnly?: boolean
	input: string
	preview: boolean
	setPreview: (value: boolean) => void
	editMode: { isEditing: boolean, commentId: string}
	setEditMode: (isEditing: boolean, commentId: string) => void

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
			w='100%'
			borderRadius='5px'
		>
			{
				preview ? (
					<>
						<Flex
							justify='end'
							m={2}
							p={2}
							alignItems='center'
							gap={2}
						>

							<Button
								variant='link'
								color='gray.500'
								onClick={() => setPreview(false)}
								leftIcon={<MdOutlinePreview />}
							>
								Exit Preview
							</Button>
							{
								editMode?.isEditing && (
									<Button
										variant='link'
										color='gray.500'
										leftIcon={<IoMdClose />}
										onClick={() => setEditMode(false, '')}
									>
										Cancel Edit
									</Button>
								)
							}

						</Flex>
						<div
							style={
								{ minHeight: '100px',
									height: 'auto',
									position: 'relative',
								}
							}
							className='richTextContainer'
							onClick={
								() => {
									if(focused || !ref || !ref.current) {
										return
									}

									(ref.current as HTMLElement)?.focus()
								}
							}
						>
							<CommentTextViewer
								value={editorState}
								onChange={setEditorState}
							/>
						</div>
					</>
				) :

					(
						<>
							{' '}
							<Flex
								m={2}
								p={2}
								alignItems='center'
								gap={2}
							>


								{
									!uploadingImage ? (
										<ImageAdd
											cursor='pointer'
											onClick={openInput}
											color='gray.500'
											_hover={{ color: 'black.100' }} />
									) : <Loader />
								}
								<Flex
									ml='auto'
									gap={6}>
									{
										input?.length > 0 && (
											<Button
												variant='link'
												color='gray.500'
												ml='auto'
												onClick={() => setPreview(!preview)}
												leftIcon={<MdOutlinePreview />}
											>
												Preview
											</Button>
										)
									}
									{
										editMode?.isEditing && (
											<Button
												variant='link'
												color='gray.500'
												ml='auto'
												leftIcon={<IoMdClose />}
												onClick={() => setEditMode(false, '')}
											>
												Cancel Edit
											</Button>
										)
									}
								</Flex>


							</Flex>
							<div
								style={
									{ minHeight: '100px',
										height: 'auto',
										position: 'relative',
									}
								}
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
						</>
					)
			}

		</Flex>
	)
}

CommentsTextEditor.defaultProps = { readOnly: false }

export default CommentsTextEditor