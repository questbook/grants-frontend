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
				<Text
					color='#7E7E8F'
					fontSize='18px'
					fontStyle='normal'
					fontWeight='500'
					lineHeight='normal'
				>
					These are all the grantees that have received grants via Questbook from different ecosystems including, Arbitrum, Ton, Compound and more
				</Text>
			</Flex>
		)
	}

	return buildComponent()
}

export default StatsBanner