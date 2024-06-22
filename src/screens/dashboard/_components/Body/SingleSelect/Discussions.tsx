import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import { LockIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Checkbox,
	Divider,
	Flex,
	IconButton,
	Image,
	List,
	Text,
	Tooltip,
	useToast,
	useToken,
} from '@chakra-ui/react'
import autosize from 'autosize'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import remarkGfm from 'remark-gfm'
import { Close } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import CommentsTextEditor from 'src/libraries/ui/RichTextEditor/commentTextEditor'
import { getAvatar } from 'src/libraries/utils'
import { AmplitudeContext } from 'src/libraries/utils/amplitude'
import { formatAddress, getFieldString } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import {
	GrantsProgramContext,
	SignInContext,
	SignInTitleContext,
	WebwalletContext,
} from 'src/pages/_app'
import QuickReplyButton from 'src/screens/dashboard/_components/QuickReplyButton'
import RoleTag from 'src/screens/dashboard/_components/RoleTag'
import useAddComment from 'src/screens/dashboard/_hooks/useAddComment'
import useProposalTags from 'src/screens/dashboard/_hooks/useQuickReplies'
import GetSynapsLink from 'src/screens/dashboard/_hooks/useSynaps'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { CommentType, TagType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext, ModalContext } from 'src/screens/dashboard/Context'
import { Roles } from 'src/types'

