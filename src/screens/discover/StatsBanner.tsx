import { Flex, Text } from '@chakra-ui/react'

function StatsBanner() {
	const buildComponent = () => {
		return (
			<Flex
				bgColor='gray.2'
				padding={[3, 8]}
				gap={4}
				justifyContent='space-evenly'>
				<Flex
					flexDirection='column'
					alignItems='center'>
					<Text
						fontWeight='500'
						fontSize={['25px', '40px']}
						lineHeight='48px'>
						20000+
					</Text>
					<Text
						fontWeight='500'
						fontSize='15px'
						lineHeight='22px'
						textTransform='uppercase'>
						Builders
					</Text>
				</Flex>
				<Flex
					flexDirection='column'
					alignItems='center'>
					<Text
						fontWeight='500'
						fontSize={['25px', '40px']}
						lineHeight='48px'>
						$2m+
					</Text>
					<Text
						fontWeight='500'
						fontSize='15px'
						lineHeight='22px'
						textTransform='uppercase'>
						Paid Out
					</Text>
				</Flex>
				<Flex
					flexDirection='column'
					alignItems='center'>
					<Text
						fontWeight='500'
						fontSize={['25px', '40px']}
						lineHeight='48px'>
						1000+
					</Text>
					<Text
						fontWeight='500'
						fontSize='15px'
						lineHeight='22px'
						textTransform='uppercase'>
						Proposals
					</Text>
				</Flex>
			</Flex>
		)
	}

	return buildComponent()
}

export default StatsBanner