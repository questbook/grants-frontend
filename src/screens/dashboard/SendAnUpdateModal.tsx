import { useContext } from 'react'
import { Button, Flex, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, Textarea } from '@chakra-ui/react'
import useQuickReplies from 'src/screens/dashboard/_hooks/useQuickReplies'
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
						<Text
							mt={6}
							variant='v2_metadata'
							fontWeight='500'
							color='gray.6'>
							FEW WAYS TO START THE DISCUSSION.
						</Text>
						<Flex
							direction='column'
						>
							{
								Array.from(Array(Math.floor(quickReplies[role].length / 2)).keys()).map((_, index) => {
									const reply1 = quickReplies[role]?.[index * 2]
									const reply2 = quickReplies[role]?.[index * 2 + 1]
									return (
										<Flex
											key={index}
											mt={3}>
											{
												reply1 && (
													<Button
														key={index}
														// w='100%'
														justifyContent='start'
														py={1}
														px={3}
														bg='gray.2'
														borderRadius='2px'
														leftIcon={
															<Image
																boxSize='24px'
																src={reply1.icon} />
														}
													>
														<Text fontWeight='400'>
															{reply1.title}
														</Text>
													</Button>
												)
											}
											{
												reply2 && (
													<Button
														key={index + 1}
														ml={3}
														// w='100%'
														justifyContent='start'
														py={1}
														px={3}
														bg='gray.2'
														borderRadius='2px'
														leftIcon={
															<Image
																boxSize='24px'
																src={reply2.icon} />
														}
													>
														<Text fontWeight='400'>
															{reply2.title}
														</Text>
													</Button>
												)
											}
										</Flex>
									)
								})
							}
						</Flex>
						<Textarea
							w='100%'
							mt={6}
							textAlign='left'
							placeholder='Ask a question or post an update'
							fontSize='16px'
							fontWeight='400'
							lineHeight='24px'
							size='sm'
							resize='none'
						/>

						<Button
							mt={8}
							w='100%'
							variant='primaryLarge'>
							Post
						</Button>
					</Flex>
				</ModalContent>
			</Modal>
		)
	}

	const { isModalOpen, setIsModalOpen } = useContext(SendAnUpdateContext)!
	const { role } = useContext(DashboardContext)!
	const { quickReplies } = useQuickReplies()

	return buildComponent()
}

export default SendAnUpdateModal