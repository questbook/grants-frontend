import { useContext } from 'react'
import { Button, Divider, Flex, Text } from '@chakra-ui/react'
import { GrantProgramContext } from 'src/contexts/GrantProgramContext'
import { useSafeContext } from 'src/contexts/SafeContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { FundBuilderContext, ModalContext } from 'src/screens/dashboard/Context'

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
					mt={4}
					isDisabled={role !== 'admin'}
					onClick={
						() => {
							setIsSendAnUpdateModalOpen(true)
						}
					}>
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
					isDisabled={role !== 'admin'}
					onClick={
						() => {
							if(safeObj) {
								setIsDrawerOpen(true)
							} else {
								customToast({
									title: 'No multi sig connected for batched payout',
									status: 'error',
									duration: 3000,
								})
							}
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

	const { role } = useContext(GrantProgramContext)!
	const { setIsDrawerOpen } = useContext(FundBuilderContext)!
	const { setIsSendAnUpdateModalOpen } = useContext(ModalContext)!
	const { safeObj } = useSafeContext()
	const customToast = useCustomToast()

	return buildComponent()
}

export default MultiSelect