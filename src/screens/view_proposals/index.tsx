import React, {
	ReactElement, useContext, useEffect, useMemo, useRef, useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box, Container, Flex, forwardRef, IconButton, IconButtonProps, Menu, MenuButton, MenuItem, MenuList, Text, ToastId, useToast
} from '@chakra-ui/react'
import { BigNumber, ethers, logger } from 'ethers'
import moment from 'moment'
import { useRouter } from 'next/router'
import Modal from 'src/components/ui/modal'
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters'
import ChangeAccessibilityModalContent from 'src/components/your_grants/yourGrantCard/changeAccessibilityModalContent'
import { CHAIN_INFO, defaultChainId, SupportedChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import {
	useGetAllFundsTransfersForADaoQuery,
	useGetApplicantsForAGrantQuery,
	useGetGrantDetailsQuery,
	useGetReviewersForAWorkspaceQuery,
} from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useArchiveGrant from 'src/hooks/useArchiveGrant'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import FilterTable from 'src/libraries/ui/FilterTable'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/pages/_app'
import AcceptedProposalsPanel from 'src/screens/view_proposals/_components/AcceptedProposals/AcceptedProposalPanel'
import InReviewPanel from 'src/screens/view_proposals/_components/InReviewProposals/InReviewPanel'
import RejectedPanel from 'src/screens/view_proposals/_components/RejectedProposals/RejectedPanel'
import ResubmitPanel from 'src/screens/view_proposals/_components/ResubmitProposals/ResubmitPanel'
import { ApplicationMilestone, IApplicantData } from 'src/types'
import { formatAmount, getExplorerUrlForTxHash, getFieldString } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { ArchiveGrant } from 'src/v2/assets/custom chakra icons/ArchiveGrant'
import { EditPencil } from 'src/v2/assets/custom chakra icons/EditPencil'
import { ThreeDotsHorizontal } from 'src/v2/assets/custom chakra icons/ThreeDotsHorizontal'
import { ViewEye } from 'src/v2/assets/custom chakra icons/ViewEye'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import NoReviewerBanner from 'src/v2/components/ViewApplicants/NoReviewerBanner'
import RubricNotSetBanner from 'src/v2/components/ViewApplicants/RubricNotSetBanner'
import rpcUrls from 'src/v2/constants/publicRpcUrlInfo'
import SendFunds from 'src/v2/payouts/SendFunds'
import SetupEvaluationDrawer from 'src/v2/payouts/SetupEvaluationDrawer/SetupEvaluationDrawer'
import StatsBanner from 'src/v2/payouts/StatsBanner'
import ViewEvaluationDrawer from 'src/v2/payouts/ViewEvaluationDrawer/ViewEvaluationDrawer'

const PAGE_SIZE = 500

// const safeChainIds = Object.keys(safeServicesInfo)

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(milestone.amountPaid)
	})
	return val
}

