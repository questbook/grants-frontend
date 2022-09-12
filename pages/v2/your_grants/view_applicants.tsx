import React, {
	ReactElement, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Container, Flex, forwardRef, IconButton, IconButtonProps, Menu, MenuButton, MenuItem, MenuList, TabList, TabPanel, TabPanels, Tabs, Text
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
	useGetGrantDetailsQuery,
	useGetRealmsFundTransferDataQuery,
	useGetReviewersForAWorkspaceQuery,
	useGetSafeForAWorkspaceQuery,
} from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useArchiveGrant from 'src/hooks/useArchiveGrant'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import NavbarLayout from 'src/layout/navbarLayout'
import { ApplicationMilestone } from 'src/types'
import { formatAddress, formatAmount, getExplorerUrlForTxHash, getFieldString } from 'src/utils/formattingUtils'
import { isPlausibleSolanaAddress } from 'src/utils/generics'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { ArchiveGrant } from 'src/v2/assets/custom chakra icons/ArchiveGrant'
import { EditPencil } from 'src/v2/assets/custom chakra icons/EditPencil'
import { ThreeDotsHorizontal } from 'src/v2/assets/custom chakra icons/ThreeDotsHorizontal'
import { ViewEye } from 'src/v2/assets/custom chakra icons/ViewEye'
import Breadcrumbs from 'src/v2/components/Breadcrumbs'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import StyledTab from 'src/v2/components/StyledTab'
import NoReviewerBanner from 'src/v2/components/ViewApplicants/NoReviewerBanner'
import RubricNotSetBanner from 'src/v2/components/ViewApplicants/RubricNotSetBanner'
import { GnosisSafe } from 'src/v2/constants/safe/gnosis_safe'
import { RealmsSolana, solanaToUsdOnDate } from 'src/v2/constants/safe/realms_solana'
import safeServicesInfo from 'src/v2/constants/safeServicesInfo'
import AcceptedProposalsPanel from 'src/v2/payouts/AcceptedProposals/AcceptedProposalPanel'
import InReviewPanel from 'src/v2/payouts/InReviewProposals/InReviewPanel'
import RejectedPanel from 'src/v2/payouts/RejectedProposals/RejectedPanel'
import ResubmitPanel from 'src/v2/payouts/ResubmitProposals/ResubmitPanel'
import SendFunds from 'src/v2/payouts/SendFunds'
import SetupEvaluationDrawer from 'src/v2/payouts/SetupEvaluationDrawer/SetupEvaluationDrawer'
import StatsBanner from 'src/v2/payouts/StatsBanner'
import ViewEvaluationDrawer from 'src/v2/payouts/ViewEvaluationDrawer/ViewEvaluationDrawer'
import getGnosisTansactionLink from 'src/v2/utils/gnosisUtils'
import getProposalUrl from 'src/v2/utils/phantomUtils'
import { erc20ABI, useAccount } from 'wagmi'


const PAGE_SIZE = 500

// const safeChainIds = Object.keys(safeServicesInfo)

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(milestone.amountPaid)
	})
	return val
}

