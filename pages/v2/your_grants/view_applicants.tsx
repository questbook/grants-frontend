import React, {
	ReactElement, useContext, useEffect, useState,
} from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Container, Flex, forwardRef, IconButton, IconButtonProps, Link, Menu, MenuButton, MenuItem, MenuList, TabList, TabPanel, TabPanels, Tabs, Text
} from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Modal from 'src/components/ui/modal'
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters'
import ChangeAccessibilityModalContent from 'src/components/your_grants/yourGrantCard/changeAccessibilityModalContent'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import {
	useGetApplicantsForAGrantQuery,
	useGetApplicantsForAGrantReviewerQuery,
	useGetGrantDetailsQuery,
} from 'src/generated/graphql'
import useArchiveGrant from 'src/hooks/useArchiveGrant'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import NavbarLayout from 'src/layout/navbarLayout'
import { ApplicationMilestone } from 'src/types'
import { formatAddress, formatAmount } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { ArchiveGrant } from 'src/v2/assets/custom chakra icons/ArchiveGrant'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { EditPencil } from 'src/v2/assets/custom chakra icons/EditPencil'
import { ErrorAlert } from 'src/v2/assets/custom chakra icons/ErrorAlertV2'
import { ThreeDotsHorizontal } from 'src/v2/assets/custom chakra icons/ThreeDotsHorizontal'
import { ViewEye } from 'src/v2/assets/custom chakra icons/ViewEye'
import Breadcrumbs from 'src/v2/components/Breadcrumbs'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import StyledTab from 'src/v2/components/StyledTab'
import AcceptedProposalsPanel from 'src/v2/payouts/AcceptedProposals/AcceptedProposalPanel'
import InReviewPanel from 'src/v2/payouts/InReviewProposals/InReviewPanel'
import RejectedPanel from 'src/v2/payouts/RejectedProposals/RejectedPanel'
import SendFundsDrawer from 'src/v2/payouts/SendFundsDrawer/SendFundsDrawer'
import SendFundsModal from 'src/v2/payouts/SendFundsModal/SendFundsModal'
import SetupEvaluationDrawer from 'src/v2/payouts/SetupEvaluationDrawer/SetupEvaluationDrawer'
import StatsBanner from 'src/v2/payouts/StatsBanner'
import TransactionInitiatedModal from 'src/v2/payouts/TransactionInitiatedModal'
import ViewEvaluationDrawer from 'src/v2/payouts/ViewEvaluationDrawer/ViewEvaluationDrawer'
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

	const [setupRubricBannerCancelled, setSetupRubricBannerCancelled] = useState(true)

	const { data: accountData } = useAccount()
	const router = useRouter()
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

	const [rubricDrawerOpen, setRubricDrawerOpen] = useState(false)
	const [viewRubricDrawerOpen, setViewRubricDrawerOpen] = useState(false)

	const [sendFundsTo, setSendFundsTo] = useState<any[]>()

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
	})

	const [sendFundsModalIsOpen, setSendFundsModalIsOpen] = useState(false)
	const [sendFundsDrawerIsOpen, setSendFundsDrawerIsOpen] = useState(false)
	const [txnInitModalIsOpen, setTxnInitModalIsOpen] = useState(false)

	useEffect(() => {
		if(
			workspace
			&& workspace.members
			&& workspace.members.length > 0
			&& accountData
			&& accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			console.log(tempMember)
			setIsAdmin(
				tempMember?.accessLevel === 'admin'
				|| tempMember?.accessLevel === 'owner',
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
	useEffect(() => {
		console.log('fetch', data)
		if(data && data.grantApplications.length) {
			const fetchedApplicantsData = data.grantApplications.map((applicant) => {
				const getFieldString = (name: string) => applicant.fields.find((field) => field?.id?.includes(`.${name}`))?.values[0]?.value
				let decimal
				let label
				let icon
				if(!(grantData?.grants[0].rubric?.items.length ?? true)) {
					setSetupRubricBannerCancelled(false)
				}

				if(grantData?.grants[0].reward.token) {
					decimal = grantData?.grants[0].reward.token.decimal
					label = grantData?.grants[0].reward.token.label
					icon = getUrlForIPFSHash(grantData?.grants[0].reward.token.iconHash)
				} else {
					decimal = CHAIN_INFO[
						getSupportedChainIdFromSupportedNetwork(
							applicant.grant.workspace.supportedNetworks[0],
						)
					]?.supportedCurrencies[applicant.grant.reward.asset.toLowerCase()]
						?.decimals
					label = getAssetInfo(
						applicant?.grant?.reward?.asset?.toLowerCase(),
						getSupportedChainIdFromWorkspace(workspace),
					).label
					icon = getAssetInfo(
						applicant?.grant?.reward?.asset?.toLowerCase(),
						getSupportedChainIdFromWorkspace(workspace),
					).icon
				}

				return {
					grantTitle: applicant?.grant?.title,
					applicationId: applicant.id,
					applicantName: getFieldString('applicantName'),
					applicantEmail: getFieldString('applicantEmail'),
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
					reviewers: applicant.applicationReviewers,
					amount_paid: formatAmount(
						getTotalFundingRecv(
							applicant.milestones as unknown as ApplicationMilestone[],
						).toString(),
						decimal || 18,
					),
					reviews: applicant.reviews
				}
			})

			console.log('fetch', fetchedApplicantsData)

			setApplicantsData(fetchedApplicantsData)
			setDaoId(data.grantApplications[0].grant.workspace.id)
			setAcceptingApplications(data.grantApplications[0].grant.acceptingApplications)
		}

	}, [data, error, loading, grantData])

	useEffect(() => {
		console.log('Review params: ', queryReviewerParams)
	}, [queryReviewerParams])

	const reviewData = useGetApplicantsForAGrantReviewerQuery(queryReviewerParams)

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
					reviewers: applicant.applicationReviewers,
				}
			})

			console.log('fetch', fetchedApplicantsData)

			setReviewerData(fetchedApplicantsData)
			setDaoId(reviewData.data.grantApplications[0].grant.workspace.id)
			setAcceptingApplications(reviewData.data.grantApplications[0].grant.acceptingApplications)
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
			return
		}

		setRubrics(newRubrics)
		if(initialRubrics?.items[0].maximumPoints) {
			setMaximumPoints(initialRubrics.items[0].maximumPoints)
		}
	}, [grantData])

	useEffect(() => {
		setShouldShowButton(daoId === workspace?.id)
	}, [workspace, accountData, daoId])

	const [isAcceptingApplications, setIsAcceptingApplications] = React.useState<
		[boolean, number]
	>([acceptingApplications, 0])

	useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])
	}, [acceptingApplications])

	const [transactionData, txnLink, archiveGrantLoading, archiveGrantError] = useArchiveGrant(
		isAcceptingApplications[0],
		isAcceptingApplications[1],
		grantID,
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

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = React.useState<number>()

	return (
		<Container
			maxW="100%"
			display="flex"
			pb="300px"
			px={0}
			minH={'calc(100vh - 64px)'}
			bg={'#FBFBFD'}
		>
			<Container
				flex={1}
				display="flex"
				flexDirection="column"
				maxW="1116px"
				alignItems="stretch"
				pb={8}
				px={8}
				pt={6}
				pos="relative"
			>
				<Breadcrumbs path={['My Grants', 'View Applicants']} />

				<Flex>
					<Text
						mt={1}
						mr='auto'
						fontSize='24px'
						lineHeight='32px'
						fontWeight='500'
					>
						{applicantsData[0]?.grantTitle || 'Grant Title'}
					</Text>

					{
						isAdmin && (
							<Menu>
								<MenuButton
									as={
										forwardRef<IconButtonProps, 'div'>((props, ref) => (
											<IconButton
												borderRadius='2.25px'
												mt='auto'
												h={6}
												w={6}
												minW={0}
												onClick={() => setRubricDrawerOpen(true)}
												icon={
													<ThreeDotsHorizontal
														h={'3px'}
														w={'13.5px'} />
												}
												{...props}
												ref={ref}
												aria-label='options'
											/>
										))
									}
								/>
								<MenuList
									minW={'240px'}
									py={0}>
									<Flex
										bg={'#F0F0F7'}
										px={4}
										py={2}
									>
										<Text
											fontSize='14px'
											lineHeight='20px'
											fontWeight='500'
											textAlign='center'
											color={'#555570'}
										>
											Grant options
										</Text>
									</Flex>
									<MenuItem
										px={'19px'}
										py={'10px'}
										onClick={
											() => (grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ?
												setViewRubricDrawerOpen(true) : setRubricDrawerOpen(true)
										}
									>
										{
											(grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ? (
												<ViewEye
													color={'#C8CBFC'}
													mr={'11px'} />
											) : (
												<EditPencil
													color={'#C8CBFC'}
													mr={'11px'} />
											)
										}
										<Text
											fontSize='14px'
											lineHeight='20px'
											fontWeight='400'
											textAlign='center'
											color={'#555570'}
										>
											{(grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ? 'View scoring rubric' : 'Setup applicant evaluation'}
										</Text>
									</MenuItem>
									<MenuItem
										px={'19px'}
										py={'10px'}
									>
										<ArchiveGrant
											color={'#C8CBFC'}
											mr={'11px'} />
										<Text
											fontSize='14px'
											lineHeight='20px'
											fontWeight='400'
											textAlign='center'
											color={'#555570'}
										>
											Archive grant
										</Text>
									</MenuItem>
								</MenuList>
							</Menu>
						)
					}
				</Flex>

				{/* {
					isAdmin && (
						<Box
							pos="absolute"
							right="40px"
							top="48px">
							<Button
								variant="primary"
								onClick={() => setRubricDrawerOpen(true)}>
								{(grantData?.grants[0].rubric?.items.length || 0) > 0 || false ? 'Edit Evaluation Rubric' : 'Setup Evaluation Rubric'}
							</Button>
						</Box>
					)
				} */}

				<Box mt={4} />

				<StatsBanner
					funds={0}
					reviews={0}
					totalReviews={0}
					applicants={applicantsData.length}
				/>

				<Box mt={5} />

				{
					setupRubricBannerCancelled || (((grantData?.grants && grantData?.grants.length > 0 && grantData?.grants[0].rubric?.items.length) || 0) > 0 || false) ? <></> : (
						<>
							<Flex
								px={'18px'}
								py={4}
								bg={'#C8CBFC'}
								borderRadius={'base'}
							>
								<ErrorAlert
									color={'#785EF0'}
									boxSize={5}
									mt={'2px'}
								/>

								<Flex
									flexDirection='column'
									ml={'18px'}
									flex={1}
								>
									<Text
										fontSize={'16px'}
										lineHeight='24px'
										fontWeight='500'
									>
										Setup applicant evaluation
									</Text>

									<Text
										mt={'8px'}
										fontSize={'14px'}
										lineHeight='20px'
										fontWeight='400'
									>
										On receiving applicants, define a scoring rubric and assign reviewers to evaluate the applicants.
										{' '}
										<Link
											textDecoration={'none'}
											fontWeight='500'
											color='#1F1F33'
										>
											Learn more
										</Link>
									</Text>

									<Text
										mt={'14px'}
										fontSize={'14px'}
										lineHeight='20px'
										fontWeight='500'
										color='#785EF0'
										cursor='pointer'
										onClick={() => setRubricDrawerOpen(true)}
									>
										Setup now
									</Text>
								</Flex>

								<CancelCircleFilled
									mb='auto'
									color='#7D7DA0'
									h={6}
									w={6}
									onClick={
										() => {
											setSetupRubricBannerCancelled(true)
										}
									}
									cursor='pointer'
								/>
							</Flex>
							<Box mt={5} />
						</>
					)
				}


				<Tabs
					h={8}
					colorScheme='brandv2'>
					<TabList>
						<StyledTab label={`Accepted (${applicantsData.filter((item: any) => (2 === item.status)).length})`} />
						<StyledTab label={`In Review (${applicantsData.filter((item: any) => (0 === item.status)).length})`} />
						<StyledTab label={`Rejected (${applicantsData.filter((item: any) => (3 === item.status)).length})`} />
						<StyledTab label={`Asked to Resubmit (${applicantsData.filter((item: any) => (1 === item.status)).length})`} />
					</TabList>

					<TabPanels>
						<TabPanel
							borderRadius={'2px'}
							p={0}
							mt={5}
							bg={'white'}
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7' >
							<AcceptedProposalsPanel
								applicantsData={applicantsData}
								onSendFundsClicked={
									(v, c) => {
										console.log(c)
										setSendFundsModalIsOpen(v)
										setSendFundsTo(c)
									}
								}
								onBulkSendFundsClicked={
									(v, c) => {
										console.log(c)
										setSendFundsTo(c)
										setSendFundsDrawerIsOpen(v)
									}
								}
								grantData={grantData}
							/>
						</TabPanel>

						<TabPanel
							tabIndex={1}
							borderRadius={'2px'}
							p={0}
							mt={5}
							bg={'white'}
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
							<InReviewPanel
								applicantsData={applicantsData}
								onSendFundsClicked={(v) => setSendFundsModalIsOpen(v)} />
						</TabPanel>

						<TabPanel
							tabIndex={2}
							borderRadius={'2px'}
							p={0}
							mt={5}
							bg={'white'}
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
							<RejectedPanel
								applicantsData={applicantsData}
								onSendFundsClicked={(v) => setSendFundsModalIsOpen(v)} />
						</TabPanel>


					</TabPanels>
				</Tabs>

				{/* <RubricDrawer
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
					initialIsPrivate={grantData?.grants[0].rubric?.isPrivate || false}
				/> */}

				<SetupEvaluationDrawer
					isOpen={rubricDrawerOpen}
					onClose={() => setRubricDrawerOpen(false)}
					onComplete={() => setRubricDrawerOpen(false)}
					grantAddress={grantID}
					chainId={getSupportedChainIdFromWorkspace(workspace) || defaultChainId}
					setNetworkTransactionModalStep={setNetworkTransactionModalStep}
				/>

				<ViewEvaluationDrawer
					isOpen={viewRubricDrawerOpen}
					grantData={grantData}
					onClose={() => setViewRubricDrawerOpen(false)}
					onComplete={() => setViewRubricDrawerOpen(false)}
				/>

				<SendFundsModal
					isOpen={sendFundsModalIsOpen}
					onClose={() => setSendFundsModalIsOpen(false)}
					// @ts-expect-error
					safeAddress={workspace?.safeAddress ?? 'HWuCwhwayTaNcRtt72edn2uEMuKCuWMwmDFcJLbah3KC'}
					onComplete={
						() => {
							setSendFundsModalIsOpen(false)
							setTxnInitModalIsOpen(true)
						}
					}
					proposals={sendFundsTo ?? []}
				/>

				<TransactionInitiatedModal
					isOpen={txnInitModalIsOpen}
					onClose={() => setTxnInitModalIsOpen(false)}
					onComplete={() => setTxnInitModalIsOpen(false)}
				/>

				<SendFundsDrawer
					isOpen={sendFundsDrawerIsOpen}
					onClose={() => setSendFundsDrawerIsOpen(false)}
					onComplete={
						() => {
							setSendFundsDrawerIsOpen(false)
							setTxnInitModalIsOpen(true)
							setSendFundsTo(undefined)
						}
					}
					// @ts-expect-error
					safeAddress={workspace?.safeAddress ?? 'HWuCwhwayTaNcRtt72edn2uEMuKCuWMwmDFcJLbah3KC'}
					proposals={sendFundsTo ?? []}
				/>

				<NetworkTransactionModal
					isOpen={networkTransactionModalStep !== undefined}
					subtitle='Creating scoring rubric'
					description={
						<Flex
							direction="column"
							w='100%'
							align="start">
							<Text
								fontWeight={'500'}
								fontSize={'17px'}
							>
								{grantData && grantData?.grants && grantData?.grants.length > 0 && grantData?.grants[0].title}
							</Text>

							<Button
								rightIcon={<ExternalLinkIcon />}
								variant="linkV2"
								bg='#D5F1EB'>
								{grantID && formatAddress(grantID)}
							</Button>
						</Flex>
					}
					currentStepIndex={networkTransactionModalStep || 0}
					steps={
						[
							'Connect your wallet',
							'Uploading rubric data to IPFS',
							'Setting rubric and enabling auto assignment of reviewers',
							'Waiting for transaction to complete',
							'Rubric created and Reviewers assigned',
						]
					} />

				{/* {
					(reviewerData.length > 0 || applicantsData.length > 0) && (isReviewer || isAdmin) ? (
						<Table
							title={applicantsData[0]?.grantTitle || 'Grant Title'}
							isReviewer={isReviewer}
							data={applicantsData}
							reviewerData={reviewerData}
							actorId={isActorId}
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
											direction="column"
											ml={6}>
											<Text
												variant="tableHeader"
												color="#414E50">
												{shouldShowButton && accountData?.address ? 'Grant is archived and cannot be discovered on the Home page.' : 'Grant is archived and closed for new applications.'}
											</Text>
											<Text
												variant="tableBody"
												color="#717A7C"
												fontWeight="400"
												mt={2}>
                  New applicants cannot apply to an archived grant.
											</Text>
										</Flex>
										<Box mr="auto" />
										{
											accountData?.address && shouldShowButton && (
												<Button
													ref={buttonRef}
													w={archiveGrantLoading ? buttonRef?.current?.offsetWidth : 'auto'}
													variant="primary"
													onClick={() => setIsModalOpen(true)}
												>
                Publish grant
												</Button>
											)
										}
									</Flex>
								)
							}
						/>
					) : (
						<AppplicationTableEmptyState />

					)
				} */}

			</Container>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title=""
			>
				<ChangeAccessibilityModalContent
					onClose={() => setIsModalOpen(false)}
					imagePath="/illustrations/publish_grant.svg"
					title="Are you sure you want to publish this grant?"
					subtitle="The grant will be live, and applicants can apply for this grant."
					actionButtonText="Publish grant"
					actionButtonOnClick={
						() => {
							console.log('Doing it!')
							console.log('Is Accepting Applications (Button click): ', isAcceptingApplications)
							setIsAcceptingApplications([
								!isAcceptingApplications[0],
								isAcceptingApplications[1] + 1,
							])
						}
					}
					loading={archiveGrantLoading}
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
