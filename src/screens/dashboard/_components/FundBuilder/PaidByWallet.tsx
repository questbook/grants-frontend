import { Flex, Text } from '@chakra-ui/react'

const PaidByWallet = () => {
	const buildComponent = () => (
		<Flex
			p={6}
			direction='column'
			align='center'
			w='100%'>
			<Text fontWeight='500'>
				Fund Builder
			</Text>

			<Flex
				direction='column'
				borderTopWidth='1px'
				borderBottomWidth='1px'
				borderTopColor='#F0F0F7'
				borderBottomColor='#F0F0F7'
				w='100%'
				mt='2rem'
				py='1rem'
				alignItems='center'>

				<Text
					fontSize='16px'
					mb='1rem'>
					Payouts done to the applicant through Keplr Wallet
				</Text>
			</Flex>

		</Flex>
	)

	return buildComponent()
}

export default PaidByWallet