import { useContext, useEffect, useMemo, useState } from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Button, CircularProgress, Divider, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { convertToRaw, EditorState } from 'draft-js'
import logger from 'src/libraries/logger'
import TextEditor from 'src/libraries/ui/RichTextEditor/textEditor'
import TextViewer from 'src/libraries/ui/RichTextEditor/textViewer'
import { TXN_STEPS } from 'src/libraries/utils/constants'
import { ApiClientsContext } from 'src/pages/_app'
import useAddComment from 'src/screens/dashboard/_hooks/useAddComment'
import useGetComments from 'src/screens/dashboard/_hooks/useGetComments'
import useQuickReplies from 'src/screens/dashboard/_hooks/useQuickReplies'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { CommentType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress, getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

function Discussions() {
	const buildComponents = () => {
		return (
			<Flex
				px={5}
				py={4}
				w='100%'
				h='35%'
				overflowY='auto'
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				bg='white'
				direction='column'>
				<Text fontWeight='500'>
					Discussion
				</Text>
				<Flex
					mt={4}
					w='100%'>
					<Image
						src='/v2/images/qb-discussion.svg'
						boxSize='36px' />
					<Flex
						ml={4}
						direction='column'>
						<Text
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
					</Flex>
				</Flex>
				<Flex
					mt={4}
					w='100%'>
					<Image
						borderRadius='3xl'
						boxSize='36px'
						src={getAvatar(false, proposal?.applicantId)}
					/>
					<Flex
						ml={4}
						direction='column'
						w='100%'>
						<TextEditor
							value={text}
							onChange={setText}
							placeholder='Add a comment here' />
						<Flex
							mt={4}
							align='center'>
							{
								step !== undefined && (
									<Flex align='center'>
										{
											step < 3 && (
												<CircularProgress
													isIndeterminate
													color='black'
													size='18px' />
											)
										}
										<Text
											ml={2}
											variant='v2_body'>
											{[...TXN_STEPS, 'Refresh the page to view the update!'][step]}
										</Text>
										{
											transactionHash && (
												<IconButton
													ml={1}
													variant='ghost'
													icon={<ExternalLinkIcon />}
													aria-label='txn-link'
													onClick={
														() => {
															window.open(getExplorerUrlForTxHash(chainId, transactionHash), '_blank')
														}
													} />
											)
										}
									</Flex>
								)
							}
							<Button
								ml='auto'
								variant='primaryMedium'
								isDisabled={isDisabled}
								onClick={
									async() => {
										const ret = await addComment(text)
										if(ret) {
											setText(EditorState.createEmpty())
										}
									}
								}>
								Post
							</Button>
						</Flex>

					</Flex>
				</Flex>

				<Divider
					my={4}
					color='gray.3'
					height={1} />

				{comments.filter((comment) => comment.sender && (comment.workspace.members.some((member) => member.actorId.toLowerCase() === comment.sender?.toLowerCase()) || comment.sender?.toLowerCase() === proposal?.applicantId.toLowerCase())).map(renderComment)}
			</Flex>
		)
	}

	const renderComment = (comment: CommentType, index: number) => {
		const member = comment.workspace.members.find((member) => member.actorId.toLowerCase() === comment.sender?.toLowerCase())

		return (
			<Flex
				align='start'
				mt={index === 0 ? 0 : 4}>
				<Image
					borderRadius='3xl'
					boxSize='36px'
					src={(member?.profilePictureIpfsHash ? getUrlForIPFSHash(member?.profilePictureIpfsHash) : getAvatar(false, member ? member?.actorId : proposal?.applicantId))} />
				<Flex
					ml={3}
					direction='column'>
					<Flex align='center'>
						<Text fontWeight='500'>
							{member?.fullName ? member?.fullName : member?.actorId ? formatAddress(member?.actorId) : 'No Name found'}
						</Text>
						{
							comment?.role === 'admin' || comment?.role === 'reviewer' && (
								<Text
									bg='gray.3'
									p={1}>
									Member
								</Text>
							)
						}
						{
							comment?.timestamp && (
								<Text
									ml={2}
									variant='v2_body'
									color='gray.5'>
									{formatTime(comment?.timestamp)}
								</Text>
							)
						}
					</Flex>
					<TextViewer text={comment?.message ?? ''} />
				</Flex>
			</Flex>
		)
	}

	const { chainId, role } = useContext(ApiClientsContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const { quickReplies } = useQuickReplies()

	const [step, setStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState('')

	const [ text, setText ] = useState<EditorState>(EditorState.createEmpty())
	const { addComment, isBiconomyInitialised } = useAddComment({ setStep, setTransactionHash })
	const comments = useGetComments()

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const isDisabled = useMemo(() => {
		if(!isBiconomyInitialised || step !== undefined) {
			return true
		}

		return convertToRaw(text.getCurrentContent()).blocks[0].text.length === 0
	}, [text, step])

	useEffect(() => {
		logger.info({ comments }, 'Comments (Comment)')
	}, [comments])

	return buildComponents()
}

export default Discussions