import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
	Box, Button, Container, Flex, Heading, HStack, Image, Menu,
	MenuButton,
	MenuGroup,
	MenuItem, MenuList,
	Spacer, Text
} from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Breadcrumbs from 'src/components/ui/breadcrumbs'
import Modal from 'src/components/ui/modal'
import AppplicationTableEmptyState from 'src/components/your_applications/empty_states/applications_table'
import GrantStatsBox from 'src/components/your_grants/grantStatsBox'
import RubricDrawer from 'src/components/your_grants/rubricDrawer'
import ApplicantsTable from 'src/components/your_grants/view_applicants/table'
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters'
import ChangeAccessibilityModalContent from 'src/components/your_grants/yourGrantCard/changeAccessibilityModalContent'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import {
	useGetApplicantsForAGrantQuery,
	useGetApplicantsForAGrantReviewerQuery,
	useGetFundSentDisburseforGrantQuery,
	useGetGrantDetailsQuery,
} from 'src/generated/graphql'
import useArchiveGrant from 'src/hooks/useArchiveGrant'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import NavbarLayout from 'src/layout/navbarLayout'
import { ApplicationMilestone } from 'src/types'
import { formatAmount } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useAccount } from 'wagmi'

const PAGE_SIZE = 500

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(milestone.amountPaid)
	})
	return val
}

