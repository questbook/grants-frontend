import { Button, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function SubmitANewProposal() {
	const buildComponent = () => {
		return (
			<Button
				ml={4}
				variant='ghost'
				leftIcon={
					<Image
						src='/v2/icons/discover.svg'
						boxSize='16px' />
				}
				onClick={
					() => {
						router.push({
							pathname: '/'
						})
					}
				}>
				<Text
					variant='v2_body'
					fontWeight='500'>
					Submit a new proposal
				</Text>
			</Button>
		)
	}

	const router = useRouter()

	return buildComponent()
}

export default SubmitANewProposal