import { Box, Flex, Text } from '@chakra-ui/react'
import { EditorState } from 'draft-js'
import RichTextEditor from 'src/components/ui/formsV2/richTextEditor'

function ReviewGrantDetails({
	details,
	setDetails,
	detailsError,
	setDetailsError, }) {
	return (
		<Flex
			direction="column"
			bg={'white'}
			paddingTop={'28px'}
			paddingBottom={'28px'}
			paddingLeft={'32px'}
			paddingRight={'32px'}
			borderRadius={'4px'}>
			<Box>
				<Text
					fontSize={'20px'}
					fontWeight={'500'}
					marginBottom={'8px'}>
					Grant requisites & evaluation process
				</Text>
				<Text
					fontSize={'14px'}
					fontWeight={'400'}
					color={'#7D7DA0'}
					marginBottom={'10px'}>
					Explain the grant requirements, best practices while submitting the application, and FAQs.
				</Text>
			</Box>
			<RichTextEditor
				placeholder="Start typing here.."
				value={details}
				isError={detailsError}
				onChange={
					(e: EditorState) => {
						if(detailsError) {
							setDetailsError(false)
						}

						setDetails(e)
					}
				}
				errorText="Required"
				maxLength={-1}
				disabled={true}
			/>
		</Flex>
	)
}

export default ReviewGrantDetails