import { Box, Button, Divider, Flex } from '@chakra-ui/react'
import Milestones from 'src/screens/dashboard/_components/ActionListItems/SingleSelect/Milestones'
import Payouts from 'src/screens/dashboard/_components/ActionListItems/SingleSelect/Payouts'
import Reviews from 'src/screens/dashboard/_components/ActionListItems/SingleSelect/Reviews'

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
						w='100%'
						variant='primaryMedium'>
						Fund builders
					</Button>
				</Flex>
			</Flex>
		)
	}

	return buildComponent()
}

export default SingleSelect