import { Button, Flex, Text } from '@chakra-ui/react'

const ZeroState = ({
	grantData
}: {
	grantData: any
}) => {
	return (
		<Flex
			h='calc(100vh - 352px)'
			justifyContent='center'
			alignItems='center'
			flexDirection='column'
		>
			<Text
				fontSize='20px'
				lineHeight='24px'
				fontWeight='500'
				textAlign='center'
			>
				No Applicants yet
			</Text>
			<Text
				mt={2}
				mb={4}
				fontSize='14px'
				lineHeight='20px'
				fontWeight='400'
				textAlign='center'
				color='#7D7DA0'
				maxW='754px'
			>
				{
					(grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ?
						'' :
						'In the meantime, you can set up applicant evaluation - define a scoring rubric and assign reviewers to evaluate the applicants.'

				}
			</Text>

			<Button
				colorScheme='brandv2'
				fontSize='14px'
				h={9}
			>
				{(grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ? 'View scoring rubric' : 'Setup applicant evaluation'}

			</Button>
		</Flex>
	)
}

export default ZeroState