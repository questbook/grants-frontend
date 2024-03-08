import { Flex, Text } from '@chakra-ui/react'

function StatsBanner() {
	const buildComponent = () => {
		return (
			<Flex
				bgColor='#F7F5F2'
				padding='32px 48px'
				gap='20px'
				textAlign='center'
				alignItems='center'
				flexDirection='column'
				borderRadius='0px 0px 48px 48px'
				justifyContent='center'>
				<Text
					color='#07070C'
					fontSize='48px'
					fontStyle='normal'
					fontWeight='700'
					lineHeight='130%'

				>
					Grantee List
				</Text>
				{/* <Text
					color='#7E7E8F'
					fontSize='18px'
					fontStyle='normal'
					fontWeight='500'
					lineHeight='normal'
				>
					Here is a list of apps, tools, and events funded by Questbook and its partners, like Arbitrum Grants Program. This list will be updated as grants are funded.
				</Text> */}
			</Flex>
		)
	}

	return buildComponent()
}

export default StatsBanner