function ViewApplicants() {
	const [applicantsData, setApplicantsData] = useState<any>([])
	const [reviewsData, setReviewsData] = useState<any>([])
	const [reviewerData, setReviewerData] = useState<any>([])
	const [daoId, setDaoId] = useState('')
	const [grantID, setGrantID] = useState<any>(null)
	const [acceptingApplications, setAcceptingApplications] = useState(true)
	const [shouldShowButton, setShouldShowButton] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
	const [isReviewer, setIsReviewer] = React.useState<boolean>(false)
	const [isUser, setIsUser] = React.useState<any>('')
	const [isActorId, setIsActorId] = React.useState<any>('')
	const [totalDisbursed, setTotalDisbursed] = useState(0)
	const [rewardTokenDecimals, setRewardTokenDecimals] = useState(18)
	const [grantTitle, setGrantTitle] = useState<any>('Grant Title')
	const [applicationsFilter, setApplicationsFilter] = useState('Accepted')
	const [isAcceptedActive, setIsAcceptedActive] = useState(true)
	const [isInReviewActive, setIsInReviewActive] = useState(false)
	const [isRejectedActive, setIsRejectedActive] = useState(false)
	const [isRubricSet, setIsRubricSet] = useState(true)
	const [isSetupEvaluationBoxOpen, setIsSetupEvaluationBoxOpen] = useState(true)

	const { data: accountData } = useAccount()
	const router = useRouter()
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

	const [rubricDrawerOpen, setRubricDrawerOpen] = useState(false)
	const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false)
	const [maximumPoints, setMaximumPoints] = React.useState(5)
	const [rubricEditAllowed] = useState(true)
	const [rubrics, setRubrics] = useState<any[]>([
		{
			name: '',
			nameError: false,
			description: '',
			descriptionError: false,
		},
	])

	useEffect(() => {
		if(router && router.query) {
			const { grantId: gId } = router.query
			setGrantID(gId)
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client:
			subgraphClients[
				getSupportedChainIdFromWorkspace(workspace) || defaultChainId
			].client,
	})

	const [queryReviewerParams, setQueryReviewerParams] = useState<any>({
		client:
			subgraphClients[
				getSupportedChainIdFromWorkspace(workspace) || defaultChainId
			].client,
		//   variables:{
		// 	  grantID: grantID
		//   }
	})

	const [queryFundsParams, setQueryFundsParams] = useState<any>({
		client:
			subgraphClients[
				getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
			].client,
	})

	useEffect(() => {
		if(
			workspace &&
			workspace.members &&
			workspace.members.length > 0 &&
			accountData &&
			accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase()
			)
			console.log(tempMember)
			setIsAdmin(
				tempMember?.accessLevel === 'admin' ||
				tempMember?.accessLevel === 'owner'
			)

			setIsReviewer(tempMember?.accessLevel === 'reviewer')
			setIsUser(tempMember?.id)
			setIsActorId(tempMember?.id)
		}
	}, [accountData, workspace])

	useEffect(() => {
		if(!workspace) {
			return
		}

		if(!grantID) {
			return
		}

		console.log('Grant ID: ', grantID)
		console.log('isUser: ', isUser)
		if(isAdmin) {
			setQueryParams({
				client:
					subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
				variables: {
					grantID,
					first: PAGE_SIZE,
					skip: 0,
				},
			})

			setQueryFundsParams({
				client:
					subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
				variables: {
					grantID,
				},
			})
		}

		if(isReviewer) {
			console.log('reviewer', isUser)
			setQueryReviewerParams({
				client:
					subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
				variables: {
					grantID,
					reviewerIDs: [isUser],
					first: PAGE_SIZE,
					skip: 0,
				},
			})
		}
	}, [workspace, grantID, isUser])

	const { data, error, loading } = useGetApplicantsForAGrantQuery(queryParams)
	const { data: grantData } = useGetGrantDetailsQuery(queryParams)
	const { data: fundsDisbursed } = useGetFundSentDisburseforGrantQuery(queryFundsParams)

	useEffect(() => {
		if(data && data.grantApplications.length) {
			const fetchedApplicantsData = data.grantApplications.map((applicant) => {
				const getFieldString = (name: string) => applicant.fields.find((field) => field?.id?.includes(`.${name}`))
					?.values[0]?.value
				let decimal
				let label
				let icon
				if(grantData?.grants[0].reward.token) {
					decimal = grantData?.grants[0].reward.token.decimal
					label = grantData?.grants[0].reward.token.label
					icon = getUrlForIPFSHash(grantData?.grants[0].reward.token.iconHash)
				} else {
					decimal =
						CHAIN_INFO[
							getSupportedChainIdFromSupportedNetwork(
								applicant.grant.workspace.supportedNetworks[0]
							)
						]?.supportedCurrencies[applicant.grant.reward.asset.toLowerCase()]
							?.decimals
					label = getAssetInfo(
						applicant?.grant?.reward?.asset?.toLowerCase(),
						getSupportedChainIdFromWorkspace(workspace)
					).label
					icon = getAssetInfo(
						applicant?.grant?.reward?.asset?.toLowerCase(),
						getSupportedChainIdFromWorkspace(workspace)
					).icon
				}

				setRewardTokenDecimals(decimal)
				return {
					grantTitle: applicant?.grant?.title,
					applicationId: applicant.id,
					applicant_address: applicant.applicantId,
					sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
					updated_on: moment.unix(applicant.updatedAtS).format('DD MMM YYYY'),
					// applicant_name: getFieldString('applicantName'),
					project_name: getFieldString('projectName'),
					funding_asked: {
						// amount: formatAmount(
						//   getFieldString('fundingAsk') || '0',
						// ),
						amount:
							applicant && getFieldString('fundingAsk') ? formatAmount(
								getFieldString('fundingAsk')!,
								decimal || 18,
							) : '1',
						symbol: label,
						icon,
					},
					// status: applicationStatuses.indexOf(applicant?.state),
					status: TableFilters[applicant?.state],
					reviewers: applicant.reviewers,
					amount_paid: formatAmount(
						getTotalFundingRecv(
							applicant.milestones as unknown as ApplicationMilestone[]
						).toString(),
						decimal || 18,
					),
				}
			})

			console.log('fetch', fetchedApplicantsData)

			setApplicantsData(fetchedApplicantsData)
			setDaoId(data.grantApplications[0].grant.workspace.id)
			setAcceptingApplications(
				data.grantApplications[0].grant.acceptingApplications
			)
		}

		setGrantTitle(grantData?.grants[0]?.title)
	}, [data, error, loading, grantData])

	useEffect(() => {
		console.log('Review params: ', queryReviewerParams)
	}, [queryReviewerParams])

	const reviewData =
		useGetApplicantsForAGrantReviewerQuery(queryReviewerParams)

	const Reviewerstatus = (item: any) => {
		const user = []
		// eslint-disable-next-line no-restricted-syntax
		for(const n in item) {
			if(item[n].reviewer.id === isActorId) {
				user.push(isActorId)
			}
		}

		if(user.length === 1) {
			return 9
		}

		return 0
	}

	useEffect(() => {
		console.log('Raw reviewer data: ', reviewData)
		if(reviewData.data && reviewData.data.grantApplications.length) {
			console.log('Reviewer Applications: ', reviewData.data)
			const fetchedApplicantsData = reviewData.data.grantApplications.map((applicant) => {
				const getFieldString = (name: string) => applicant.fields.find((field) => field?.id?.includes(`.${name}`))?.values[0]?.value
				return {
					grantTitle: applicant?.grant?.title,
					applicationId: applicant.id,
					applicant_address: applicant.applicantId,
					sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
					project_name: getFieldString('projectName'),
					funding_asked: {
						// amount: formatAmount(
						//   getFieldString('fundingAsk') || '0',
						// ),
						amount:
							applicant && getFieldString('fundingAsk') ? formatAmount(
								getFieldString('fundingAsk')!,
								CHAIN_INFO[
									getSupportedChainIdFromSupportedNetwork(
										applicant.grant.workspace.supportedNetworks[0],
									)
								]?.supportedCurrencies[applicant.grant.reward.asset.toLowerCase()]
									?.decimals || 18,
							) : '1',
						symbol: getAssetInfo(
							applicant?.grant?.reward?.asset?.toLowerCase(),
							getSupportedChainIdFromWorkspace(workspace),
						).label,
						icon: getAssetInfo(
							applicant?.grant?.reward?.asset?.toLowerCase(),
							getSupportedChainIdFromWorkspace(workspace),
						).icon,
					},
					// status: applicationStatuses.indexOf(applicant?.state),
					status: Reviewerstatus(applicant.reviews),
					reviewers: applicant.reviewers,
				}
			}
			)

			console.log('fetch', fetchedApplicantsData)

			setReviewerData(fetchedApplicantsData)
			setDaoId(reviewData.data.grantApplications[0].grant.workspace.id)
			setAcceptingApplications(
				reviewData.data.grantApplications[0].grant.acceptingApplications
			)
		}
	}, [reviewData])

	// const { data: grantData } = useGetGrantDetailsQuery(queryParams);
	useEffect(() => {
		console.log('grantData', grantData)
		const initialRubrics = grantData?.grants[0]?.rubric
		const newRubrics = [] as any[]
		console.log('initialRubrics', initialRubrics)
		initialRubrics?.items.forEach((initalRubric) => {
			newRubrics.push({
				name: initalRubric.title,
				nameError: false,
				description: initalRubric.details,
				descriptionError: false,
			})
		})
		if(newRubrics.length === 0) {
			setIsRubricSet(false)
			return
		}

		setIsRubricSet(true)
		setRubrics(newRubrics)
		if(initialRubrics?.items[0].maximumPoints) {
			setMaximumPoints(initialRubrics.items[0].maximumPoints)
		}
	}, [grantData])

	useEffect(() => {
		const total = fundsDisbursed?.fundsTransfers.reduce(
			(sum, { amount }) => sum + parseInt(amount), 0
		)
		if(total) {
			setTotalDisbursed(total / (10 ** rewardTokenDecimals))
		}
	}, [fundsDisbursed])

	useEffect(() => {
		setShouldShowButton(daoId === workspace?.id)
	}, [workspace, accountData, daoId])

	const [isAcceptingApplications, setIsAcceptingApplications] = React.useState<
		[boolean, number]
	>([acceptingApplications, 0])

	useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])
	}, [acceptingApplications])

	const [transactionData, txnLink, archiveGrantLoading, archiveGrantError] =
		useArchiveGrant(
			isAcceptingApplications[0],
			isAcceptingApplications[1],
			grantID
		)

	const buttonRef = React.useRef<HTMLButtonElement>(null)

	const { setRefresh } = useCustomToast(txnLink)
	useEffect(() => {
		// console.log(transactionData);
		if(transactionData) {
			setIsModalOpen(false)
			setRefresh(true)
		}
	}, [transactionData])

	React.useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])
	}, [archiveGrantError])

	React.useEffect(() => {
		console.log('Is Accepting Applications: ', isAcceptingApplications)
	}, [isAcceptingApplications])

	return (
		<Container
			maxW="100%"
			display="flex"
			flexDirection="column"
			bg="#F0F0F7"
			pl={10}
		>
			<Container
				flex={1}
				display="flex"
				flexDirection="column"
				maxW="100%"
				maxH="300"
				px={10}
				pos="relative"
				pl={0}
				pr={0}
			>
				<Flex ml={0}>
					{' '}
					<Breadcrumbs path={['Grants & Bounties', 'Applicants']} />
				</Flex>
				<Flex
					pl={0}
					ml={0}
					mb={5}>
					<Box
						p='2'
						pl={0}>
						<Heading size='lg'>
							{grantTitle}
						</Heading>
					</Box>
					<Spacer />
					<Menu >
						<MenuButton
							mr={5}
							as={Button}
							backgroundColor="#E0E0EC" >
							<Image src="/ui_icons/grant_options_dropdown.svg" />
						</MenuButton>
						<MenuList>
							<MenuGroup
								title='Grant options'
								color="#7D7DA0">
								<MenuItem onClick={() => setRubricDrawerOpen(true)}>
									<Image
										src="/ui_icons/grant_options_setup_evaluation.svg"
										mr="12px" />
									{' '}

									Setup application evaluation
									{' '}

								</MenuItem>
								<MenuItem onClick={() => setIsArchiveModalOpen(true)}>
									<Image
										src="/ui_icons/grant_options_archive_grant.svg"
										mr="12px" />
									{' '}

									Archive grant
									{' '}

								</MenuItem>
							</MenuGroup>
						</MenuList>
					</Menu>
				</Flex>

				<GrantStatsBox
					numberOfApplicants={applicantsData.length}
					totalDisbursed={totalDisbursed}
					numberOfReviews={reviewsData.length}
				/>


			</Container>
			{
				(reviewerData.length > 0 || applicantsData.length > 0) && (isReviewer || isAdmin) ? (
					<Flex direction="column">
						{
							isRubricSet && (
								<HStack spacing='24px'>
									<Box
										as="button"
										w='128px'
										h='28px'
										font-style='normal'
										font-weight='400'
										font-size='14px'
										line-height='20px'
										textColor={isAcceptedActive ? '#FFFFFF' : '#1F1F33'}
										bg={isAcceptedActive ? '#1F1F33' : '#E0E0EC'}
										onClick={
											() => {
												setIsAcceptedActive(!isAcceptedActive), setIsInReviewActive(false), setIsRejectedActive(false), setApplicationsFilter('Accepted')
											}
										}>
										{' '}
										Accepted
										{' '}
									</Box>
									<Box
										as="button"
										w='128px'
										h='28px'
										font-style='normal'
										font-weight='400'
										font-size='14px'
										line-height='20px'
										textColor={isInReviewActive ? '#FFFFFF' : '#1F1F33'}
										bg={isInReviewActive ? '#1F1F33' : '#E0E0EC'}
										onClick={
											() => {
												setIsAcceptedActive(false), setIsInReviewActive(!isInReviewActive), setIsRejectedActive(false), setApplicationsFilter('In Review')
											}
										}>
										{' '}
										In Review
										{' '}
									</Box>
									<Box
										as="button"
										w='128px'
										h='28px'
										font-style='normal'
										font-weight='400'
										font-size='14px'
										line-height='20px'
										textColor={isRejectedActive ? '#FFFFFF' : '#1F1F33'}
										bg={isRejectedActive ? '#1F1F33' : '#E0E0EC'}
										onClick={
											() => {
												setIsAcceptedActive(false), setIsInReviewActive(false), setIsRejectedActive(!isRejectedActive), setApplicationsFilter('Rejected')
											}
										}>
										{' '}
										Rejected
										{' '}
									</Box>
								</HStack>
							)
						}


						{
							!isRubricSet && isSetupEvaluationBoxOpen && (
								<Flex
									flexDirection="row"
									backgroundColor="#E3DDF2"
									alignItems="flex-start"
									padding="16px"
									gap="16px">
									<Flex flexDirection="row">
										<Flex flexDirection="column" >
											<Image
												src="/ui_icons/reverse_exclamation.svg"
												mr="8.33" />
										</Flex>
										<Box>
											<Text
												fontWeight="500"
												fontSize="16px"
												lineHeight="20px"
												color="#1F1F33">
												Setup application evaluation
											</Text>
											<Text
												fontWeight="400"
												fontSize="14px"
												lineHeight="20px"
												color="#1F1F33">
												On receiving applicants, define a scoring rubric and assign reviewers to evaluate the applicants.
												<Text
													as="span"
													color="#1F1F33"
													fontWeight="500"
													fontSize="14px"
													lineHeight="20px">
													{' '}
													Learn more
													{' '}
												</Text>
											</Text>
											<Text
												fontWeight="500"
												fontSize="14px"
												lineHeight="20px"
												color="#7356BF"
												as="button"
												onClick={() => setRubricDrawerOpen(true)}>
												Setup now
											</Text>
										</Box>
									</Flex>
									<Spacer />
									<Flex flexDirection="column" >
										<Box as="button">
											<Image
												src="/ui_icons/close_drawer.svg"
												onClick={() => setIsSetupEvaluationBoxOpen(false)} />
										</Box>
									</Flex>
								</Flex>
							)
						}
						<ApplicantsTable
							isReviewer={isReviewer}
							data={applicantsData}
							reviewerData={reviewerData}
							actorId={isActorId}
							applicationsFilter={applicationsFilter}
							onViewApplicantFormClick={
								(commentData: any) => router.push({
									pathname: '/your_grants/view_applicants/applicant_form/',
									query: {
										commentData,
										applicationId: commentData.applicationId,
									},
								})
							}
							// eslint-disable-next-line @typescript-eslint/no-shadow
							onManageApplicationClick={
								(data: any) => router.push({
									pathname: '/your_grants/view_applicants/manage/',
									query: {
										applicationId: data.applicationId,
									},
								})
							}
							archiveGrantComponent={
								!acceptingApplications && (
									<Flex
										maxW="100%"
										bg="#F3F4F4"
										direction="row"
										align="center"
										px={8}
										py={6}
										mt={6}
										border="1px solid #E8E9E9"
										borderRadius="6px"
									>
										<Image
											src="/toast/warning.svg"
											w="42px"
											h="36px" />
										<Flex
											maxW="100%"
											bg="#F3F4F4"
											direction="row"
											align="center"
											px={8}
											py={6}
											mt={6}
											border="1px solid #E8E9E9"
											borderRadius="6px"
										>
											<Image
												src="/toast/warning.svg"
												w="42px"
												h="36px" />
											<Flex
												direction="column"
												ml={6}>
												<Text
													variant="tableHeader"
													color="#414E50">
													{
														shouldShowButton && accountData?.address
															? 'Grant is archived and cannot be discovered on the Home page.'
															: 'Grant is archived and closed for new applications.'
													}
												</Text>
												<Text
													variant="tableBody"
													color="#717A7C"
													fontWeight="400"
													mt={2}
												>
													New applicants cannot apply to an archived grant.
												</Text>
											</Flex>
											<Box mr="auto" />
											{
												accountData?.address && shouldShowButton && (
													<Button
														ref={buttonRef}
														w={
															archiveGrantLoading
																? buttonRef?.current?.offsetWidth
																: 'auto'
														}
														variant="primary"
														onClick={() => setIsModalOpen(true)}
													>
														Publish grant
													</Button>
												)
											}
										</Flex>
									</Flex>
								)
							}
						/>
					</Flex>
				) : (
					<Flex
						direction="column"
						maxW="100%"
						backgroundColor="#FFFFFF"
						boxShadow='0px 2px 12px rgba(31, 31, 51, 0.05), 0px 0px 2px rgba(31, 31, 51, 0.2)'
						borderRadius='4px'
					>
						<AppplicationTableEmptyState />
						{
							isAdmin && (
								<Flex
									direction="column"
									justify="center"
									h="100%"
									align="center"
									backgroundColor="#F0F0F7"
									mx="auto"
									mt={20}
									mb={20}
								>

									<Button
										variant="primaryV2"
										onClick={() => setRubricDrawerOpen(true)}
									>
										Setup application evaluation
									</Button>

								</Flex>
							)
						}
					</Flex>
				)
			}

			<RubricDrawer
				rubricDrawerOpen={rubricDrawerOpen}
				setRubricDrawerOpen={setRubricDrawerOpen}
				rubricEditAllowed={rubricEditAllowed}
				rubrics={rubrics}
				setRubrics={setRubrics}
				maximumPoints={maximumPoints}
				setMaximumPoints={setMaximumPoints}
				chainId={getSupportedChainIdFromWorkspace(workspace) || defaultChainId}
				grantAddress={grantID}
				workspaceId={workspace?.id || ''}
				initialIsPrivate={grantData?.grants[0]?.rubric?.isPrivate || false}
			/>

			<Modal
				isOpen={acceptingApplications ? isArchiveModalOpen : false}
				onClose={
					() => (acceptingApplications
						? setIsArchiveModalOpen(false)
						: () => { })
				}
				title=""
			>
				<ChangeAccessibilityModalContent
					onClose={
						() => (acceptingApplications
							? setIsArchiveModalOpen(false)
							: () => { })
					}
					imagePath={`/illustrations/${acceptingApplications ? 'archive' : 'publish'}_grant.svg`}
					title={acceptingApplications ? 'Are you sure you want to archive this grant?' : 'Are you sure you want to publish this grant?'}
					subtitle={acceptingApplications ? 'The grant will no longer be visible to anyone. You will not receive any new applications for it.' : 'The grant will be live, and applicants can apply for this grant.'}
					actionButtonText={acceptingApplications ? 'Arcive Grant' : 'Publish Grant'}
					actionButtonOnClick={
						() => {
							setIsAcceptingApplications([
								!isAcceptingApplications[0],
								isAcceptingApplications[1] + 1,
							])
						}
					}
					loading={loading}
				/>
			</Modal>
		</Container>
	)
}

ViewApplicants.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ViewApplicants
