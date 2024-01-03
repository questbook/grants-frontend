import { useContext, useMemo, useState } from 'react'
import { Box, Button, Checkbox, Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, Textarea } from '@chakra-ui/react'
import QuickReplyButton from 'src/screens/dashboard/_components/QuickReplyButton'
import useAddComments from 'src/screens/dashboard/_hooks/useAddComments'
import useProposalTags from 'src/screens/dashboard/_hooks/useQuickReplies'
import { DashboardContext, ModalContext } from 'src/screens/dashboard/Context'

function SendAnUpdateModal() {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isSendAnUpdateModalOpen}
				onClose={
					() => {
						setIsSendAnUpdateModalOpen(false)
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
									variant='metadata'
									fontWeight='500'
									color='gray.600'>
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
													id={tag.id as 'accept' | 'reject' | 'resubmit' | 'feedback'}
													key={index}
													tag={tag}
													isSelected={selectedTag === tag.id}
													onClick={
														() => {
															if(selectedTag) {
																setSelectedTag(undefined)
															} else {
																setSelectedTag(tag.id)
															}
														}
													}
													isDisabled={selectedTag !== undefined && selectedTag !== tag.id}
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

						<Checkbox
							mt={4}
							isChecked={isCommentPrivate}
							onChange={
								(e) => {
									setSelectedTag(undefined)
									setIsCommentPrivate(e.target.checked)
								}
							}>
							<Text
								variant='body'
								color='gray.500'>
								Show only to reviewers and builder
							</Text>
						</Checkbox>

						<Button
							mt={8}
							w='100%'
							variant='primaryLarge'
							isDisabled={isDisabled}
							isLoading={networkTransactionModalStep !== undefined}
							onClick={
								async() => {
									// TODO: Make batch comments private or public
									const ret = await addComments(text, isCommentPrivate, selectedTag)
									if(ret) {
										setIsSendAnUpdateModalOpen(false)
										setText('')
										setSelectedTag(undefined)
										refreshComments(true)
										refreshProposals(true)
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

	const { selectedProposals, proposals, refreshComments, refreshProposals } = useContext(DashboardContext)!
	const { isSendAnUpdateModalOpen, setIsSendAnUpdateModalOpen } = useContext(ModalContext)!
	const { proposalTags } = useProposalTags({ proposals: proposals.filter(p => selectedProposals.has(p.id)) })
	const [ text, setText ] = useState<string>('')

	const [ selectedTag, setSelectedTag ] = useState<string>()
	const [ isCommentPrivate, setIsCommentPrivate ] = useState<boolean>(false)

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [, setTransactionHash] = useState<string>('')

	const { addComments } = useAddComments({ setStep: setNetworkTransactionModalStep, setTransactionHash })

	const isDisabled = useMemo(() => {

		return text === ''
	}, [text, networkTransactionModalStep])

	return buildComponent()
}

export default SendAnUpdateModal