import { useEffect, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'

interface Props {
    isOpen: boolean
    onClose: () => void
    type: 'accept' | 'resubmit' | 'reject'
	onCancelClick: () => void
	onConfirmClick: (comment?: string) => void
}

function CommentModal({ isOpen, onClose, type, onCancelClick, onConfirmClick }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isCentered={true}
				size='xl'
				isOpen={isOpen}
				onClose={
					() => {
						setFeedback('')
						onClose()
					}
				}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader>
						<Text
							textAlign='center'
							variant='v2_subheading'
							fontWeight='500'>
							{type === 'reject' ? 'Reject Proposals' : type === 'resubmit' ? 'Request for resubmission' : 'Accept proposals'}
						</Text>
					</ModalHeader>
					<ModalBody>
						<Flex
							direction='column'
							align='center'
							p={2}
						>
							<Text
								textAlign='center'
								variant='v2_body'>
								{type === 'reject' ? 'This will notify the applicant that their application has been rejected. This action cannot be undone.' : type === 'resubmit' ? 'This will notify the applicant to resubmit their application. This action cannot be undone.' : 'This will notify selected applicants that their application has been accepted. This action cannot be undone.'}
							</Text>
							{
								type !== 'accept' && (
									<TextField
										w='100%'
										mt={4}
										label='Feedback'
										helperText={type === 'reject' ? 'Applicants find it useful to understand the shortcomings' : 'Applicants find it helpful while resubmitting'}
										placeholder={type === 'reject' ? 'Reasons for rejection' : 'Points that can be improved'}
										value={feedback}
										maxLength={300}
										onChange={
											(e) => {
												setFeedback(e.target.value)
											}
										} />
								)
							}
							<Text
								mt={4}
								variant='v2_body'
								fontWeight='500'
								textAlign='center'>
								Are you sure you want to do this?
							</Text>
							<Flex
								w='100%'
								justify='end'
								mt={6}>
								<Button
									variant='link'
									color='black'
									onClick={onCancelClick}>
									Cancel
								</Button>
								<Button
									ml={4}
									variant='primaryV2'
									onClick={
										() => {
											onConfirmClick(feedback)
										}
									}>
									Confirm
								</Button>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>

			</Modal>
		)
	}

	const [feedback, setFeedback] = useState<string>('')

	return buildComponent()
}

export default CommentModal