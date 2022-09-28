import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { ActionPanelType } from 'src/screens/proposal/_types'

function ActionPanel({ state, rejectionDate, rejectionReason, onAcceptClick, onRejectClick, onSendFundClick }: ActionPanelType) {
	const buildComponent = () => {
		if(state === 'submitted') {
			return (
				<Flex w='100%'>
					<Button
						w='100%'
						borderRadius='2px'
						bg='violet.1'
						onClick={onAcceptClick}>
						<Text
							color='violet.2'
							variant='v2_body'
							fontWeight='500'>
							Accept Proposal
						</Text>
					</Button>
					<Box mx={2} />
					<Button
						w='100%'
						bg='orange.1'
						borderRadius='2px'
						onClick={onRejectClick}>
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
					onClick={onSendFundClick}>
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
				<Flex
					direction='column'
					bg='white'
					px={5}
					py={3}
				>
					<Flex align='center'>
						<Text
							color='black.3'
							variant='v2_metadata'
							fontWeight='500'>
							REASON FOR REJECTION
						</Text>
						<Image
							mx={2}
							src='/ui_icons/ellipse.svg'
							boxSize='4px' />
						<Text
							color='black.3'
							variant='v2_metadata'
							fontWeight='500'>
							{rejectionDate}
						</Text>
					</Flex>
					<Text variant='v2_body'>
						{rejectionReason}
					</Text>
				</Flex>

			)
		}
	}

	return buildComponent()
}

export default ActionPanel