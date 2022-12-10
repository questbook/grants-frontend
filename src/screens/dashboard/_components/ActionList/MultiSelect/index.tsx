import { useContext } from 'react'
import { Button, Divider, Flex, Text } from '@chakra-ui/react'
import { FundBuilderContext } from 'src/screens/dashboard/Context'

function MultiSelect() {
	const buildComponent = () => {
		return (
			<Flex
				px={5}
				py={4}
				direction='column'>
				<Text fontWeight='500'>
					Batch actions
				</Text>
				<Button
					w='100%'
					variant='primaryMedium'
					bg='gray.3'
					mt={4}>
					<Text
						variant='v2_body'
						fontWeight='500'>
						Send an update to selected builders
					</Text>
				</Button>
				<Flex
					align='center'
					my={4}>
					<Divider />
					<Text
						mx={3}
						variant='v2_body'
						fontWeight='500'
						color='gray.5'>
						OR
					</Text>
					<Divider />
				</Flex>
				<Button
					w='100%'
					variant='primaryMedium'
					onClick={
						() => {
							setIsDrawerOpen(true)
						}
					}>
					<Text
						variant='v2_body'
						fontWeight='500'
						color='white'>
						Payout selected builders
					</Text>
				</Button>
			</Flex>
		)
	}

	const { setIsDrawerOpen } = useContext(FundBuilderContext)!


	return buildComponent()
}

export default MultiSelect