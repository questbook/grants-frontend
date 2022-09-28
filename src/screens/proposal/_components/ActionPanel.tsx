import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { ApplicationState } from 'src/generated/graphql'
import SideItem from 'src/screens/proposal/_components/SideItem'

interface Props {
    state: ApplicationState
}

function ActionPanel({ state }: Props) {
	const buildComponent = () => {
		if(state === 'submitted') {
			return (
				<Flex w='100%'>
					<Button
						borderRadius='2px'
						bg='violet.1'
						onClick={() => {}}>
						<Text
							color='violet.2'
							variant='v2_body'
							fontWeight='500'>
							Accept Proposal
						</Text>
					</Button>
					<Box mx={2} />
					<Button
						bg='orange.1'
						borderRadius='2px'>
						<Text
							color='orange.2'
							variant='v2_body'
							fontWeight='500'>
							Reject Proposal
						</Text>
					</Button>
				</Flex>
			)
		} else if(state === 'approved') {
			return (
				<Button
					borderRadius='2px'
					bg='violet.2'
					onClick={() => {}}>
					<Text
						color='white'
						variant='v2_body'
						fontWeight='500'>
						Send Funds
					</Text>
				</Button>
			)
		} else {
			return (
				<SideItem
					title='REASON FOR REJECTION'
					sideText='24 JAN'
					description='Reason for rejection goes here' />
			)
		}
	}

	return buildComponent()
}

export default ActionPanel