function Discussions() {
	const { setSignIn } = useContext(SignInContext)!
	const { setSignInTitle } = useContext(SignInTitleContext)!
	const buildComponents = () => {
		return (
			<Flex
				px={5}
				w='100%'
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				bg='white'
				direction='column'
			>
				<Text fontWeight='500'>
					Discussion
				</Text>

				{
					(areCommentsLoading || isLoading) && (
						<Button
							my={4}
							isLoading={areCommentsLoading}
							loadingText='Loading comments, please wait.'
							variant='link'
							cursor='default'
						/>
					)
				}

				{
					comments.length > 0 && (
						<Divider
							my={4}
							color='gray.300'
							height={1} />
					)
				}

				{comments.map(renderComment)}
				<Flex
					display={scwAddress ? 'flex' : 'none'}
					mt={4}
					w='100%'>
					<Image
						borderRadius='3xl'
						boxSize='36px'
						src={
							role === 'builder' || role === 'community'
								? getAvatar(false, scwAddress?.toLowerCase())
								: currentMember?.profilePictureIpfsHash
									? getUrlForIPFSHash(currentMember?.profilePictureIpfsHash ?? '')
									: getAvatar(false, scwAddress?.toLowerCase())
						}
					/>
					<Flex
						w='100%'
						ml={4}
						direction='column'>
						<Flex align='center'>
							<Text
								variant='body'
								fontWeight='500'>
								{currentMember?.fullName ?? formatAddress(scwAddress ?? '')}
							</Text>
							<RoleTag
								role={(role as Roles)}
								isBuilder={proposal?.applicantId?.toLowerCase() === scwAddress?.toLowerCase()}
							/>
							{
								selectedTag !== undefined && selectedTag?.id !== 'feedback' && (
									<Flex
										ml='auto'
										gap={1}>
										<Text
											as='span'
											variant='body'>
											You are about to
										</Text>
										<Text
											as='span'
											variant='body'
											fontWeight='500'
											color={config[selectedTag?.id as keyof typeof config].bg}>
											{config[selectedTag?.id as keyof typeof config].title}
										</Text>
										<Text
											as='span'
											variant='body'>
											this proposal
										</Text>
									</Flex>
								)
							}
						</Flex>

						<Flex
							display={selectedTag === undefined ? 'flex' : 'none'}
							w='100%'
							mt={2}
							overflowX='auto'
							style={{ scrollbarWidth: 'none' }}
						>
							<Flex gap={3}>
								{
									!isLoading && proposalTags?.map((tag, index) => {
										return (
											<QuickReplyButton
												zIndex={10}
												id={tag.id as 'accept' | 'reject' | 'resubmit' | 'feedback' | 'review' | 'KYC' | 'KYB' | 'HelloSign' | 'cancelled'}
												key={index}
												tag={tag}
												isSelected={tag.id === selectedTag?.id}
												onClick={
													async() => {
														if(tag.id === 'KYC' || tag.id === 'KYB') {
															setIsLoading(true)
															const link = await getSynapsLink(tag.id, proposal?.id as string)
															logger.info({ link }, 'SYNAPS LINK')
															if((!link && !link?.includes('?session_id=')) || link?.includes('undefined')) {
																setIsLoading(false)
																await toast({
																	title: 'Error generating Synaps link',
																	description: 'Please check the Synaps configuration or contact support',
																	status: 'error',
																	duration: 5000,
																	position: 'top-right',
																})
																return
															}

															if(link) {
																setText(link)
																setSelectedTag(tag)
																setIsCommentPrivate(tag.isPrivate)
																const ret = await addComment(
																	`${tag.commentString} \n\n${link}`,
																	true,
																	selectedTag?.id,
																)
																if(ret) {
																	setText('')
																	setEditorState(EditorState.createEmpty())
																	logger.info('Setting selected tag to undefined after posting comment')
																	setSelectedTag(undefined)
																	refreshComments(true)
																	refreshProposals(true)
																	setIsCommentPrivate(false)
																	setStep(undefined)
																	setIsLoading(false)
																	localStorage.removeItem(
																		`comment-${grant?.id}-${proposal?.id}`,
																	)
																}
															}
														} else if(selectedTag) {
															logger.info('Deselecting tag')
															setSelectedTag(undefined)
															setText('')
															setEditorState(EditorState.createEmpty())
														} else if(tag.id === 'HelloSign') {
															setIsHelloSignModalOpen(true)
														} else {
															logger.info('Selecting tag')
															// if it is KYC or KYB then we need to call the function to send the link

															setSelectedTag(tag)
															setEditorState(EditorState.createWithContent(convertFromRaw(markdownToDraft(tag.commentString))))
														}
													}
												}
												index={index}
											/>
										)
									})
								}
							</Flex>
						</Flex>

						<Flex
							display={selectedTag === undefined ? 'none' : 'flex'}
							mt={4}
							direction='column'
							w='100%'>
							<Flex>

								<Flex
									w={['100%', '100%']}
								>
									<CommentsTextEditor
										value={editorState}
										onChange={setEditorState}
										placeholder='Type your comment here' />
								</Flex>

								{
									proposalTags?.length > 1 && (
										<IconButton
											ml='auto'
											variant='unstyled'
											aria-label=''
											icon={
												<Close
													color='black.200'
													_hover={{ color: 'black.100' }} />
											}
											onClick={() => setSelectedTag(undefined)} />
									)
								}
							</Flex>
							<Flex
								mt={4}
								align='center'>
								{
									(role === 'admin' && selectedTag?.id === 'feedback') && (
										<Checkbox
											isChecked={isCommentPrivate}
											onChange={
												(e) => {
													setIsCommentPrivate(e.target.checked)
												}
											}
										>
											<Text
												variant='body'
												color='gray.500'>
												Show comment only to reviewers and builders
											</Text>
										</Checkbox>
									)
								}
								{
									(role === 'admin' && selectedTag?.id !== 'feedback') && (
										<Text variant='body'>
											{helperText}
										</Text>
									)
								}
								<Button
									ml='auto'
									marginBottom={['90px', '50px', '0']}
									variant='primaryMedium'
									isLoading={step !== undefined}
									onClick={
										async() => {
											if(isDisabled) {
												setSignInTitle('postComment')
												setSignIn(true)
												return
											}

											const isFirstCommentByAdminOrReviewer = comments?.findIndex((comment) => comment.role === 'admin' || comment.role === 'reviewer') === -1
											if(isFirstCommentByAdminOrReviewer) {
												const time = Math.floor((Date.now() - proposal?.createdAtS! * 1000) / (1000 * 60))
												trackAmplitudeEvent('TAT', {
													proposalId: proposal?.id,
													programName: grant?.title,
													tat: time ?? 1,
												})
											}

											const ret = await addComment(
												text,
												isCommentPrivate,
												selectedTag?.id,
											)
											if(ret) {
												setText('')
												setEditorState(EditorState.createEmpty())
												logger.info('Setting selected tag to undefined after posting comment')
												setSelectedTag(undefined)
												refreshComments(true)
												refreshProposals(true)
												setIsCommentPrivate(false)
												setStep(undefined)
												localStorage.removeItem(
													`comment-${grant?.id}-${proposal?.id}`,
												)
											}
										}
									}
								>
									Post
								</Button>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				{
					!scwAddress && (
						<Button
							variant='body'
							mt={4}
							w='100%'
							isLoading={webwallet ? !scwAddress : false}
							loadingText='Loading your wallet'
							onClick={
								() => {
									setSignInTitle('postComment')
									setSignIn(true)
								}
							}
							textAlign='center'
							color='gray.600'>
							~ Sign in to post comments! ~
						</Button>
					)
				}
				<Box my={4} />
			</Flex>
		)
	}

	const renderComment = (comment: CommentType, index: number) => {
		logger.info('Render comment (RENDER COMMENT)', comment)
		const member = comment.workspace.members.find(
			(member) => member.actorId.toLowerCase() === comment.sender?.toLowerCase(),
		)

		logger.info({ member }, 'Member (RENDER COMMENT)')

		logger.info({ message: comment.message }, 'Comment message')

		let hasAccess = !comment.isPrivate
		for(const member of comment.workspace.members) {
			if(member.actorId === scwAddress?.toLowerCase()) {
				hasAccess = true
			}
		}

		hasAccess =
			hasAccess || comment.sender?.toLowerCase() === scwAddress?.toLowerCase()

		return (
			<Flex
				key={index}
				align='start'
				overflowWrap='break-word'
				mt={index === 0 ? 0 : 4}>
				<Image
					borderRadius='3xl'
					boxSize='36px'
					src={
						comment.role === 'builder' || comment.role === 'community'
							? getAvatar(false, comment.sender?.toLowerCase() ?? '')
							: comment.role === 'app' ? comment?.sender === 'helloSign' ? 'https://avatars.githubusercontent.com/u/25623857?s=280&v=4' : 'https://avatars.githubusercontent.com/u/63306624?s=280&v=4'
								: member?.profilePictureIpfsHash
									? getUrlForIPFSHash(member.profilePictureIpfsHash)
									: getAvatar(false, member?.actorId)
					}
				/>
				<Flex
					ml={3}
					overflowWrap='break-word'
					overflowX='auto'
					width='100%'
					direction='column'>
					<Flex
						align='center'
						mb={1}>
						<Text fontWeight='500'>
							{getCommentDisplayName(comment)}
						</Text>
						<RoleTag
							role={(comment?.role as Roles) ?? 'community'}
							isBuilder={proposal?.applicantId?.toLowerCase() === comment?.sender?.toLowerCase()}
						/>
						{
							comment?.timestamp && (
								<Text
									ml={2}
									variant='body'
									color='gray.500'>
									{formatTime(comment?.timestamp)}
								</Text>
							)
						}
						{
							comment.isPrivate && (
								<Tooltip
									label={
										hasAccess
											? 'Lucky one to have access to this!'
											: 'You are not supposed to see this! \ud83d\ude33'
									}
								>
									<LockIcon
										ml={2}
										color='gray.500' />
								</Tooltip>
							)
						}
					</Flex>

					<div className='richTextContainerPreview'>
						<Markdown
							remarkPlugins={[remarkGfm]}
							className='DraftEditor-root DraftEditor-editorContainer public-DraftEditor-content markdown-body'
							components={
								{
									a: props => {
										return (
											<Text
												display='inline-block'
												wordBreak='break-all'
												color='accent.azure'
												fontSize='14px'
												variant='body'
												cursor='pointer'
												_hover={
													{
														textDecoration: 'underline',
													}
												}
												onClick={
													() => {
														window.open(props.href, '_blank')
													}
												}
											>
												{props.href}
											</Text>

										)
									},

									p: ({ ...props }) => {
										return (
											<Text
												{...props}
												variant='body'
												fontSize='14px'
												mt={2}
												style={
													{
														fontStyle: hasAccess ? 'normal' : 'italic',
													}
												}
												whiteSpace='pre-line'
												wordBreak='break-word'
											/>
										)
									},
									ul: ({ ...props }) => {
										return (
											<List
												{...props}
												as='ul'
												className='public-DraftStyleDefault-ul'
											/>
										)
									}
									,
									li: ({ ...props }) => {
										return (
											<li
												{...props}
												className='public-DraftStyleDefault-unorderedListItem public-DraftStyleDefault-reset public-DraftStyleDefault-depth0 public-DraftStyleDefault-listLTR'
											/>
										)
									},


									h1: ({ ...props }) => {
										return (
											<Text
												fontSize='20px'
												fontWeight={600}
												lineHeight={1.2}
												mb='14px'
												mt='14px'
												{...props}
												as='h1'

											/>
										)
									},
									h2: ({ ...props }) => {
										return (
											<Text

												{...props}
												as='h2'
												fontSize='18px'
												fontWeight={600}
												lineHeight={1.2}
												mb='14px'
												mt='14px'
											/>
										)
									},

									h3: ({ ...props }) => {
										return (
											<Text

												{...props}
												as='h3'
												fontSize='16px'
												fontWeight={600}
												lineHeight={1.2}
												mb='14px'
												mt='14px'
											/>
										)
									},


									h4: ({ ...props }) => {
										return (
											<Text
												{...props}
												variant='h4'
												mt={2}
											/>
										)
									},
									h5: ({ ...props }) => {
										return (
											<Text
												{...props}
												variant='h5'
												mt={2}
											/>
										)
									},
									img: ({ ...props }) => {
										return (
											<Image
												{...props}
												fallback={<></>}
												fallbackStrategy='onError'
												w='50%'
												mt={2}
												src={props.src}
												alt='comment-image'
											/>
										)
									}
								}
							}
						>
							{comment.message?.replace(/\n/g, '\n\n')}
						</Markdown>
					</div>
				</Flex>
			</Flex>
		)
	}

	const ref = useRef<HTMLTextAreaElement>(null)

	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { trackAmplitudeEvent } = useContext(AmplitudeContext)!
	const { grant, role } = useContext(GrantsProgramContext)!
	const toast = useToast()
	logger.info({ grant, role }, 'GRANT AND ROLE')
	const {
		proposals,
		selectedProposals,
		commentMap,
		refreshComments,
		refreshProposals,
		areCommentsLoading,
	} = useContext(DashboardContext)!
	const { setIsHelloSignModalOpen } = useContext(ModalContext)!

	const [step, setStep] = useState<number>()
	const [, setTransactionHash] = useState('')
	const [isCommentPrivate, setIsCommentPrivate] = useState<boolean>(false)
	const [selectedTag, setSelectedTag] = useState<TagType>()
	const [text, setText] = useState<string>('')
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
	const [isLoading, setIsLoading] = useState(false)

	const { getSynapsLink } = GetSynapsLink()
	const { addComment } = useAddComment({
		setStep,
		setTransactionHash,
	})

	const proposal = useMemo(() => {
		return proposals.find((p) => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	useEffect(() => {
		const comment = localStorage.getItem(
			`comment-${grant?.id}-${proposal?.id}`,
		)
		// setText(comment ?? '')
		setEditorState(EditorState.createWithContent(convertFromRaw(markdownToDraft(comment ?? ''))))
	}, [grant])

	useEffect(() => {
		if(ref.current) {
			autosize(ref.current)
		}

		return () => {
			if(ref.current) {
				autosize.destroy(ref.current)
			}
		}
	}, [])

	const currentMember = useMemo(() => {
		return grant?.workspace?.members?.find((member) => member.actorId.toLowerCase() === scwAddress?.toLowerCase())
	}, [grant, scwAddress])

	const { proposalTags } = useProposalTags({
		proposals: proposal ? [proposal] : [],
	})

	useEffect(() => {
		const content = draftToMarkdown(convertToRaw(editorState.getCurrentContent()), {
			entityItems: {
			  image: {
					open: function() {
				  return ''
					},
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					close: function(entity: any) {
				  return `![${entity['data'].alt}](${entity['data'].src})`
					},
			  },
			},
		  })
		const content1 = content.replace(/\\#/g, '#')
		setText(content1)
		logger.info({ content }, 'CONTENT')
	}, [editorState])


	useEffect(() => {
		logger.info({ proposalTags }, 'PROPOSAL TAGS')
		if(proposalTags.length === 1) {
			logger.info('Setting selected tag to the only tag', proposalTags)
			setSelectedTag(proposalTags[0])
		} else {
			logger.info('Setting selected tag to undefined')
			setSelectedTag(undefined)
		}
	}, [proposal, role])

	const comments = useMemo(() => {
		if(!proposal || !commentMap) {
			return []
		}

		const key = `${proposal.id}.${proposal.grant.workspace.supportedNetworks[0].split('_')[1]
		}`
		logger.info({ key, commentMap }, 'PUBLIC COMMENT 6')
		return commentMap[key] ?? []
	}, [proposal, commentMap])

	const isDisabled = useMemo(() => {

		return text === ''
	}, [text, step])

	const helperText = useMemo(() => {
		switch (selectedTag?.id) {
		case 'accept':
			return 'On clicking “Post” the proposal will be accepted. Builder will be notified.'
		case 'reject':
			return 'On clicking “Post” the proposal will be rejected. Builder will be notified.'
		case 'resubmit':
			return 'On clicking “Post” the builder will be notified to resubmit his proposal.'
		case 'review':
			return 'On clicking “Post” the proposal will be under review. Builder will be notified.'
		case 'KYC':
			return 'On clicking “Post” the builder will be notified to complete KYC.'
		case 'KYB':
			return 'On clicking “Post” the builder will be notified to complete KYB.'
		case 'HelloSign':
			return 'On clicking “Post” the builder will be notified to sign the document.'
		case 'cancelled':
			return 'On clicking “Post” the proposal will be cancelled.'
		default:
			return ''
		}
	}, [selectedTag])

	const getCommentDisplayName = (comment: CommentType) => {
		if(comment.role === 'admin' || comment.role === 'reviewer') {
			const member = comment.workspace.members.find(
				(member) => member.actorId.toLowerCase() === comment.sender?.toLowerCase(),
			)
			if(member?.fullName) {
				return member?.fullName
			} else if(member?.actorId) {
				return formatAddress(member?.actorId)
			} else {
				return 'No name found'
			}
		} else if(comment.role === 'app') {
			return comment.sender
		} else {
			logger.info(
				{ comment: comment?.sender, proposalId: proposal?.applicantId },
				'COMMENT 1',
			)
			if(
				comment.role === 'builder' &&
				comment.sender?.toLowerCase() === proposal?.applicantId?.toLowerCase()
			) {
				return getFieldString(proposal, 'applicantName')
			} else {
				return formatAddress(comment.sender ?? '')
			}
		}
	}

	useEffect(() => {
		logger.info({ selectedTag }, 'SELECTED TAG')
	}, [selectedTag])

	const [azure, carrot, orchid, vivid, jeans] = useToken(
		'colors',
		['accent.azure', 'accent.carrot', 'accent.orchid', 'accent.vivid', 'accent.jeans']
	)

	const config = {
		accept: {
			title: 'accept',
			bg: azure,
		},
		reject: {
			title: 'reject',
			bg: carrot,
		},
		resubmit: {
			title: 'ask for resubmitting',
			bg: orchid,
		},
		feedback: {
			title: 'give feedback to',
			bg: vivid
		},
		review: {
			title: 'review',
			bg: jeans
		},
		KYC: {
			title: 'send KYC link to',
			bg: jeans
		},
		KYB: {
			title: 'send KYB link to',
			bg: jeans
		},
		HelloSign: {
			title: 'send document to',
			bg: azure
		},
		cancelled: {
			title: 'cancel / withdraw',
			bg: carrot
		},
	}

	return buildComponents()
}

export default Discussions