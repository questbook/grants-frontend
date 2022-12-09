import { Flex, Text } from '@chakra-ui/react'

function MilestoneChoose() {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'>
				<Text
					w='20%'
					color='gray.6'>
					Milestones
				</Text>
			</Flex>
		)
	}

	return buildComponent()
}

export default MilestoneChoose