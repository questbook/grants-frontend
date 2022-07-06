import { Box, Flex, Text } from '@chakra-ui/react'
import SingleLineInput from 'src/components/ui/formsV2/singleLineInput'

function ReviewGrantTitle({
	title,
	setTitle,
	titleError,
	setTitleError, }) {
	return (
		<Flex
			direction="column"
			w="100%"
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
					Grant Title
				</Text>
				<Text
					fontSize={'14px'}
					fontWeight={'400'}
					color={'#7D7DA0'}
					marginBottom={'10px'}>
					Title is shown to the applicants on our homepage.
				</Text>
			</Box>
			<SingleLineInput
				value={title}
				onChange={
					(e) => {
						setTitleError(false)
						setTitle(e.target.value)
					}
				}
				placeholder="Type a brief title"
				isError={titleError}
				errorText="Required"
				maxLength={300}
			/>

		</Flex>
	)
}

export default ReviewGrantTitle