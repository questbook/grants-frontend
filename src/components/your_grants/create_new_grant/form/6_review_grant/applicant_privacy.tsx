import { Box, Flex, Text } from '@chakra-ui/react'
import CustomSwitch from 'src/components/ui/formsV2/customSwitch'

function ReviewApplicantPrivacy({ shouldEncrypt, setShouldEncrypt }) {
	return (
		<Flex
			py={0}
			direction="column"
			bg={'white'}
			paddingTop={'28px'}
			paddingBottom={'28px'}
			paddingLeft={'32px'}
			paddingRight={'32px'}
			borderRadius={'4px'} >

			<Box>
				<Text
					fontSize={'20px'}
					fontWeight={'500'}
					marginBottom={'8px'}>
					Privacy Check
				</Text>
				<Text
					fontSize={'14px'}
					fontWeight={'400'}
					color={'#7D7DA0'}
					marginBottom={'20px'}>
					Contol who can see personal applicant data (email and about team)
				</Text>
			</Box>

			<Box
				display={'flex'}
				flexDirection='row'
				mb={'26px'}
				alignItems="center">
				<Box>
					<Text fontSize={'16px'}>
					Hide applicant personal info
					</Text>
					<Text
						fontSize={'12px'}
						color='#7D7DA0'>
					Visible to only DAO administrators and reviewers
					</Text>
				</Box>
				<Box marginLeft={'auto'}>
					<CustomSwitch
						isChecked={shouldEncrypt}
						onChange={
							(checked) => {
								setShouldEncrypt(checked)
							}
						} />
				</Box>
			</Box>
		</Flex>
	)
}

export default ReviewApplicantPrivacy