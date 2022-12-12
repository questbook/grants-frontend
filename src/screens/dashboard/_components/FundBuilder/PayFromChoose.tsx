import { Flex, Text } from '@chakra-ui/react'
import { useSafeContext } from 'src/contexts/safeContext'
// import { formatAddress } from 'src/utils/formattingUtils'

function PayFromChoose() {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'>
				<Text
					w='20%'
					color='gray.6'>
					Pay From
				</Text>
				<Flex>
					{/* <Image src='/' /> */}
					<Text>
						{safeObj?.safeAddress ?? ''}
					</Text>
				</Flex>
			</Flex>
		)
	}

	const { safeObj } = useSafeContext()

	return buildComponent()
}

export default PayFromChoose