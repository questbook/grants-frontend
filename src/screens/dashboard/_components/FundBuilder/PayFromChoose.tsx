import { Flex, Image, Text } from '@chakra-ui/react'

function PayFromChoose({ selectedMode }: { selectedMode: any}) {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'
				alignItems='center'>
				<Text
					w='20%'
					color='gray.6'>
					Pay From
				</Text>
				<Flex alignItems='center'>
					<Image
						src={selectedMode?.logo}
						boxSize='16px' />
					<Text
						ml={2}
						variant='v2_body'
					>
						{selectedMode?.value}
					</Text>
				</Flex>
			</Flex>
		)
	}

	return buildComponent()
}

export default PayFromChoose