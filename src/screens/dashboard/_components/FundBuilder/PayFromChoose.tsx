import { Flex, Image, Text } from '@chakra-ui/react'

function PayFromChoose({ selectedMode }: { selectedMode: {logo: string | undefined, value: string | undefined} | undefined}) {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'
				alignItems='center'>
				<Text
					w='20%'
					color='gray.600'>
					Pay From
				</Text>
				<Flex
					alignItems='center'
					overflowX='auto'>
					<Image
						src='/v2/icons/starknet.svg'
						boxSize='16px' />
					<Text
						ml={2}
						variant='body'
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