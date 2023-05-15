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
	useToken,
} from '@chakra-ui/react'
import autosize from 'autosize'
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
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				bg='white'
				direction='column'
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
								role={(role as Roles) ?? 'community'}
								isBuilder={proposal?.applicantId === scwAddress?.toLowerCase()}
							/>
							{
								selectedTag !== undefined && selectedTag?.id !== 'feedback' && <Flex ml='auto' gap={1}>
									<Text as='span' variant='body'>You are about to</Text>
									<Text as='span' variant='body' fontWeight={'500'} color={config[selectedTag?.id as keyof typeof config].bg}>{config[selectedTag?.id as keyof typeof config].title}</Text>
									<Text as='span' variant='body'>this proposal</Text>
								</Flex>
							}
						</Flex>

						<Flex
							display={selectedTag === undefined ? 'flex' : 'none'}
							w='100%'
							mt={2}>
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
														if (selectedTag) {
															logger.info('Deselecting tag')
															setSelectedTag(undefined)
															setText('')
														} else {
															logger.info('Selecting tag')
															setSelectedTag(tag)
															setText(tag.commentString)
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
							{
								<Flex>
									<Textarea
										value={text}
										onChange={
											(e) => {
												setText(e.target.value)
												localStorage.setItem(`comment-${grant?.id}-${proposal?.id}`, e.target.value)
											}
										}
										fontSize='14px'
										placeholder='Type your comment here' />
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
										async () => {
											if (isDisabled) {
												setSignInTitle('postComment')
												setSignIn(true)
												return
											}

											const ret = await addComment(
												text,
												isCommentPrivate,
												selectedTag?.id,
											)
											if (ret) {
												setText('')
												logger.info('Setting selected tag to undefined after posting comment')
												setSelectedTag(undefined)
												refreshComments(true)
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
						<Text
							variant='body'
							mt={4}
							w='100%'
							textAlign='center'
							color='gray.600'>
							~ Sign in to post comments! ~
						</Text>
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
		for (const member of comment.workspace.members) {
			if (member.actorId === scwAddress?.toLowerCase()) {
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
	const spanRef = useRef<HTMLSpanElement>(null)

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
		if (ref.current) {
			autosize(ref.current)
		}

		return () => {
			if (ref.current) {
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
		if (proposalTags.length === 1) {
			logger.info('Setting selected tag to the only tag')
			setSelectedTag(proposalTags[0])
		} else {
			logger.info('Setting selected tag to undefined')
			setSelectedTag(undefined)
		}
	}, [proposal])

	const comments = useMemo(() => {
		if (!proposal || !commentMap) {
			return []
		}

		const key = `${proposal.id}.${proposal.grant.workspace.supportedNetworks[0].split('_')[1]
			}`
		logger.info({ key, commentMap }, 'PUBLIC COMMENT 6')
		return commentMap[key] ?? []
	}, [proposal, commentMap])

	const isDisabled = useMemo(() => {
		if (!isBiconomyInitialised) {
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
		if (comment.role === 'admin' || comment.role === 'reviewer') {
			const member = comment.workspace.members.find(
				(member) => member.actorId.toLowerCase() === comment.sender?.toLowerCase(),
			)
			if (member?.fullName) {
				return member?.fullName
			} else if (member?.actorId) {
				return formatAddress(member?.actorId)
			} else {
				return 'No name found'
			}
		} else {
			logger.info(
				{ comment: comment?.sender, proposalId: proposal?.applicantId },
				'COMMENT 1',
			)
			if (
				comment.role === 'builder' &&
				comment.sender?.toLowerCase() === proposal?.applicantId
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

	const [azure, carrot, orchid, vivid] = useToken(
		'colors',
		['accent.azure', 'accent.carrot', 'accent.orchid', 'accent.vivid']
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
		}
	}

	return buildComponents()
}

export default Discussions
