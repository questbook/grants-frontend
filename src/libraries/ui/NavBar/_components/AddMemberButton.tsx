import { Button, Image, Text } from '@chakra-ui/react'

function AddMemberButton() {
	const buildComponent = () => {
		return (
			<Button
				variant='ghost'
				leftIcon={
					<Image
						src='/v2/icons/add user.svg'
						boxSize='16px' />
				}>
				<Text
					variant='v2_body'
					fontWeight='500'>
					Add Members
				</Text>
			</Button>
		)
	}

	return buildComponent()
}

export default AddMemberButton