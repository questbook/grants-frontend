import { useContext, useMemo, useState } from 'react'
import ReactLinkify from 'react-linkify'
import { LockIcon } from '@chakra-ui/icons'
import { Box, Button, Checkbox, Divider, Flex, Image, Text, Textarea, Tooltip } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import { getAvatar } from 'src/libraries/utils'
import { formatAddress, getFieldString } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import QuickReplyButton from 'src/screens/dashboard/_components/QuickReplyButton'
import useAddComment from 'src/screens/dashboard/_hooks/useAddComment'
import useProposalTags from 'src/screens/dashboard/_hooks/useQuickReplies'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { CommentType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'

function Discussions() {
	const buildComponents = () => {
		return (
			<Flex
				px={5}
				w='100%'
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				bg='white'
				direction='column'>
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
							cursor='default' />
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
				{
					proposalTags?.length > 0 && (
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
									variant='metadata'
									fontWeight='500'
									color='gray.6'>
									FEW WAYS TO START THE DISCUSSION.
								</Text>
								<Flex
									mt={2}
									gap={3}>
									{
										proposalTags?.map((tag, index) => {
											return (
												<QuickReplyButton
													key={index}
													tag={tag}
													isSelected={tag.id === selectedTag}
													onClick={
														() => {
															if(selectedTag) {
																setSelectedTag(undefined)
																setText('')
															} else {
																setSelectedTag(tag.id)
																setText(tag.commentString)
															}
														}
													}
													isDisabled={(selectedTag !== undefined && selectedTag !== tag.id) || (isCommentPrivate && !tag.isPrivate)}
													index={index} />
											)
										})
									}
								</Flex>
							</Flex>
						</Flex>
					)
				}
				<Flex
					mt={4}
					w='100%'>
					<Image
						borderRadius='3xl'
						boxSize='36px'
						src={(role === 'builder' || role === 'community') ? getAvatar(false, scwAddress?.toLowerCase()) : grant?.workspace?.members?.find(member => member.actorId.toLowerCase() === scwAddress?.toLowerCase())?.profilePictureIpfsHash ? getUrlForIPFSHash(grant?.workspace?.members?.find(member => member.actorId.toLowerCase() === scwAddress?.toLowerCase())?.profilePictureIpfsHash ?? '') : getAvatar(false, scwAddress?.toLowerCase())}
					/>
					<Flex
						ml={4}
						direction='column'
						w='100%'>
						<Textarea
							value={text}
							onChange={
								(e) => {
									setText(e.target.value)
								}
							}
							placeholder={placeholder} />
						<Flex
							mt={4}
							align='center'>
							{
								role === 'admin' && (
									<Checkbox
										isChecked={isCommentPrivate}
										onChange={
											(e) => {
												setSelectedTag(undefined)
												setIsCommentPrivate(e.target.checked)
											}
										}>
										<Text
											variant='body'
											color='gray.5'>
											Show only to reviewers and builder
										</Text>
									</Checkbox>
								)
							}
							<Button
								ml='auto'
								// mr={['50px','50px','0']}
								// paddingBottom='30px'
								marginBottom={['50px', '50px', '0']}
								variant='primaryMedium'
								isDisabled={isDisabled}
								isLoading={step !== undefined}
								onClick={
									async() => {
										const ret = await addComment(text, isCommentPrivate, selectedTag)
										if(ret) {
											setText('')
											setSelectedTag(undefined)
											refreshComments(true)
										}
									}
								}>
								Post
							</Button>
						</Flex>

					</Flex>
				</Flex>
				{
					comments.length > 0 && (
						<Box
							my={4} />
					)
				}
			</Flex>
		)
	}

	const renderComment = (comment: CommentType, index: number) => {
		const member = comment.workspace.members.find((member) => member.actorId.toLowerCase() === comment.sender?.toLowerCase())

		logger.info({ message: comment.message }, 'Comment message')

		let hasAccess = !comment.isPrivate
		for(const member of comment.workspace.members) {
			if(member.actorId === scwAddress?.toLowerCase()) {
				hasAccess = true
			}
		}

		hasAccess = hasAccess || comment.sender?.toLowerCase() === scwAddress?.toLowerCase()

		return (
			<Flex
				align='start'
				mt={index === 0 ? 0 : 4}>
				<Image
					borderRadius='3xl'
					boxSize='36px'
					src={(comment.role === 'builder' || comment.role === 'community') ? getAvatar(false, comment.sender?.toLowerCase() ?? '') : member?.profilePictureIpfsHash ? getUrlForIPFSHash(member.profilePictureIpfsHash) : getAvatar(false, member?.actorId)} />
				<Flex
					ml={3}
					direction='column'>
					<Flex align='center'>
						<Text fontWeight='500'>
							{getCommentDisplayName(comment)}
						</Text>
						<Text
							ml={3}
							variant='metadata'
							borderRadius='3px'
							bg={comment?.role === 'admin' ? 'gray.3' : comment?.role === 'reviewer' ? 'accent.crayola' : comment?.role === 'builder' && proposal?.applicantId === comment?.sender?.toLowerCase() ? 'accent.vodka' : 'accent.melon'}
							px={1}>
							{comment?.role === 'admin' ? 'Admin' : comment?.role === 'reviewer' ? 'Reviewer' : comment?.role === 'builder' && proposal?.applicantId === comment?.sender?.toLowerCase() ? 'Builder' : 'Community'}
						</Text>
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
								<Tooltip label={hasAccess ? 'Lucky one to have access to this!' : 'You are not supposed to see this! \ud83d\ude33'}>
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
									}>
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
							whiteSpace='pre-line'>
							{comment.message}
						</Text>
					</ReactLinkify>
				</Flex>
			</Flex>
		)
	}

	const { scwAddress } = useContext(WebwalletContext)!
	const { grant, role } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals, commentMap, refreshComments, areCommentsLoading } = useContext(DashboardContext)!

	const [step, setStep] = useState<number>()
	const [, setTransactionHash] = useState('')
	const [isCommentPrivate, setIsCommentPrivate] = useState<boolean>(false)
	const [ selectedTag, setSelectedTag ] = useState<string>()
	const [ text, setText ] = useState<string>('')

	const { addComment, isBiconomyInitialised } = useAddComment({ setStep, setTransactionHash })

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const { proposalTags } = useProposalTags({ proposals: proposal ? [proposal] : [] })

	const comments = useMemo(() => {
		if(!proposal || !commentMap) {
			return []
		}

		const key = `${proposal.id}.${proposal.grant.workspace.supportedNetworks[0].split('_')[1]}`
		logger.info({ key, commentMap }, 'PUBLIC COMMENT 6')
		return commentMap[key] ?? []
	}, [proposal, commentMap])

	const isDisabled = useMemo(() => {
		if(!isBiconomyInitialised) {
			return true
		}

		return text === ''
	}, [text, step])

	const placeholder = useMemo(() => {
		switch (selectedTag) {
		case 'accept':
			return 'Share your thoughts on why you are accepting this proposal'
		case 'reject':
			return 'Let the builder know why you are rejecting this proposal here'
		case 'resubmit':
			return 'Suggest changes to the proposal here'
		case 'interview':
			return 'Paste an interview link here'
		default:
			return 'Add a general comment'
		}
	}, [selectedTag])

	const getCommentDisplayName = (comment: CommentType) => {
		if(comment.role === 'admin' || comment.role === 'reviewer') {
			const member = comment.workspace.members.find((member) => member.actorId.toLowerCase() === comment.sender?.toLowerCase())
			if(member?.fullName) {
				return member?.fullName
			} else if(member?.actorId) {
				return formatAddress(member?.actorId)
			} else {
				return 'No name found'
			}
		} else {
			logger.info({ comment: comment?.sender, proposalId: proposal?.applicantId }, 'COMMENT 1')
			if(comment.role === 'builder' && comment.sender?.toLowerCase() === proposal?.applicantId) {
				return getFieldString(proposal, 'applicantName')
			} else {
				return formatAddress(comment.sender ?? '')
			}
		}
	}

	return buildComponents()
}

export default Discussions