function ViewApplicants() {
	const [applicantsData, setApplicantsData] = useState<any>([])
	// const [reviewerData, setReviewerData] = useState<any>([])
	// const [daoId, setDaoId] = useState('')
	const [grantID, setGrantID] = useState<any>(null)
	const [acceptingApplications, setAcceptingApplications] = useState(true)
	// const [shouldShowButton, setShouldShowButton] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
	const [isUser, setIsUser] = React.useState<any>('')
	// const [isActorId, setIsActorId] = React.useState<any>('')

	const [workspaceSafe, setWorkspaceSafe] = useState('')
	const [workspaceSafeChainId, setWorkspaceSafeChainId] = useState(0)

	const [setupRubricBannerCancelled, setSetupRubricBannerCancelled] = useState(false)
	const [addReviewerBannerCancelled, setAddReviewerBannerCancelled] = useState(false)

	const [listOfApplicationToTxnsHash, setListOfApplicationToTxnsHash] = useState({})
	const [applicationStatuses, setApplicationStatuses] = useState({})
	const [totalFundDisbursed, setTotalFundDisbursed] = useState(0)
	// const [totalMilestonesAmt, setTotalMilestonesAmt] = useState({})
	const [rubricDrawerOpen, setRubricDrawerOpen] = useState(false)
	const [viewRubricDrawerOpen, setViewRubricDrawerOpen] = useState(false)

	const [rewardAssetAddress, setRewardAssetAddress] = useState('')
	const [rewardAssetDecimals, setRewardAssetDecimals] = useState<number>()

	const [sendFundsTo, setSendFundsTo] = useState<any[]>()


	const { data: accountData, nonce } = useQuestbookAccount()
	const router = useRouter()
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

	const workspacechainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[workspacechainId]

	const { data: safeAddressData } = useGetSafeForAWorkspaceQuery({
		client,
		variables: {
			workspaceID: workspace?.id.toString()!,
		},
	})

	const [realmsQueryParams, setRealmsQueryParams] = useState<any>({ client })

	useEffect(() => {
		if (!grantID || !workspace) {
			return
		}

		setRealmsQueryParams({
			client,
			variables: { grantID: grantID },
		})

	}, [grantID, workspace])

	const { data: realmsFundTransferData } = useGetRealmsFundTransferDataQuery(realmsQueryParams)

	useEffect(() => {
		const applicationToTxnHashMap: { [applicationId: string]: [{ transactionHash: string, amount: number }] } = {}

		if (!realmsFundTransferData) {
			return
		}

		realmsFundTransferData?.grants[0]?.fundTransfers?.forEach((fundTransfer,) => {
			// console.log('TX HASH - ', i, fundTransfer.transactionHash)
			if (!applicationToTxnHashMap[fundTransfer?.application?.id!]) {
				applicationToTxnHashMap[fundTransfer?.application?.id!] = [{
					transactionHash: fundTransfer?.transactionHash!,
					amount: parseFloat(fundTransfer?.amount),
				}]
			} else {
				applicationToTxnHashMap[fundTransfer?.application?.id!].push({
					transactionHash: fundTransfer?.transactionHash!,
					amount: parseFloat(fundTransfer?.amount),
				})
			}
			// applicationToTxnHashMap[fundTransfer?.application?.id!] = {
			// 	transactionHash: fundTransfer?.transactionHash!,
			// 	amount: parseFloat(fundTransfer?.amount)
			// }
		})
		setListOfApplicationToTxnsHash(applicationToTxnHashMap)

	}, [realmsFundTransferData])


	useEffect(() => {
		if (safeAddressData) {
			const { workspaceSafes } = safeAddressData
			const safeAddress = workspaceSafes[0]?.address
			setWorkspaceSafe(safeAddress)
			setWorkspaceSafeChainId(parseInt(workspaceSafes[0]?.chainId))
		}
	}, [safeAddressData])


	useEffect(() => {
		if (router?.query) {
			const { grantId: gId } = router.query
			// console.log('fetch 100: ', gId)
			setGrantID(gId)
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client:
			subgraphClients[
				getSupportedChainIdFromWorkspace(workspace) || defaultChainId
			].client,
	})


	useEffect(() => {
		if ((workspace?.members?.length || 0) > 0
			&& accountData
			&& accountData.address
		) {
			const tempMember = workspace?.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			// console.log('fetch 500: ', tempMember)
			setIsAdmin(
				tempMember?.accessLevel === 'admin'
				|| tempMember?.accessLevel === 'owner',
			)

			setIsUser(tempMember?.id)
			// setIsActorId(tempMember?.id)
		}
	}, [accountData, workspace])

	useEffect(() => {
		if (!workspace) {
			return
		}

		if (!grantID) {
			return
		}

		// console.log('Grant ID: ', grantID)
		// console.log('isUser: ', isUser)
		// console.log('fetch: ', isAdmin, isReviewer)
		if (isAdmin) {
			// console.log('Setting query params')
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
	}, [workspace, grantID, isUser])

	const { data, error, loading } = useGetApplicantsForAGrantQuery(queryParams)
	const { data: grantData } = useGetGrantDetailsQuery(queryParams)
	useEffect(() => {
		if ((data?.grantApplications?.length || 0) > 0) {
			setRewardAssetAddress(data?.grantApplications[0]?.grant?.reward?.asset!)
			if (data?.grantApplications[0].grant.reward.token) {
				setRewardAssetDecimals(data?.grantApplications[0].grant.reward.token.decimal)
			} else {
				setRewardAssetDecimals(CHAIN_INFO[
					getSupportedChainIdFromSupportedNetwork(
						data?.grantApplications[0].grant.workspace.supportedNetworks[0],
					)
				]?.supportedCurrencies[data?.grantApplications[0]?.grant?.reward?.asset?.toLowerCase()!]
					?.decimals)
			}

			const fetchedApplicantsData = data?.grantApplications?.map((applicant) => {

				let decimal
				let label
				let icon
				if (!(grantData?.grants[0].rubric?.items.length ?? true)) {
					setSetupRubricBannerCancelled(false)
				}

				if (grantData?.grants[0].reward.token) {
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
					applicantName: getFieldString(applicant, 'applicantName'),
					applicantEmail: getFieldString(applicant, 'applicantEmail'),
					applicantAddress: getFieldString(applicant, 'applicantAddress') || applicant.applicantId,
					sentOn: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
					updatedOn: moment.unix(applicant.updatedAtS).format('DD MMM YYYY'),
					// applicant_name: getFieldString('applicantName'),
					projectName: getFieldString(applicant, 'projectName'),
					fundingAsked: {
						// amount: formatAmount(
						//   getFieldString('fundingAsk') || '0',
						// ),
						amount:
							applicant && getFieldString(applicant, 'fundingAsk') ? formatAmount(
								getFieldString(applicant, 'fundingAsk')!,
								decimal || 18,
							) : '1',
						symbol: label,
						icon,
					},
					// status: applicationStatuses.indexOf(applicant?.state),
					status: TableFilters[applicant?.state],
					milestones: applicant.milestones,
					reviewers: applicant.applicationReviewers,
					amountPaid: formatAmount(
						getTotalFundingRecv(
							applicant.milestones as unknown as ApplicationMilestone[],
						).toString(),
						decimal || 18,
					),
					reviews: applicant.reviews
				}
			})
			setApplicantsData(fetchedApplicantsData)
			// setDaoId(data.grantApplications[0].grant.workspace.id)
			setAcceptingApplications(data?.grantApplications[0]?.grant?.acceptingApplications!)
		}

	}, [data, error, loading, grantData])

	const [isAcceptingApplications, setIsAcceptingApplications] = React.useState<
		[boolean, number]
	>([acceptingApplications, 0])

	useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])
	}, [acceptingApplications])

	const [transactionData, txnLink, archiveGrantLoading, isBiconomyInitialised, archiveGrantError] = useArchiveGrant(
		isAcceptingApplications[0],
		isAcceptingApplications[1],
		grantID,
	)

	const { setRefresh } = useCustomToast(txnLink)
	useEffect(() => {
		if (transactionData) {
			setIsModalOpen(false)
			setRefresh(true)
		}

	}, [transactionData])

	React.useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])

	}, [archiveGrantError])

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = React.useState<number>()

	//getting transaction hash status start

	const isEvmChain = workspaceSafeChainId !== 900001

	const currentSafe = useMemo(() => {
		if (isEvmChain) {
			const txnServiceURL = safeServicesInfo[workspaceSafeChainId]
			return new GnosisSafe(workspaceSafeChainId, txnServiceURL, workspaceSafe)
		} else {
			if (isPlausibleSolanaAddress(workspaceSafe)) {
				return new RealmsSolana(workspaceSafe)
			}
		}
	}, [workspaceSafe])

	async function getAllStatus(applicationToTxnHashMap: any) {
		var statuses: { [applicationId: string]: [{ transactionHash: string, status: number, amount: number }] } = {}

		const getEachStatus = async (transaction: any, applicationId: any) => {
			console.log('transaction hash', transaction)
			const status = await currentSafe?.getTransactionHashStatus(transaction?.transactionHash)
			if (transaction && status) {
				if (!statuses[applicationId]) {
					statuses[applicationId] = [{
						transactionHash: '',
						status: -1,
						amount: 0
					}]
				}

				(statuses[applicationId]).push({
					transactionHash: transaction.transactionHash,
					...(status[transaction.transactionHash] || {}),
					amount: (status[transaction.transactionHash] || {}).closedAtDate !== '' ?
						isEvmChain ? 0 :
							await solanaToUsdOnDate(transaction.amount / 10 ** 9, status[transaction.transactionHash]?.closedAtDate) :
						0
				})
				return status
			}
		}
		if (!isEvmChain) {
			await currentSafe?.initialiseAllProposals()
		}

		Promise.all((Object.keys(applicationToTxnHashMap || {}) || []).map(async (applicationId) => {
			const transactions = applicationToTxnHashMap[applicationId]

			return Promise.all(transactions.map(async (transaction: any) => {
				return new Promise(async (res, rej) => {

					const status = await getEachStatus(transaction, applicationId)
					res(status)


				})
			})).then((done) => done)
		})).then(async () => {
			let totalFundDisbursed = 0
			for (const txns of Object.values(statuses)) {
				txns.map(txn => {
					if (txn.status === 1) {
						totalFundDisbursed += (txn.amount)
					}
				})
			}

			setTotalFundDisbursed(totalFundDisbursed)
			setApplicationStatuses(statuses)
		})
	}

	async function getEVMtxStats(applicationToTxnHashMap: any) {
		console.log('transaction map -->', applicationToTxnHashMap)
		let txnStatus: { [applicationId: string]: [{ transactionHash: string, status: number, amount: number }] } = {}

		const getEachStatus = async (transaction: { transactionHash: string, amount: number }, applicationId: string) => {
			console.log('transaction', transaction)
			const details = await currentSafe?.getTransactionHashStatus(transaction.transactionHash)
			if (details) {
				if (transaction && details) {
					if (!txnStatus[applicationId]) {
						txnStatus[applicationId] = [{
							transactionHash: '',
							status: -1,
							amount: 0
						}]
					}
					txnStatus[applicationId].push({ transactionHash: transaction.transactionHash, status: 1, amount: transaction.amount })
				}
			}
			console.log('txn status map', txnStatus)
		}

		const stats = await getEachStatus({ transactionHash: applicationToTxnHashMap['0xc7'][2].transactionHash, amount: applicationToTxnHashMap['0xc7'][2].amount }, '0xc7')
		console.log('status', stats)
	}

	useEffect(() => {
		if ((Object.keys(listOfApplicationToTxnsHash) || []).length > 0) {
			if (!isEvmChain) {
				getAllStatus((listOfApplicationToTxnsHash) || [])
			} else {
				getEVMtxStats(listOfApplicationToTxnsHash)
			}
		}

	}, [listOfApplicationToTxnsHash])

	//getting transaction hash status end

	const onSendFundsButtonClicked = async (state: boolean, selectedApplicants: any[]) => {
		setSendFundsTo(selectedApplicants)
	}


	const [getReviewersForAWorkspaceParams, setGetReviewersForAWorkspaceParams] = useState<any>({
		client:
			subgraphClients[
				getSupportedChainIdFromWorkspace(workspace) || defaultChainId
			].client,
	})
	const { data: reviewersForAWorkspaceData } = useGetReviewersForAWorkspaceQuery(getReviewersForAWorkspaceParams)
	useEffect(() => {
		if (!workspace) {
			return
		}

		setGetReviewersForAWorkspaceParams({
			client:
				subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: {
				workspaceId: workspace.id
			},
		})
	}, [workspace])

	const [areReviewersAdded, setAreReviewersAdded] = useState<boolean>(false)
	const [areRubricsSet, setAreRubricsSet] = useState<boolean>(false)

	useEffect(() => {
		if (!reviewersForAWorkspaceData) {
			setAreReviewersAdded(true)
		} else if (reviewersForAWorkspaceData?.workspaces[0]?.members.length) {
			setAreReviewersAdded(reviewersForAWorkspaceData?.workspaces[0]?.members.length > 0)
		} else {
			setAreReviewersAdded(false)
		}
	}, [reviewersForAWorkspaceData])

	useEffect(() => {
		if (!grantData) {
			setAreRubricsSet(true)
		} else if (grantData?.grants[0].rubric?.items.length) {
			setAreRubricsSet(grantData?.grants[0].rubric?.items.length > 0)
		} else {
			setAreRubricsSet(false)
		}
	}, [grantData])

	const [transactionHash, setTransactionHash] = useState<string>()

	return (
		<Container
			maxW='100%'
			display='flex'
			pb='300px'
			px={0}
			minH='calc(100vh - 64px)'
			bg='#FBFBFD'
		>
			<Container
				flex={1}
				display='flex'
				flexDirection='column'
				maxW='1116px'
				alignItems='stretch'
				pb={8}
				px={8}
				pt={6}
				pos='relative'
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
														h='3px'
														w='13.5px' />
												}
												{...props}
												ref={ref}
												aria-label='options'
											/>
										))
									}
								/>
								<MenuList
									minW='240px'
									py={0}>
									<Flex
										bg='#F0F0F7'
										px={4}
										py={2}
									>
										<Text
											fontSize='14px'
											lineHeight='20px'
											fontWeight='500'
											textAlign='center'
											color='#555570'
										>
											Grant options
										</Text>
									</Flex>
									<MenuItem
										px='19px'
										py='10px'
										onClick={
											() => (grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ?
												setViewRubricDrawerOpen(true) : setRubricDrawerOpen(true)
										}
									>
										{
											(grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ? (
												<ViewEye
													color='#C8CBFC'
													mr='11px' />
											) : (
												<EditPencil
													color='#C8CBFC'
													mr='11px' />
											)
										}
										<Text
											fontSize='14px'
											lineHeight='20px'
											fontWeight='400'
											textAlign='center'
											color='#555570'
										>
											{(grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ? 'View scoring rubric' : 'Setup applicant evaluation'}
										</Text>
									</MenuItem>
									<MenuItem
										px='19px'
										py='10px'
									>
										<ArchiveGrant
											color='#C8CBFC'
											mr='11px' />
										<Text
											fontSize='14px'
											lineHeight='20px'
											fontWeight='400'
											textAlign='center'
											color='#555570'
										>
											Archive grant
										</Text>
									</MenuItem>
								</MenuList>
							</Menu>
						)
					}
				</Flex>

				<Box mt={4} />

				<StatsBanner
					funds={totalFundDisbursed}
					reviews={applicantsData.reduce((acc: any, curr: any) => acc + curr.reviews.length, 0)}
					totalReviews={applicantsData.reduce((acc: any, curr: any) => acc + curr.reviewers.length, 0)}
					applicants={applicantsData.length}
				/>

				<Box mt={5} />
				{
					!areReviewersAdded && !areRubricsSet && !addReviewerBannerCancelled && (
						<NoReviewerBanner
							onSetup={
								() => {
									router.push({
										pathname: '/manage_dao/',
										query: {
											tab: 'members',
										},
									})
								}
							}
							onClose={() => setAddReviewerBannerCancelled(true)} />
					)
				}
				{
					areReviewersAdded && !areRubricsSet && !setupRubricBannerCancelled && (
						<RubricNotSetBanner
							onSetup={() => setRubricDrawerOpen(true)}
							onClose={() => setSetupRubricBannerCancelled(true)} />

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
							borderRadius='2px'
							p={0}
							mt={5}
							bg='white'
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7' >
							<AcceptedProposalsPanel
								isEvmChain={isEvmChain}
								// totalMilestonesAmount={totalMilestonesAmt}
								applicationStatuses={applicationStatuses}
								applicantsData={applicantsData}
								onSendFundsClicked={onSendFundsButtonClicked}
								onBulkSendFundsClicked={onSendFundsButtonClicked}
								onSetupApplicantEvaluationClicked={() => setRubricDrawerOpen(true)}
								grantData={grantData}
								rewardAssetDecimals={rewardAssetDecimals}
							/>
						</TabPanel>

						<TabPanel
							tabIndex={1}
							borderRadius='2px'
							p={0}
							mt={5}
							bg='white'
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
							<InReviewPanel
								applicantsData={applicantsData}
								grantData={grantData} />
						</TabPanel>

						<TabPanel
							tabIndex={2}
							borderRadius='2px'
							p={0}
							mt={5}
							bg='white'
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
							<RejectedPanel
								applicantsData={applicantsData} />
						</TabPanel>

						<TabPanel
							tabIndex={3}
							borderRadius='2px'
							p={0}
							mt={5}
							bg='white'
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
							<ResubmitPanel
								applicantsData={applicantsData} />
						</TabPanel>


					</TabPanels>
				</Tabs>

				<SetupEvaluationDrawer
					isOpen={rubricDrawerOpen}
					onClose={() => setRubricDrawerOpen(false)}
					onComplete={() => setRubricDrawerOpen(false)}
					grantAddress={grantID}
					chainId={getSupportedChainIdFromWorkspace(workspace) || defaultChainId}
					setNetworkTransactionModalStep={setNetworkTransactionModalStep}
					setTransactionHash={setTransactionHash}
					data={reviewersForAWorkspaceData}
				/>

				<ViewEvaluationDrawer
					isOpen={viewRubricDrawerOpen}
					grantData={grantData}
					onClose={() => setViewRubricDrawerOpen(false)}
					onComplete={() => setViewRubricDrawerOpen(false)}
				/>

				<SendFunds
					workspace={workspace}
					workspaceSafe={workspaceSafe}
					workspaceSafeChainId={workspaceSafeChainId}
					sendFundsTo={sendFundsTo}
					rewardAssetAddress={rewardAssetAddress}
					rewardAssetDecimals={rewardAssetDecimals}
					grantData={grantData} />

				<NetworkTransactionModal
					isOpen={networkTransactionModalStep !== undefined}
					subtitle='Creating scoring rubric'
					description={
						<Flex
							direction='column'
							w='100%'
							align='start'>
							<Text
								fontWeight='500'
								fontSize='17px'
							>
								{grantData && grantData?.grants && grantData?.grants.length > 0 && grantData?.grants[0].title}
							</Text>

							<Button
								rightIcon={<ExternalLinkIcon />}
								variant='linkV2'
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
							'Completing indexing',
							'Rubric created and Reviewers assigned',
						]
					}
					viewLink={getExplorerUrlForTxHash(getSupportedChainIdFromWorkspace(workspace) || defaultChainId, transactionHash)}
					onClose={() => setNetworkTransactionModalStep(undefined)} />

			</Container>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title=''
			>
				<ChangeAccessibilityModalContent
					onClose={() => setIsModalOpen(false)}
					imagePath='/illustrations/publish_grant.svg'
					title='Are you sure you want to publish this grant?'
					subtitle='The grant will be live, and applicants can apply for this grant.'
					actionButtonText='Publish grant'
					actionButtonOnClick={
						() => {
							// console.log('Is Accepting Applications (Button click): ', isAcceptingApplications)
							setIsAcceptingApplications([
								!isAcceptingApplications[0],
								isAcceptingApplications[1] + 1,
							])
						}
					}
					loading={archiveGrantLoading}
					isBiconomyInitialised={isBiconomyInitialised}
				/>
			</Modal>
		</Container>
	)
}

ViewApplicants.getLayout = function (page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ViewApplicants
