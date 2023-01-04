import { useContext, useMemo, useState } from 'react'
import { Button, Flex, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { convertToRaw, EditorState } from 'draft-js'
import logger from 'src/libraries/logger'
import TextEditor from 'src/libraries/ui/RichTextEditor/textEditor'
import useAddComments from 'src/screens/dashboard/_hooks/useAddComments'
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
											{reply1 && tagButton(reply1.icon, reply1.title, index * 2)}
											{reply2 && tagButton(reply2.icon, reply2.title, index * 2 + 1)}
										</Flex>
									)
								})
							}
						</Flex>
						<TextEditor
							value={text}
							onChange={setText}
							placeholder='Add a comment here' />

						<Button
							mt={8}
							w='100%'
							variant='primaryLarge'
							isDisabled={isDisabled}
							onClick={
								async() => {
									await addComments(text, tags)
								}
							}>
							Post
						</Button>
					</Flex>
				</ModalContent>
			</Modal>
		)
	}

	const tagButton = (icon: string, title: string, index: number) => {
		return (
			<Button
				key={index}
				ml={3}
				// w='100%'
				justifyContent='start'
				py={1}
				px={3}
				borderRadius='2px'
				leftIcon={
					<Image
						boxSize='24px'
						src={icon} />
				}
				bg={index in selectedTags ? 'accent.azure' : 'gray.2'}
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
			>
				<Text
					fontWeight='400'
					color={index in selectedTags ? 'white' : 'black.1'}>
					{title}
				</Text>
			</Button>
		)
	}

	const { isModalOpen, setIsModalOpen } = useContext(SendAnUpdateContext)!
	const { role } = useContext(DashboardContext)!
	const { quickReplies } = useQuickReplies()
	const [ text, setText ] = useState<EditorState>(EditorState.createEmpty())

	const [ selectedTags, setSelectedTags ] = useState<{[key: number]: boolean}>({})

	const tags = useMemo(() => {
		return Object.keys(selectedTags).map((key) => parseInt(key, 10))
	}, [selectedTags])

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [, setTransactionHash] = useState<string>('')

	const { addComments, isBiconomyInitialised } = useAddComments({ setStep: setNetworkTransactionModalStep, setTransactionHash })

	const isDisabled = useMemo(() => {
		if(!isBiconomyInitialised || networkTransactionModalStep !== undefined) {
			return true
		}

		const raw = convertToRaw(text.getCurrentContent())
		return raw.blocks.some((block) => block.text.length > 0)
	}, [text, networkTransactionModalStep])

	return buildComponent()
}

export default SendAnUpdateModal