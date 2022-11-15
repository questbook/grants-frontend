import { Button, Text } from '@chakra-ui/react'

function AddMemberButton() {
	const buildComponent = () => {
		return (
			<Button variant='ghost'>
				<Text>
					Add Member
				</Text>
			</Button>
		)
	}

	return buildComponent()
}

export default AddMemberButton