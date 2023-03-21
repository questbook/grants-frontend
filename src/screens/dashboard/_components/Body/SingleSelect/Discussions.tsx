import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactLinkify from 'react-linkify'
import { LockIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	chakra,
	Checkbox,
	Divider,
	Flex,
	IconButton,
	Image,
	Text,
	Textarea,
	Tooltip,
} from '@chakra-ui/react'
import autosize from 'autosize'
import { motion, useAnimationControls, Variants } from 'framer-motion'
import { Close } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import { getAvatar } from 'src/libraries/utils'
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
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { CommentType, TagType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { Roles } from 'src/types'

function Discussions() {
	const { setSignIn } = useContext(SignInContext)!
	const { setSignInTitle } = useContext(SignInTitleContext)!
	const buildComponents = () => {
		return (
			<Flex
				px={5}
				w='100%'
				h='100%'
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				bg='white'
				direction='column'
			>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<Text fontWeight='500'>
						Discussion
					</Text>

					{
						areCommentsLoading && (
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
								color='gray.3'
								height={1} />
						)
					}

					{comments.map(renderComment)}
					<Flex
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
									{currentMember?.fullName ?? formatAddress(currentMember?.actorId ?? '')}
								</Text>
								<RoleTag
									role={(role as Roles) ?? 'community'}
									isBuilder={proposal?.applicantId === scwAddress?.toLowerCase()}
								/>
							</Flex>

							<Flex
								display={selectedTag === undefined ? 'flex' : 'none'}
								w='100%'
								mt={2}>
								<motion.div
									animate={controls}
									variants={buttonPanelVariants}>
									<Flex gap={3}>
										{
											proposalTags?.map((tag, index) => {
												return (
													<QuickReplyButton
														zIndex={10}
														id={tag.id as 'accept' | 'reject' | 'resubmit' | 'feedback'}
														key={index}
														tag={tag}
														isSelected={tag.id === selectedTag?.id}
														onClick={
															() => {
																if(selectedTag) {
																	setSelectedTag(undefined)
																	setText('')
																} else {
																	setSelectedTag(tag)
																	setText(tag.commentString)
																	controls.start('tagSelected')
																}
															}
														}
														index={index}
													/>
												)
											})
										}
									</Flex>
								</motion.div>
							</Flex>

							<Flex
								display={selectedTag === undefined ? 'none' : 'flex'}
								mt={4}
								direction='column'
								w='100%'>
								<motion.div
									animate={controls}
									variants={textboxVariants}>
									{
										selectedTag !== undefined && (
											<Flex
												w='100%'>
												<chakra.p
													width='100%'
													border='1px solid'
													borderRadius='4px'
													borderColor='accent.azure.400'
													alignItems='center'
													p={2}
													mr={2}>
													<QuickReplyButton
														mr={2}
														position='relative'
														index={0}
														id={selectedTag.id as 'accept' | 'reject' | 'resubmit' | 'feedback'}
														px={2}
														py={0}
														h='24px'
														isSelected
														float='left'
														cursor='default'
														onClick={() => {}}
														contentEditable={false}
														tag={selectedTag}
														textProps={{ variant: 'body' }}
													/>
													<chakra.span
														sx={
															{
																overflowWrap: 'break-word',
																border: 'none',
																':focus': {
																	outline: 'none',
																	border: 'none',
																},
															}
														}
														onInput={
															(e) => {
																if(e.currentTarget.textContent) {
																	logger.info({ text: e.currentTarget.textContent })
																	setText(e.currentTarget.textContent)
																	localStorage.setItem(`comment-${grant?.id}-${proposal?.id}`, e.currentTarget.textContent)
																}
															}
														}
														contentEditable
													>
														<Text variant='body'>
															{text}
														</Text>
													</chakra.span>
												</chakra.p>
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
											</Flex>

										)
									}
									{
										selectedTag === undefined && (
											<Textarea
												value={text}
												onChange={
													(e) => {
														setText(e.target.value)
														localStorage.setItem(`comment-${grant?.id}-${proposal?.id}`, e.target.value)
													}
												} />
										)
									}
									<Flex
										mt={4}
										align='center'>
										{
											(role === 'admin' && selectedTag?.id === 'feedback') && (
												<Checkbox
													isChecked={isCommentPrivate}
													onChange={
														(e) => {
															setSelectedTag(undefined)
															setIsCommentPrivate(e.target.checked)
														}
													}
												>
													<Text
														variant='body'
														color='gray.5'>
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

													const ret = await addComment(
														text,
														isCommentPrivate,
														selectedTag?.id,
													)
													if(ret) {
														setText('')
														setSelectedTag(undefined)
														refreshComments(true)
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
								</motion.div>
							</Flex>
						</Flex>
					</Flex>
					{comments.length > 0 && <Box my={4} />}
				</motion.div>
			</Flex>
		)
	}

	const renderComment = (comment: CommentType, index: number) => {
		const member = comment.workspace.members.find(
			(member) => member.actorId.toLowerCase() === comment.sender?.toLowerCase(),
		)

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
				align='start'
				mt={index === 0 ? 0 : 4}>
				<Image
					borderRadius='3xl'
					boxSize='36px'
					src={
						comment.role === 'builder' || comment.role === 'community'
							? getAvatar(false, comment.sender?.toLowerCase() ?? '')
							: member?.profilePictureIpfsHash
								? getUrlForIPFSHash(member.profilePictureIpfsHash)
								: getAvatar(false, member?.actorId)
					}
				/>
				<Flex
					ml={3}
					direction='column'>
					<Flex align='center'>
						<Text fontWeight='500'>
							{getCommentDisplayName(comment)}
						</Text>
						<RoleTag
							role={(comment?.role as Roles) ?? 'community'}
							isBuilder={proposal?.applicantId === comment?.sender?.toLowerCase()}
						/>
						{
							comment?.timestamp && (
								<Text
									ml={2}
									variant='body'
									color='gray.5'>
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
										color='gray.5' />
								</Tooltip>
							)
						}
					</Flex>

					<ReactLinkify
						componentDecorator={
							(
								decoratedHref: string,
								decoratedText: string,
								key: number,
							) => (
								<Text
									display='inline-block'
									wordBreak='break-all'
									color='accent.azure'
									variant='body'
									cursor='pointer'
									_hover={
										{
											textDecoration: 'underline',
										}
									}
									key={key}
									onClick={
										() => {
											window.open(decoratedHref, '_blank')
										}
									}
								>
									{decoratedText}
								</Text>
							)
						}
					>
						<Text
							wordBreak='break-word'
							mt={1}
							fontStyle={hasAccess ? 'normal' : 'italic'}
							variant='body'
							whiteSpace='pre-line'
						>
							{comment.message}
						</Text>
					</ReactLinkify>
				</Flex>
			</Flex>
		)
	}

	const ref = useRef<HTMLTextAreaElement>(null)

	const { scwAddress } = useContext(WebwalletContext)!
	const { grant, role } = useContext(GrantsProgramContext)!
	const {
		proposals,
		selectedProposals,
		commentMap,
		refreshComments,
		areCommentsLoading,
	} = useContext(DashboardContext)!

	const [step, setStep] = useState<number>()
	const [, setTransactionHash] = useState('')
	const [isCommentPrivate, setIsCommentPrivate] = useState<boolean>(false)
	const [selectedTag, setSelectedTag] = useState<TagType>()
	const [text, setText] = useState<string>('')

	const textboxVariants: Variants = {
		tagSelected: { opacity: 1, y: 0, transition: { duration: 0.5 } },
		tagUnselected: { opacity: 0, y: -50 }
	}
	const buttonPanelVariants: Variants = {
		tagSelected: { scale: 0, opacity: 0, transition: { duration: 0.5 } },
		tagUnselected: { scale: 1, opacity: 1 }
	}
	const controls = useAnimationControls()

	const { addComment, isBiconomyInitialised } = useAddComment({
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
		setText(comment ?? '')
	}, [grant, proposal])

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

	useEffect(() => {
		if(selectedTag === undefined) {
			controls.start('tagUnselected')
		} else {
			controls.start('tagSelected')
		}
	}, [selectedTag])

	const currentMember = useMemo(() => {
		return grant?.workspace?.members?.find((member) => member.actorId.toLowerCase() === scwAddress?.toLowerCase())
	}, [grant, scwAddress])

	const { proposalTags } = useProposalTags({
		proposals: proposal ? [proposal] : [],
	})

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
		if(!isBiconomyInitialised) {
			return true
		}

		return text === ''
	}, [text, step, isBiconomyInitialised])

	const helperText = useMemo(() => {
		switch (selectedTag?.id) {
		case 'accept':
			return 'On clicking “Post” the proposal will be accepted. Builder will be notified.'
		case 'reject':
			return 'On clicking “Post” the proposal will be rejected. Builder will be notified.'
		case 'resubmit':
			return 'On clicking “Post” the builder will be notified to resubmit his proposal.'
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
		} else {
			logger.info(
				{ comment: comment?.sender, proposalId: proposal?.applicantId },
				'COMMENT 1',
			)
			if(
				comment.role === 'builder' &&
				comment.sender?.toLowerCase() === proposal?.applicantId
			) {
				return getFieldString(proposal, 'applicantName')
			} else {
				return formatAddress(comment.sender ?? '')
			}
		}
	}

	return buildComponents()
}

export default Discussions
