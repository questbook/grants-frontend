import { useContext, useMemo, useState } from 'react'
import { Box, Button, Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, Textarea } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import QuickReplyButton from 'src/screens/dashboard/_components/QuickReplyButton'
import useAddComments from 'src/screens/dashboard/_hooks/useAddComments'
import useProposalTags from 'src/screens/dashboard/_hooks/useQuickReplies'
import { DashboardContext, SendAnUpdateContext } from 'src/screens/dashboard/Context'

function SendAnUpdateModal() {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isModalOpen}
				onClose={
					() => {
						setIsModalOpen(false)
					}
				}
				size='2xl'
				isCentered
				scrollBehavior='outside'>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<Flex
						p={6}
						direction='column'>
						<Text
							w='100%'
							fontWeight='500'
							textAlign='center'>
							Send an update
						</Text>
						{
							proposalTags?.length > 0 && (
								<Text
									mt={6}
									variant='v2_metadata'
									fontWeight='500'
									color='gray.6'>
									FEW WAYS TO START THE DISCUSSION.
								</Text>
							)
						}
						{
							proposalTags?.length > 0 && (
								<Flex
									mt={2}
									gap={3}>
									{
										proposalTags?.map((tag, index) => {
											return (
												<QuickReplyButton
													key={index}
													tag={tag}
													selectedTags={selectedTags}
													onClick={
														() => {
															const tags = { ...selectedTags }
															logger.info('tags: ', tags)
															if(tags[index]) {
																delete tags[index]
															} else {
																tags[index] = true
															}

															setSelectedTags(tags)
														}
													}
													index={index} />
											)
										})
									}
								</Flex>
							)
						}
						<Box mt={4} />
						<Textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder='Add a comment here' />

						<Button
							mt={8}
							w='100%'
							variant='primaryLarge'
							isDisabled={isDisabled}
							isLoading={networkTransactionModalStep !== undefined}
							onClick={
								async() => {
									// TODO: Make batch comments private or public
									const ret = await addComments(text, tags, false)
									if(ret) {
										setIsModalOpen(false)
										setText('')
										setSelectedTags
									}
								}
							}>
							Post
						</Button>
					</Flex>
				</ModalContent>
			</Modal>
		)
	}

	const { selectedProposals, proposals } = useContext(DashboardContext)!
	const { isModalOpen, setIsModalOpen } = useContext(SendAnUpdateContext)!
	const { proposalTags } = useProposalTags({ proposals: proposals.filter(p => selectedProposals.has(p.id)) })
	const [ text, setText ] = useState<string>('')

	const [ selectedTags, setSelectedTags ] = useState<{[key: number]: boolean}>({})

	const tags = useMemo(() => {
		return Object.keys(selectedTags).map((key) => parseInt(key, 10))
	}, [selectedTags])

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [, setTransactionHash] = useState<string>('')

	const { addComments, isBiconomyInitialised } = useAddComments({ setStep: setNetworkTransactionModalStep, setTransactionHash })

	const isDisabled = useMemo(() => {
		if(!isBiconomyInitialised) {
			return true
		}

		return text === ''
	}, [text, networkTransactionModalStep, isBiconomyInitialised])

	return buildComponent()
}

export default SendAnUpdateModal