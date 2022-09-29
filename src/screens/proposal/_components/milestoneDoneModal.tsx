import React from 'react'
import { useTranslation } from 'react-i18next'
import {
    Button,
    Container,
    Flex,
    Modal as ModalComponent,
    ModalContent,
    ModalOverlay,
    Text,
    Input
} from '@chakra-ui/react'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { FundsCircle } from 'src/v2/assets/custom chakra icons/Your Grants/FundsCircle'


interface Props {
    isOpen: boolean
    onClose: () => void
}


function SendFundsModal({
    isOpen,
    onClose,
}: Props) {
    const { t } = useTranslation()

    const buildModalContent = () =>
    (
        <>
            <ModalComponent
                isCentered
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={false}
            >
                <ModalOverlay maxH='100vh' />
                <ModalContent
                    minW={528}
                    overflowY='auto'
                    borderRadius='4px'>
                    <Container
                        px={6}
                        py={4}>

                        <Flex
                            direction='row'
                            align='center'
                            gap={2}>

                            {/* Modal Icon */}
                            <Flex
                                bg='#D1D7F4'
                                h='48px'
                                w='48px'
                                borderRadius='2px'
                                alignItems='center'
                                justifyContent='center'
                            >
                                <FundsCircle
                                    color='#036AFF'
                                    h='28px'
                                    w='28px' />
                            </Flex>

                            {/* Modal Heading and sub heading */}
                            <Flex
                                flexDirection='column'>
                                <Text
                                    fontSize='20px'
                                    lineHeight='24px'
                                    fontWeight='500'
                                >
                                    {t('view_proposal/proposal.mark_milestone_as_done_modal_heading')}
                                </Text>
                                <Text
                                    fontSize='14px'
                                    lineHeight='20px'
                                    fontWeight='400'
                                    mt={1}
                                    color='#7D7DA0'
                                >
                                    {t('view_proposal/proposal.mark_milestone_as_done_modal_subheading')}
                                </Text>
                            </Flex>

                            <CancelCircleFilled
                                mb='auto'
                                color='#7D7DA0'
                                h={6}
                                w={6}
                                onClick={onClose}
                                cursor='pointer'
                            />
                        </Flex>

                        <Flex
                            bg='#F0F0F7'
                            h='1px'
                            mx='-24px'
                            my={4}
                        />

                        <Flex direction='column'
                            padding={4}
                            gap={2}
                            borderRadius='2px'
                            boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
                            <Text fontSize='14px'
                                lineHeight='20px'
                                fontWeight='500'>Comments</Text>
                            <Text fontSize='12px'
                                lineHeight='16px'
                                fontWeight='500'
                                color='#7D7DA0'>Feedback on completion of this milestone.</Text>
                            <Input
                                variant='brandFlushed'
                                placeholder='Type your feedback'
                                _placeholder={
                                    {
                                        color: 'blue.100',
                                        fontWeight: '500'
                                    }
                                }
                                mt={2}></Input>
                        </Flex>

                        <Flex
                            mt={4}
                            direction='row'
                            align='center'>
                            <Button
                                ml='auto'
                                colorScheme='brandv2'
                                onClick={() => {
                                    handleMilestoneMarkedAsDone()
                                }

                                }>
                                Mark as done
                            </Button>
                        </Flex>
                    </Container>
                </ModalContent>
            </ModalComponent>
        </>
    )

    const handleMilestoneMarkedAsDone = () => {

    }

    return buildModalContent()
}


export default SendFundsModal
