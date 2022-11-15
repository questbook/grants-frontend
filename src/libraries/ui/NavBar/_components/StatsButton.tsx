import { Button, Text } from '@chakra-ui/react'

function StatsButton() {
	const buildComponent = () => {
		return (
			<Button variant='ghost'>
				<Text>
					Stats
				</Text>
			</Button>
		)
	}

	return buildComponent()
}

export default StatsButton