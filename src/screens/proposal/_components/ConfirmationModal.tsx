import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text } from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    isAcceptProposalClicked: boolean;
    isRejectProposalClicked: boolean;
    isResubmitClicked?: boolean;
    networkTransactionModalStep: number;
    setIsAcceptProposalClicked: (value: boolean) => void;
    setIsConfirmationModalOpen: (isOpen: boolean) => void;
    setIsRejectProposalClicked: (value: boolean) => void;
    setIsConfirmClicked: (isConfirmClicked: boolean) => void;
}

function ConfirmationModal({
    isOpen,
    isAcceptProposalClicked,
    isRejectProposalClicked,
    networkTransactionModalStep,
    setIsAcceptProposalClicked,
    setIsConfirmationModalOpen,
    setIsRejectProposalClicked,
    setIsConfirmClicked,
    isResubmitClicked=false
}: Props) {
  return (
    <Modal
				isCentered
				isOpen={isOpen && networkTransactionModalStep === undefined}
				onClose={
					() => {
						setIsAcceptProposalClicked(false)
						// setIsRejectClicked(false)
						// setIsResubmitClicked(false)
						// setCheckedItems(Array(checkedItems.length).fill(false))
						setIsConfirmationModalOpen(false)
					}
				}
				closeOnOverlayClick={false}
			>
				<ModalOverlay maxH='100vh' />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>

						<Text
							fontWeight='500'
							fontSize='20px'
							lineHeight='24px'
							color='#1F1F33'
						>
							{isAcceptProposalClicked ? 'Accept selected applicants' : isResubmitClicked ? 'Resubmit selected applicants' : 'Reject selected applicants'}
						</Text>
						<Text
							fontWeight='400'
							fontSize='14px'
							lineHeight='20px'
							color='#7D7DA0'>
							This will notify selected applicants that their applications have been
							{' '}
							{isAcceptProposalClicked ? 'accepted' : isResubmitClicked ? 'asked to resubmit' : 'rejected'}
							. This action cannot be undone.
						</Text>

						<Text
							fontWeight='400'
							fontSize='16px'
							lineHeight='24px'
							color='#1F1F33'>
							Are you sure you want to do this?
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button
							variant='ghost'
							mr={3}
							onClick={
								() => {
									setIsAcceptProposalClicked(false)
									setIsRejectProposalClicked(false)
									// setIsResubmitClicked(false)
									// setCheckedItems(Array(checkedItems.length).fill(false))
									setIsConfirmationModalOpen(false)
								}
							}>
							Cancel
						</Button>
						<Button
							// colorScheme={isAcceptProposalClicked ? 'blue' : 'pink'}
							mr={3}
							onClick={
								() => {
									setIsConfirmClicked(true)
                                    setIsConfirmationModalOpen(false)
								}
							}>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

  );
}

export default ConfirmationModal;