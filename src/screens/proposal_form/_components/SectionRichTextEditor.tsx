import { useEffect } from 'react'
import { Flex, FlexProps, Text } from '@chakra-ui/react'
import { convertToRaw, EditorState } from 'draft-js'
import logger from 'src/libraries/logger'
import TextEditor from 'src/libraries/ui/RichTextEditor/textEditor'

interface Props {
    label: string
    flexProps?: FlexProps
	editorState: EditorState
	setEditorState: (editorState: EditorState) => void
}

function SectionRichTextEditor({ label, editorState, setEditorState, flexProps }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				mt={8}
				w='100%'
				direction={['column', 'row']}
				align={['stretch', 'end']}
				{...flexProps}>
				<Text
					mr={8}
					pb={2}
					variant='subheading'
					w={['100%', 'calc(30% - 32px)']}
					fontWeight='500'
					textAlign={['left', 'right']}>
					{label}
				</Text>
				<Flex w={['100%', '70%']}>
					<TextEditor
						value={editorState}
						onChange={setEditorState}
						placeholder='What are you building? What’s on your roadmap? When do you expect to complete it by?
						Media: Show and tell what you’re building with any media;
						Links: share relevant links to the team and project' />
				</Flex>
			</Flex>
		)
	}

	useEffect(() => {
		logger.info({ editorState: convertToRaw(editorState.getCurrentContent()) })
	}, [editorState])

	return buildComponent()
}

export default SectionRichTextEditor