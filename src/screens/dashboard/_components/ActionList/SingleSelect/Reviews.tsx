import { RefObject, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, ButtonProps, Checkbox, Divider, Flex, Image, InputGroup, InputRightElement, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, Tooltip } from '@chakra-ui/react'
import Safe from '@safe-global/safe-core-sdk'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import { ethers } from 'ethers'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import guardAbi from 'src/contracts/abi/ReviewerGuard.json'
import { CheckDouble, Close, Dropdown, Pencil } from 'src/generated/icons'
import { CONTRACT_INTERFACE_MAP } from 'src/libraries/hooks/useQBContract'
import logger from 'src/libraries/logger'
import { getAvatar } from 'src/libraries/utils'
import { formatAddress } from 'src/libraries/utils/formatting'
import { jsonRpcProviders } from 'src/libraries/utils/gasless'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { useLoadReview } from 'src/libraries/utils/reviews'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import DashboardInput from 'src/screens/dashboard/_components/DashboardInput'
import useAssignReviewers from 'src/screens/dashboard/_hooks/useAssignReviewers'
import useSetRubrics from 'src/screens/dashboard/_hooks/useSetRubrics'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import SafeGuardModal from 'src/screens/dashboard/SafeGuardModal'
import SetupProfileModal from 'src/screens/dashboard/SetupProfileModal'
import { GrantType, IReviewFeedback, ReviewType } from 'src/types'
import { RubricItem } from 'src/types/gen'

