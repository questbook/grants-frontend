import { useContext } from 'react'
import { Box, Button, Divider, Flex } from '@chakra-ui/react'
import Milestones from 'src/screens/dashboard/_components/ActionList/SingleSelect/Milestones'
import Payouts from 'src/screens/dashboard/_components/ActionList/SingleSelect/Payouts'
import Reviews from 'src/screens/dashboard/_components/ActionList/SingleSelect/Reviews'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'

function SingleSelect() {
	const buildComponent = () => {
		return (
			<Flex
				h='100%'
				direction='column'>
				<Reviews />
				<Divider />
				<Milestones />
				<Divider />
				<Payouts />
				<Box mt='auto' />
				<Divider />
				<Flex
					px={5}
					py={4}>
					<Button
						disabled={proposals?.length === 0}
						w='100%'
						variant='primaryMedium'
						onClick={
							() => {
								setIsModalOpen(true)
							}
						}>
						Fund builder
					</Button>
				</Flex>
			</Flex>
		)
	}

	const { setIsModalOpen } = useContext(FundBuilderContext)!
	const { proposals } = useContext(DashboardContext)!

	return buildComponent()
}

export default SingleSelect