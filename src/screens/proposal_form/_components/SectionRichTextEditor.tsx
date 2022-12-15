import { Flex, FlexProps, Text } from '@chakra-ui/react'
import { EditorState } from 'draft-js'
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
				align='end'
				{...flexProps}>
				<Text
					mr={8}
					pb={2}
					variant='v2_subheading'
					w='calc(30% - 32px)'
					fontWeight='500'
					textAlign='right'>
					{label}
				</Text>
				<Flex w='70%'>
					<TextEditor
						value={editorState}
						onChange={setEditorState}
						placeholder='What are you building? What’s on your roadmap? When do you expect to complete it by' />
				</Flex>
			</Flex>
		)
	}

	return buildComponent()
}

export default SectionRichTextEditor