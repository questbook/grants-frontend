import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text, Image, Input, Divider } from "@chakra-ui/react";
import { useState } from "react";
import TextField from "src/v2/components/InputFields/TextField";
import { UpdateApplicationStateData } from "../_types";

interface Props {
    isOpen: boolean;
    isRejectProposalClicked: boolean;
    networkTransactionModalStep: number;
    updateApplicationStateData: UpdateApplicationStateData;
    setIsRejectProposalClicked: (value: boolean) => void;
    setIsConfirmClicked: (isConfirmClicked: boolean) => void;
    setIsRejectProposalModalOpen: (isRejectProposalModalOpen: boolean) => void;
    setUpdateApplicationStateData: (updateApplicationStateData: UpdateApplicationStateData) => void;
}

function RejectProposalModal({
    isOpen,
    isRejectProposalClicked,
    networkTransactionModalStep,
    updateApplicationStateData,
    setIsRejectProposalClicked,
    setIsConfirmClicked,
    setIsRejectProposalModalOpen,
    setUpdateApplicationStateData }: Props) {

        const [comment, setComment] = useState(updateApplicationStateData.comment);

    return (
        <Modal
            isCentered
            isOpen={isOpen && networkTransactionModalStep === undefined}
            onClose={
                () => {
                    setIsRejectProposalClicked(false)
                    setIsRejectProposalModalOpen(false)
                }
            }
            closeOnOverlayClick={false}
        >
            <ModalOverlay maxH='100vh' />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody padding={8}>

                    <Flex flexDirection='column' gap={8} alignItems='center'>
                        <Flex flexDirection='column' gap={4} alignItems='center'>
                            <Image
                                boxSize={16}
                                src='/ui_icons/reject_proposal_icon.svg' />
                            <Text
                                fontWeight={500}
                                fontSize='20px'
                                lineHeight='24px'>Reject Proposal</Text>
                        </Flex>

                        {/* <Flex
                            bg='#F0F0F7'
                            h='1px'
                            mx='-24px'
                            my={4}
                        /> */}
                        <Flex flexDirection='column' gap={4} alignItems='center'>
                            <Divider />
                            <Text
                                fontWeight='400'
                                fontSize='14px'
                                lineHeight='20px'
                                color='#555570'>
                                This will notify selected applicants that their applications have been
                                {' '}
                                {isRejectProposalClicked ? 'rejected' : ''}
                                . This action cannot be undone.
                            </Text>
                            <Input
                                variant='brandFlushed'
                                placeholder="Type your reason for rejection"
                                value={comment}
                                onChange={
                                    (e) => {
                                        console.log('Comment for rejection', { ...updateApplicationStateData, comment: e.target.value })
                                        setComment(e.target.value);
                                    }
                                } />

                        </Flex>



                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant='ghost'
                        mr={3}
                        onClick={
                            () => {
                                setIsConfirmClicked(false)
                                setIsRejectProposalClicked(false)
                                setIsRejectProposalModalOpen(false)
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
                                setIsRejectProposalModalOpen(false)
                                setUpdateApplicationStateData({ ...updateApplicationStateData, comment })
                            }
                        }>
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}

export default RejectProposalModal