function Reviews() {
	const buildComponent = () => {
		return (
			<Flex
				px={5}
				py={4}
				direction='column'
				align='stretch'
				overflowY='auto'
				overflowX='clip'
				w='100%'>
				<Flex
					justify='space-between'
					onClick={
						() => {
							if(proposals?.length > 0) {
								setExpanded(!expanded)
							}
						}
					}>
					<Text fontWeight='500'>
						Reviews
					</Text>
					{
						proposals?.length > 0 && (
							<Dropdown
								mr={2}
								transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}
								cursor='pointer'
							/>
						)
					}
				</Flex>

				<Flex
					display={expanded ? 'block' : 'none'}
					direction='column'>
					{reviewer()}
					{reviewWith()}
					{
						(proposal?.applicationReviewers?.length || 0) > 0 && (
							<Text
								mt={4}
								variant='metadata'
								color='gray.500'
								fontWeight='500'>
								REVIEWER EVALUATION
							</Text>
						)
					}

					{(grant?.reviewType === 'voting' && (proposal?.applicationReviewers?.length || 0) > 0) && voteGraph()}

					{
						proposal?.applicationReviewers?.filter((reviewer) => !guardContractReviewers.find(gcr => gcr.member?.actorId === reviewer?.member?.actorId)).map((reviewer, index) => {
							return reviewerItem(reviewer?.member, reviews.find(r => r.reviewer === reviewer?.member.actorId), index)
						})
					}

					{
						guardContractReviewers.map((reviewer, index) => {
							if(reviewer?.member) {
								return reviewerItem(reviewer?.member, reviews.find(r => r.reviewer === reviewer?.member?.actorId), index)
							} else {
								return (
									<Flex
										mt={index === 0 ? 5 : 3}
										key={index}
										w='100%'
										align='center'
									>
										<Flex
											maxW='70%'
											align='center'
										>
											<Image
												borderRadius='3xl'
												boxSize='28px'
												src={getAvatar(false, reviewer?.walletAddress)}
											/>
											<Tooltip label={reviewer.walletAddress}>
												<Text
													as='span'
													variant='body'
													fontWeight='500'
													ml={3}
													noOfLines={3}>
													{formatAddress(reviewer.walletAddress)}
												</Text>
											</Tooltip>
										</Flex>

										<Box ml='auto' />

										<Button
											variant='link'
										>
											<Text
												color='accent.azure'
												variant='body'
												fontWeight='500'
												onClick={
													() => {
														setWalletAddress(reviewer.walletAddress)
													}
												}>
												Join as a reviewer
											</Text>
										</Button>
									</Flex>
								)
							}
						})
					}

				</Flex>

				<SafeGuardModal
					isOpen={isSafeGuardModalOpen}
					onClose={() => setIsSafeGuardModalOpen(false)} />

				<SetupProfileModal
					walletAddress={walletAddress ?? ''}
					isOpen={walletAddress !== undefined}
					onClose={() => setWalletAddress(undefined)} />

			</Flex>
		)
	}

	const voteGraph = () => {
		const votes = reviews.filter(r => r.items?.[0]?.rubric?.maximumPoints === 1)
		const forVotes = votes.filter(v => v.items?.[0]?.rating === 1).length
		const againstVotes = votes.filter(v => v.items?.[0]?.rating === 0).length
		return (
			<Flex
				direction='column'
				mt={2}>
				<Flex
					w='100%'
					justify='space-between'>
					{
						[forVotes, againstVotes].map((vote, index) => {
							return (
								<Flex
									direction='column'
									align={index === 0 ? 'start' : 'end'}
									key={index}>
									<Text
										variant='subheading'
										fontWeight='500'>
										{vote}
									</Text>
									<Text
										mt={1}
										variant='body' >
										{index === 0 ? 'For' : 'Against'}
									</Text>
								</Flex>
							)
						})
					}
				</Flex>
				<Flex
					w='100%'
					mt={2}
					h='12px'>
					<Flex
						bg='accent.june'
						w={`${(forVotes / votes.length) * 100}%`}
						h='100%' />
					<Flex
						bg='accent.royal'
						w={`${100 - ((forVotes / votes.length) * 100)}%`}
						h='100%' />
				</Flex>
			</Flex>
		)
	}

	const setupButton = (props?: ButtonProps) => {
		return (
			<Button
				variant='link'
				isDisabled={role !== 'admin'}
				{...props} >
				<Text
					variant='body'
					fontWeight='500'
					color='black.100'>
					Setup
				</Text>
			</Button>
		)
	}

	const editButton = () => {
		return (
			<Button
				isDisabled={role !== 'admin'}
				ml={2}
				variant='link'
				leftIcon={<Pencil boxSize='16px' />}>
				<Text
					variant='body'
					fontWeight='500'>
					Edit
				</Text>
			</Button>
		)
	}

	const assignReviewerPopup = (popoverRef: RefObject<HTMLButtonElement>, type: 'setup' | 'edit') => {
		return (
			<Popover
				isLazy
				placement='top-start'
				initialFocusRef={popoverRef}
			>
				{
					({ onClose }) => (
						<>
							<PopoverTrigger>
								{type === 'setup' ? setupButton() : editButton()}
							</PopoverTrigger>
							<PopoverContent>
								<PopoverArrow />
								<PopoverBody
									maxH='80vh'
									overflowY='auto'
									px={4}
									py={3} >
									<Text
										variant='body'
										fontWeight='500'>
										Assign Reviewers
									</Text>
									<Text
										mt={2}
										color='black.300'
										variant='body' >
										This will be applicable
										{' '}
										<Text
											variant='body'
											color='black.300'
											display='inline-block'
											fontWeight='500'>
											only
										</Text>
										{' '}
										for this proposal.
									</Text>
									<DashboardInput
										value={searchMemberName}
										placeholder='Search member by name'
										onChange={
											(e) => {
												setSearchMemberName(e.target.value)
											}
										} />
									<Flex
										mt={3}
										w='100%'>
										<Checkbox
											isChecked={grant?.workspace?.members?.every(m => members[m.id])}
											onChange={
												(e) => {
													logger.info({ checked: e.target.checked }, 'checkbox changed')
													if(e.target.checked) {
														const newMap: { [key: string]: boolean } = {}
														grant?.workspace?.members?.forEach(m => {
															newMap[m.id] = true
														})
														setMembers(newMap)
													} else {
														setMembers({})
													}
												}
											}>
											<Text
												variant='body'
												fontWeight='400'
												color='gray.600'>
												Select All
											</Text>
										</Checkbox>
										<Text
											ml='auto'
											variant='body'>
											{grant?.workspace?.members?.filter(m => members[m.id]).length}
											{' '}
											/
											{' '}
											{grant?.workspace?.members?.length}
											{' '}
											selected
										</Text>
									</Flex>
									<Flex
										direction='column'
										w='100%'
										pt={2}>
										{
											grant?.workspace?.members?.filter(m => searchMemberName === '' || m.fullName?.indexOf(searchMemberName) !== -1).map(m => {
												return (
													<Flex
														key={m.id}
														align='center'
														borderBottom='1px solid #E7E4DD'
														py={3}>
														<Checkbox
															isChecked={m.id in members || proposal?.doneReviewerAddresses?.indexOf(m.actorId) !== -1}
															isDisabled={proposal?.doneReviewerAddresses?.indexOf(m.actorId) !== -1}
															onChange={
																() => {
																	const newMap = { ...members }
																	if(m.id in members) {
																		delete newMap[m.id]
																	} else {
																		newMap[m.id] = true
																	}

																	setMembers(newMap)
																}
															} />
														<Image
															ml={4}
															borderRadius='3xl'
															src={m?.profilePictureIpfsHash ? getUrlForIPFSHash(m.profilePictureIpfsHash) : getAvatar(false, m?.actorId?.toLowerCase())}
															boxSize='20px' />
														<Text
															ml={4}
															variant='body'>
															{m.fullName ? m.fullName : formatAddress(m?.actorId)}
														</Text>
													</Flex>
												)
											})
										}
									</Flex>
									<Flex mt={6}>
										<Button
											variant='primaryMedium'
											isDisabled={false}
											isLoading={networkTransactionModalStep !== undefined}
											onClick={
												async() => {
													const selectedReviewers: string[] = []
													const active: boolean[] = []
													for(const reviewer of proposal?.applicationReviewers ?? []) {
														if(proposal?.doneReviewerAddresses.indexOf(reviewer?.member?.actorId.toLowerCase()) !== -1) {
															continue
														}

														if(!members[reviewer.id]) {
															selectedReviewers.push(reviewer.member.actorId)
															active.push(false)
														}
													}

													Object.keys(members).forEach(m => {
														const member = grant?.workspace?.members?.find(m2 => m2.id === m)
														if(member) {
															selectedReviewers.push(member.actorId)
															active.push(true)
														}
													})

													await assignReviewers(selectedReviewers, active)
												}
											}>
											<Text
												variant='body'
												color='white'
												fontWeight='500'>
												Save
											</Text>
										</Button>
										<Button
											ml={2}
											variant='primaryMedium'
											bg='white'
											border='1px solid #E7E4DD'
											borderRadius='2px'
											onClick={onClose}>
											<Text variant='body'>
												Cancel
											</Text>
										</Button>
									</Flex>
								</PopoverBody>
							</PopoverContent>
						</>
					)
				}
			</Popover>
		)
	}

	const reviewer = () => {
		return (
			<Flex
				display={role === 'admin' ? 'flex' : 'none'}
				mt={5}
				w='100%'>
				<Text
					w='50%'
					variant='body'
					color='gray.600'>
					Reviewer
				</Text>
				{
					totalNumberOfReviewers > 0 && (
						<Text
							variant='body'>
							{totalNumberOfReviewers}
						</Text>
					)
				}
				{totalNumberOfReviewers > 0 && <Box ml='auto' />}
				{(grant?.workspace?.safe?.chainId !== '10' && grant?.workspace?.safe?.chainId !== '5') && assignReviewerPopup(assignReviewerPopoverRef, (proposal?.applicationReviewers?.length || 0) > 0 ? 'edit' : 'setup')}
				{((grant?.workspace?.safe?.chainId === '10' || grant?.workspace?.safe?.chainId === '5') && guardContractReviewers?.length === 0) && setupButton({ onClick: () => setIsSafeGuardModalOpen(true) })}
			</Flex>
		)
	}

	const reviewTypeCheckbox = (type: ReviewType, label: string) => {
		return (
			<Checkbox
				isChecked={reviewType === type}
				onChange={
					(e) => {
						if(e.target.checked) {
							setReviewType(type)
						}
					}
				}
				mt={3}>
				<Text
					variant='body'
					fontWeight='500'>
					{label}
				</Text>
			</Checkbox>
		)
	}

	const rubricItem = (item: RubricItem, index: number) => {
		return (
			<Flex
				key={index}
				py={3}
				borderBottom='1px solid #E7E4DD'>
				<Text variant='body'>
					{item.title}
				</Text>
				<Close
					ml='auto'
					boxSize='16px'
					cursor='pointer'
					onClick={
						() => {
							if(rubricItems.length > 1) {
								const copy = [...rubricItems]
								setRubricItems(copy.filter((r, i) => i !== index))
							}
						}
					} />
			</Flex>
		)
	}

	const setReviewTypePopup = (popoverRef: RefObject<HTMLButtonElement>, type: 'setup' | 'edit') => {
		return (
			<Popover
				isLazy
				placement='bottom'
				initialFocusRef={popoverRef}>
				{
					({ onClose }) => (
						<>
							<PopoverTrigger>
								{type === 'setup' ? setupButton() : editButton()}
							</PopoverTrigger>
							<PopoverContent>
								<PopoverArrow />
								<PopoverBody
									maxH='80vh'
									overflowY='auto'
									px={4}
									py={3} >
									<Text
										variant='body'
										fontWeight='500'>
										Review By
									</Text>
									<Text
										mt={2}
										color='black.300'
										variant='body' >
										This will be applicable for
										{' '}
										<Text
											variant='body'
											color='black.300'
											display='inline-block'
											fontWeight='500'>
											all
										</Text>
										{' '}
										the proposals.
									</Text>
									<Divider mt={3} />

									{reviewTypeCheckbox(ReviewType.Voting, 'Voting')}

									<Divider mt={3} />

									{reviewTypeCheckbox(ReviewType.Rubrics, 'Rubrics')}

									<Divider mt={3} />

									{
										reviewType === ReviewType.Rubrics && (rubricItems.length > 0 || anotherRubricTitle !== undefined) && (
											<Text
												mt={6}
												variant='body'
												fontWeight='500'>
												Rubric Includes
											</Text>
										)
									}

									{reviewType === ReviewType.Rubrics && rubricItems?.map(rubricItem)}

									{
										reviewType === ReviewType.Rubrics && anotherRubricTitle !== undefined && (
											<InputGroup>
												<DashboardInput
													mt={3}
													variant='unstyled'
													border='none'
													borderBottom='1px solid #E7E4DD'
													borderRadius={0}
													value={anotherRubricTitle}
													onChange={
														(e) => {
															setAnotherRubricTitle(e.target.value)
														}
													}

												/>
												<InputRightElement>
													<Close

														cursor='pointer'
														onClick={
															() => {
																setAnotherRubricTitle(undefined)
															}
														}
														boxSize='16px' />
													<Box
														mx={2} />
													<CheckDouble
														cursor='pointer'
														onClick={
															() => {
																const copy = [...rubricItems, { title: anotherRubricTitle, description: '', maximumPoints: 5 }]
																setRubricItems(copy)
																setAnotherRubricTitle(undefined)
															}
														}
														boxSize='16px' />
												</InputRightElement>
											</InputGroup>

										)
									}

									{
										reviewType === ReviewType.Rubrics && anotherRubricTitle === undefined && (
											<Button
												mt={3}
												variant='link'
												onClick={() => setAnotherRubricTitle('')}>
												<Text
													variant='body'
													fontWeight='500'>
													{rubricItems.length === 0 ? 'Start adding Rubric' : 'Add Another'}
												</Text>
											</Button>
										)
									}

									{reviewType === ReviewType.Rubrics && <Divider mt={3} />}

									{/* <Checkbox
										mt={3}
										isChecked={isReviewPrivate}
										onChange={
											(e) => {
												setIsReviewPrivate(e.target.checked)
											}
										}>
										<Text
											variant='body'
											fontWeight='500'>
											Keep reviews private
										</Text>
									</Checkbox> */}

									<Flex mt={4}>
										<Button
											variant='primaryMedium'
											isDisabled={false}
											isLoading={networkTransactionModalStep !== undefined}
											onClick={
												() => {
													logger.info({ reviewType, isReviewPrivate, rubricItems }, 'setRubrics')
													setRubrics(reviewType, isReviewPrivate, rubricItems)
												}
											}>
											<Text
												variant='body'
												color='white'
												fontWeight='500'>
												Save
											</Text>
										</Button>
										<Button
											ml={2}
											variant='primaryMedium'
											bg='white'
											border='1px solid #E7E4DD'
											borderRadius='2px'
											onClick={onClose}>
											<Text variant='body'>
												Cancel
											</Text>
										</Button>
									</Flex>
								</PopoverBody>
							</PopoverContent>
						</>
					)
				}
			</Popover>
		)
	}

	const reviewWith = () => {
		return (
			<Flex
				mt={4}
				w='100%'>
				<Text
					w='50%'
					variant='body'
					color='gray.600'>
					Review With
				</Text>
				{
					(grant?.reviewType || (grant?.rubric && grant?.rubric?.items?.length > 0)) && (
						<Text
							variant='body'>
							{grant.reviewType === 'voting' ? 'Voting' : 'Rubrics'}
						</Text>
					)
				}
				{(grant?.reviewType || (grant?.rubric && grant?.rubric?.items?.length > 0)) && <Box ml='auto' />}
				{role === 'admin' && setReviewTypePopup(setReviewTypePopoverRef, (grant?.reviewType || (grant?.rubric && grant?.rubric?.items?.length > 0)) ? 'edit' : 'setup')}
			</Flex>
		)
	}

	const reviewerItem = (reviewer: ProposalType['applicationReviewers'][number]['member'], review: IReviewFeedback | undefined, index: number) => {
		return (
			<Flex
				mt={index === 0 ? 5 : 3}
				direction='column'
				key={index}>
				<Flex
					w='100%'
					align='center'
					onClick={
						() => {
							const copy = [...reviewersExpanded]
							copy[index] = !reviewersExpanded[index]
							setReviewersExpanded(copy)
						}
					}>
					<Flex
						maxW={review?.items?.[0]?.rubric?.maximumPoints === 1 ? '100%' : '70%'}
						align='center'
					>
						<Image
							borderRadius='3xl'
							boxSize='28px'
							src={reviewer?.profilePictureIpfsHash ? getUrlForIPFSHash(reviewer.profilePictureIpfsHash) : getAvatar(false, reviewer?.actorId ?? 'generic')}
						/>
						<Text
							as='span'
							variant='body'
							fontWeight='500'
							ml={3}
							noOfLines={3}>
							{reviewer?.fullName}
							{review?.items?.[0]?.rubric?.maximumPoints === 1 && ' voted'}
							{
								review?.items?.[0]?.rubric?.maximumPoints === 1 && (
									<Text
										ml={1}
										display='inline-block'
										variant='body'
										fontWeight='600'
										color={review.items?.[0]?.rating === 0 ? 'accent.royal' : 'accent.june'}>
										{review.items?.[0]?.rating === 0 ? ' against' : ' for'}
									</Text>
								)
							}
						</Text>
					</Flex>

					<Box ml='auto' />

					{
						review && review.items?.[0]?.rubric?.maximumPoints > 1 && (
							<Flex
								align='center'
								justify='end'
							>
								<Dropdown
									mr={2}
									transform={reviewersExpanded[index] ? 'rotate(180deg)' : 'rotate(0deg)'}
									cursor='pointer'
								/>
								<Text
									variant='body'
									textAlign='right'
									fontWeight='500'>
									{review?.total}
									<Text
										ml={1}
										color='black.300'
										display='inline-block'>
										{' / '}
										{review?.items?.reduce((acc, item) => acc + item?.rubric?.maximumPoints, 0)}
									</Text>
								</Text>
							</Flex>
						)
					}

					{
						!review && reviewer.actorId.toLowerCase() !== scwAddress?.toLowerCase() && (
							<Text
								bg='gray.400'
								py={1}
								px={2}
								borderRadius='8px'
								color='black.300'
								variant='metadata'
								fontWeight='500'>
								Pending
							</Text>
						)
					}

					{
						!review && reviewer.actorId.toLowerCase() === scwAddress?.toLowerCase() && (
							<Button
								variant='link'>
								<Text
									color='accent.azure'
									variant='body'
									fontWeight='500'
									onClick={
										() => {
											setShowSubmitReviewPanel(true)
										}
									}>
									Review Proposal
								</Text>
							</Button>
						)
					}

				</Flex>

				<Flex
					mt={2}
					pl={1}
					display={reviewersExpanded[index] ? 'block' : 'none'}
					direction='column'>
					{
						review?.items?.map((item, index) => {
							return (
								<Flex
									direction='column'
									key={index}
									mt={index === 0 ? 0 : 3}
									align='start'>
									<Flex
										w='100%'
										justify='space-between'>
										<Flex direction='column'>
											<Text
												variant='body'>
												{item?.rubric?.title}
											</Text>
											<Text
												variant='metadata'
												color='gray.600'>
												{item?.rubric?.details}
											</Text>
										</Flex>

										<Text
											textAlign='right'
											variant='body'>
											{item?.rating}
											<Text
												ml={1}
												color='black.300'
												display='inline-block'>
												{' / '}
												{item?.rubric?.maximumPoints}
											</Text>
										</Text>
									</Flex>

									<Text
										textAlign='justify'
										variant='metadata'
										color='gray.600'>
										{item?.comment}
									</Text>

								</Flex>
							)
						})
					}
				</Flex>
			</Flex>
		)
	}

	const { scwAddress } = useContext(WebwalletContext)!
	const { grant, role } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals, setShowSubmitReviewPanel } = useContext(DashboardContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])
	const { loadReview } = useLoadReview(grant?.id, chainId)

	const [expanded, setExpanded] = useState<boolean>(false)
	const [reviews, setReviews] = useState<IReviewFeedback[]>([])
	const [reviewersExpanded, setReviewersExpanded] = useState<boolean[]>([])

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [, setTransactionHash] = useState<string>('')

	const [isSafeGuardModalOpen, setIsSafeGuardModalOpen] = useState<boolean>(false)
	const [walletAddress, setWalletAddress] = useState<string>()

	const assignReviewerPopoverRef = useRef<HTMLButtonElement>(null)
	const [searchMemberName, setSearchMemberName] = useState<string>('')
	const [members, setMembers] = useState<{ [id: string]: boolean }>({})
	const [guardContractReviewers, setGuardContractReviewers] = useState<{ walletAddress: string, member: Exclude<GrantType, null | undefined>['workspace']['members'][number] | undefined }[]>([])
	const { assignReviewers } = useAssignReviewers({ setTransactionHash })

	const setReviewTypePopoverRef = useRef<HTMLButtonElement>(null)
	const [reviewType, setReviewType] = useState<ReviewType>(ReviewType.Rubrics)
	const [isReviewPrivate, setIsReviewPrivate] = useState<boolean>(false)
	const [rubricItems, setRubricItems] = useState<RubricItem[]>([])
	const [anotherRubricTitle, setAnotherRubricTitle] = useState<string>()
	const { setRubrics } = useSetRubrics({ setNetworkTransactionModalStep, setTransactionHash })

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const totalNumberOfReviewers = useMemo(() => {
		return (proposal?.applicationReviewers?.length || 0) + (guardContractReviewers?.length || 0)
	}, [proposal, guardContractReviewers])

	const getReviewersFromGuardContract = async() => {
		const safe = grant?.workspace?.safe
		if(!safe || (safe?.chainId !== '10' && safe?.chainId !== '5')) {
			setGuardContractReviewers([])
			return
		}

		const provider = jsonRpcProviders[safe.chainId]

		try {
			logger.info('Getting reviewers from guard contract (REVIEWER GUARD)', provider)
			const ethAdapter = new EthersAdapter({
				ethers,
				signerOrProvider: provider,
			})
			logger.info('Ethers adapter created (REVIEWER GUARD)', ethAdapter)
			const safeSdk = await Safe.create({ ethAdapter, safeAddress: safe.address })
			logger.info('Safe SDK created (REVIEWER GUARD)', safeSdk)

			const guard = await safeSdk.getGuard()
			logger.info('Guard contract address (REVIEWER GUARD)', guard)
			if(guard === ethers.constants.AddressZero) {
				setGuardContractReviewers([])
				return
			}

			const guardContract = new ethers.Contract(guard, guardAbi, provider)
			const workspaceRegistryContract = new ethers.Contract(CHAIN_INFO[getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId]?.qbContracts?.workspace, CONTRACT_INTERFACE_MAP['workspace'], provider)
			const reviewers: { walletAddress: string, member: Exclude<GrantType, null | undefined>['workspace']['members'][number] | undefined }[] = []

			const eoaReviewers = await guardContract.getReviewers()
			logger.info('Reviewers from guard contract (REVIEWER GUARD)', eoaReviewers)
			for(const eoaReviewer of eoaReviewers) {
				try {
					logger.info('Reviewer wallet address (REVIEWER GUARD)', eoaReviewer)
					logger.info(workspaceRegistryContract, 'Contract (REVIEWER GUARD)')
					const reviewer = await workspaceRegistryContract.eoaToScw(eoaReviewer, grant?.workspace?.id)
					logger.info('Reviewer scw address (REVIEWER GUARD)', reviewer)
					reviewers.push({ walletAddress: eoaReviewer, member: grant?.workspace?.members?.find(member => member.actorId === reviewer.toLowerCase()) })
				} catch(e) {
					logger.info(e, 'Fetching reviewers from contract (REVIEWER GUARD)')
					break
				}
			}

			reviewers.sort((a, b) => {
				if(a.member && !b.member) {
					return -1
				} else if(!a.member && b.member) {
					return 1
				} else {
					return 0
				}
			})
			setGuardContractReviewers(reviewers)
		} catch(e) {
			logger.error(e)
			setGuardContractReviewers([])
		}
	}

	useEffect(() => {
		logger.info('Calling get reviewers from guard contract (REVIEWER GUARD)', grant)
		getReviewersFromGuardContract()
	}, [])

	useEffect(() => {
		logger.info(guardContractReviewers, 'Guard contract reviewers')
	}, [guardContractReviewers])

	useEffect(() => {
		setReviewType(grant?.reviewType === 'voting' ? ReviewType.Voting : ReviewType.Rubrics)

		if(grant?.rubric?.items) {
			setRubricItems(grant?.rubric?.items)
		}

		if(grant?.rubric?.isPrivate !== undefined) {
			setIsReviewPrivate(grant?.rubric?.isPrivate)
		}
	}, [grant])

	useEffect(() => {
		if(proposals?.length === 0) {
			setExpanded(true)
		}
	}, [proposals])

	useEffect(() => {
		setReviewersExpanded(Array(proposal?.applicationReviewers?.length).fill(false))

		if(proposal?.applicationReviewers) {
			const currMembers: { [key: string]: boolean } = {}
			logger.info('Current member state 1: ', currMembers)
			for(const reviewer of proposal?.applicationReviewers) {
				currMembers[reviewer.member.id] = true
			}

			logger.info('Current member state 2: ', currMembers)

			setMembers(currMembers)
		}

	}, [proposal])

	useEffect(() => {
		if(!proposal) {
			return
		}

		logger.info({ proposal }, 'Proposal (REVIEW DECRYPT)')
		const decryptedReviews: Promise<IReviewFeedback>[] = []
		for(const review of proposal?.reviews || []) {
			decryptedReviews.push(loadReview(review, proposal?.id))
		}

		Promise.all(decryptedReviews).then((reviews) => {
			logger.info({ reviews }, 'Decrypted reviews (REVIEW DECRYPT)')
			setReviews(reviews)
		})
	}, [proposal])

	return buildComponent()
}

export default Reviews