function ViewProposals() {
	const [tabIndex, setTabIndex] = useState(0)
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

	// const [workspaceSafe, setWorkspaceSafe] = useState('')
	// const [workspaceSafeChainId, setWorkspaceSafeChainId] = useState(0)

	const [setupRubricBannerCancelled, setSetupRubricBannerCancelled] = useState(false)
	const [addReviewerBannerCancelled, setAddReviewerBannerCancelled] = useState(false)

	// const [listOfApplicationToTxnsHash, setListOfApplicationToTxnsHash] = useState({})
	const [applicationStatuses, setApplicationStatuses] = useState({})
	const [totalFundDisbursed, setTotalFundDisbursed] = useState(0)
	// const [totalMilestonesAmt, setTotalMilestonesAmt] = useState({})
	const [rubricDrawerOpen, setRubricDrawerOpen] = useState(false)
	const [viewRubricDrawerOpen, setViewRubricDrawerOpen] = useState(false)

	const [rewardAssetAddress, setRewardAssetAddress] = useState('')
	const [rewardAssetDecimals, setRewardAssetDecimals] = useState<number>()
	const [rewardAssetSymbol, setRewardAssetSymbol] = useState<string>()

	const [sendFundsTo, setSendFundsTo] = useState<any[]>()

	const { data: accountData } = useQuestbookAccount()
	const router = useRouter()
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

	const workspacechainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId

	const { safeObj } = useSafeContext()
	const isEvmChain = safeObj?.getIsEvm()

	const { t } = useTranslation()

	const checkIfUserIsOnCorrectNetwork = async(_safeNetwork: string) => {
		// @ts-ignore
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const { chainId: currentNetworkId } = await provider.getNetwork()
		const safeNetwork = parseInt(_safeNetwork)
		logger.info({ safeNetwork }, 'Safe Network')
		if(currentNetworkId !== safeNetwork) {
			const ethereum = window.ethereum!
			const chainId = ethers.utils.hexValue(ethers.BigNumber.from(safeNetwork))
			try {
				await ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: chainId }],
				})
			} catch(switchError: any) {
				// This error code indicates that the chain has not been added to MetaMask.
				if(switchError.code === 4902) {
				  try {
						await ethereum.request({
					  method: 'wallet_addEthereumChain',
					  params: [
								{
						  chainId: chainId,
						  chainName: CHAIN_INFO[safeNetwork as SupportedChainId].name,
						  rpcUrls: [rpcUrls[safeNetwork]],
						  nativeCurrency: CHAIN_INFO[safeNetwork as SupportedChainId].nativeCurrency
								},
					  ],
						})
				  } catch(addError) {
					// handle "add" error
						logger.info(`ERROR: Add network failed for chain Id ${chainId}`)
				  }
				}

				// handle other "switch" errors
				logger.info(`ERROR: failed to switch network to ${safeNetwork}`)
			  }

		}

	}

	const toast = useToast()
	const toastRef = useRef<ToastId>()

	useEffect(() => {
		if(workspace && !workspace?.safe?.chainId && !workspace?.safe?.address) {
			toastRef.current = toast({
				title: 'No Safe Found',
				description: 'Please add a Safe Address to your workspace',
				status: 'warning',
				position: 'top-right',
				duration: 10000,
			})
			return
		}
	}, [workspace])


	useEffect(() => {
		if(router?.query) {
			const { grantId: gId } = router.query
			// console.log('fetch 100: ', gId)
			setGrantID(gId)
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client: subgraphClients[workspacechainId].client,
	})


	useEffect(() => {
		if((workspace?.members?.length || 0) > 0
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
		if(!workspace) {
			return
		}

		if(!grantID) {
			return
		}

		// console.log('Grant ID: ', grantID)
		// console.log('isUser: ', isUser)
		// console.log('fetch: ', isAdmin, isReviewer)
		if(isAdmin) {
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
		if((data?.grantApplications?.length || 0) > 0) {
			const reward = data?.grantApplications[0]?.grant?.reward
			logger.info({ reward }, 'Reward')
			setRewardAssetAddress(data?.grantApplications[0]?.grant?.reward?.asset!)
			if(reward?.token) {
				setRewardAssetSymbol(data?.grantApplications[0]?.grant?.reward?.token?.label!)
			} else {
				const assetInfo = getAssetInfo(
					data?.grantApplications[0]?.grant?.reward?.asset?.toLowerCase(),
					getSupportedChainIdFromWorkspace(workspace),
				)
				setRewardAssetSymbol(assetInfo?.label)
			}

			if(data?.grantApplications[0].grant.reward.token) {
				logger.info('decimals', data?.grantApplications[0].grant.reward.token.decimal)
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
				if(!(grantData?.grants[0]?.rubric?.items.length ?? true)) {
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
					grant: applicant?.grant,
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
								getFieldString(applicant, 'fundingAsk'),
								decimal,
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
						decimal,
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
		if(transactionData) {
			setIsModalOpen(false)
			setRefresh(true)
		}

	}, [transactionData])

	React.useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])

	}, [archiveGrantError])

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = React.useState<number>()


	const onSendFundsButtonClicked = async(state: boolean, selectedApplicants: any[]) => {
		if(isEvmChain && safeObj?.chainId) {
			checkIfUserIsOnCorrectNetwork(safeObj?.chainId?.toString())
		}

		setSendFundsTo(selectedApplicants)
	}


	const [getReviewersForAWorkspaceParams, setGetReviewersForAWorkspaceParams] = useState<any>({
		client:
			subgraphClients[workspacechainId].client,
	})
	const { data: reviewersForAWorkspaceData } = useGetReviewersForAWorkspaceQuery(getReviewersForAWorkspaceParams)
	useEffect(() => {
		if(!workspace) {
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
		if(!reviewersForAWorkspaceData) {
			setAreReviewersAdded(true)
		} else if(reviewersForAWorkspaceData?.workspaces[0]?.members.length) {
			setAreReviewersAdded(reviewersForAWorkspaceData?.workspaces[0]?.members.length > 0)
		} else {
			setAreReviewersAdded(false)
		}
	}, [reviewersForAWorkspaceData])

	useEffect(() => {
		if(!grantData) {
			setAreRubricsSet(true)
		} else if(grantData?.grants[0]?.rubric?.items.length) {
			setAreRubricsSet(grantData?.grants[0]?.rubric?.items.length > 0)
		} else {
			setAreRubricsSet(false)
		}
	}, [grantData])

	const [transactionHash, setTransactionHash] = useState<string>()

	const { data: fundTransfersData } = useGetAllFundsTransfersForADaoQuery({
		client:
			subgraphClients[
				getSupportedChainIdFromSupportedNetwork(workspace?.supportedNetworks[0]!) || defaultChainId
			].client,
		variables: {
			workspaceId: workspace?.id || '',
		},
	})

	useEffect(() => {
		if(fundTransfersData) {
			let totalAmount = 0
			for(let i = 0; i < fundTransfersData?.fundsTransfers?.length!; i++) {
				if(fundTransfersData?.fundsTransfers[i]?.status === 'executed'
						&& fundTransfersData?.fundsTransfers[i]?.type === 'funds_disbursed_from_safe') {
					totalAmount += parseInt(fundTransfersData?.fundsTransfers[i]?.amount!)
				}
			}

			setTotalFundDisbursed(totalAmount)
		}
	}, [fundTransfersData])

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
				<Flex>
					<Text
						mt={1}
						mr='auto'
						fontSize='24px'
						lineHeight='32px'
						fontWeight='500'
					>
						{applicantsData[0]?.grantTitle || 'Loading...'}
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
											{(grantData?.grants[0]?.rubric?.items.length || 0) > 0 || false ? t('/your_grants/view_applicants.view_review_process') : t('/your_grants/view_applicants.create_review_process')}
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
											{t('/your_grants/view_applicants.archive_grant')}
										</Text>
									</MenuItem>
								</MenuList>
							</Menu>
						)
					}
				</Flex>

				<Box mt={4} />

				<StatsBanner
					isEvmChain={isEvmChain}
					funds={totalFundDisbursed}
					reviews={applicantsData.reduce((acc: any, curr: any) => acc + curr.reviews.length, 0)}
					totalReviews={applicantsData.reduce((acc: any, curr: any) => acc + curr.reviewers.length, 0)}
					applicants={applicantsData.length}
					tokenSymbol={rewardAssetSymbol!}
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

				<FilterTable
					tabs={
						[
							{
								title: `In Review (${applicantsData.filter((item: IApplicantData) => (0 === item.status)).length})`,
								element: <InReviewPanel
									applicantsData={applicantsData}
									grantData={grantData} />
							},
							{
								title: `Accepted (${applicantsData.filter((item: any) => (2 === item.status)).length})`,
								element: <AcceptedProposalsPanel
								// totalMilestonesAmount={totalMilestonesAmt}
									applicationStatuses={applicationStatuses}
									applicantsData={applicantsData}
									onSendFundsClicked={onSendFundsButtonClicked}
									onBulkSendFundsClicked={onSendFundsButtonClicked}
									onSetupApplicantEvaluationClicked={() => setRubricDrawerOpen(true)}
									grantData={grantData}
									rewardAssetDecimals={rewardAssetDecimals}
									fundTransfersData={fundTransfersData?.fundsTransfers}
								/>
							},
							{
								title: `Rejected (${applicantsData.filter((item: any) => (3 === item.status)).length})`,
								element: <RejectedPanel
									chainId={workspacechainId}
									applicantsData={applicantsData} />
							},
							{
								title: `Asked to Resubmit (${applicantsData.filter((item: any) => (1 === item.status)).length})`,
								element: <ResubmitPanel
									chainId={workspacechainId}
									applicantsData={applicantsData} />
							}
						]
					}
					tabIndex={tabIndex}
					onChange={setTabIndex} />

				{/* <Tabs
					index={tabIndex}
					onChange={(i) => setTabIndex(i)}
					h={8}
					colorScheme='brandv2'>
					<TabList>
						<StyledTab label={`In Review (${applicantsData.filter((item: any) => (0 === item.status)).length})`} />
						<StyledTab label={`Accepted (${applicantsData.filter((item: any) => (2 === item.status)).length})`} />
						<StyledTab label={`Rejected (${applicantsData.filter((item: any) => (3 === item.status)).length})`} />
						<StyledTab label={`Asked to Resubmit (${applicantsData.filter((item: any) => (1 === item.status)).length})`} />
					</TabList>

					<TabPanels>
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
							borderRadius='2px'
							p={0}
							mt={5}
							bg='white'
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7' >
							<AcceptedProposalsPanel
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
							tabIndex={2}
							borderRadius='2px'
							p={0}
							mt={5}
							bg='white'
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
							<RejectedPanel
								chainId={workspacechainId}
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
								chainId={workspacechainId}
								applicantsData={applicantsData} />
						</TabPanel>


					</TabPanels>
				</Tabs> */}

				<SetupEvaluationDrawer
					isOpen={rubricDrawerOpen}
					onClose={() => setRubricDrawerOpen(false)}
					onComplete={() => setRubricDrawerOpen(false)}
					grantAddress={grantID}
					chainId={workspacechainId}
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
					workspace={workspace!}
					sendFundsTo={sendFundsTo!}
					rewardAssetAddress={rewardAssetAddress}
					grantTitle={grantData?.grants?.[0]?.title ?? ''} />

				<NetworkTransactionModal
					isOpen={networkTransactionModalStep !== undefined}
					subtitle='Creating scoring rubric'
					description={
						<Text
							fontWeight='500'
							fontSize='17px'
						>
							{grantData?.grants && grantData?.grants.length > 0 && grantData?.grants[0].title}
						</Text>
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
					viewLink={getExplorerUrlForTxHash(workspacechainId, transactionHash)}
					onClose={
						() => {
							setNetworkTransactionModalStep(undefined)
							router.reload()
						}
					} />

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

ViewProposals.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ViewProposals
