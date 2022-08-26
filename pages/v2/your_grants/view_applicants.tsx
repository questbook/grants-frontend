import React, {
	ReactElement, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Container, Flex, forwardRef, IconButton, IconButtonProps, Link, Menu, MenuButton, MenuItem, MenuList, TabList, TabPanel, TabPanels, Tabs, Text
} from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import Modal from 'src/components/ui/modal'
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters'
import ChangeAccessibilityModalContent from 'src/components/your_grants/yourGrantCard/changeAccessibilityModalContent'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import {
	useGetApplicantsForAGrantQuery,
	useGetApplicantsForAGrantReviewerQuery,
	useGetGrantDetailsQuery,
	useGetSafeForAWorkspaceQuery,
} from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useArchiveGrant from 'src/hooks/useArchiveGrant'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import NavbarLayout from 'src/layout/navbarLayout'
import { ApplicationMilestone } from 'src/types'
import { formatAddress, formatAmount, getFieldString } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { isPlausibleSolanaAddress } from 'src/utils/generics'
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
import { SupportedSafes } from 'src/v2/constants/safe/supported_safes'
import usePhantomWallet from 'src/v2/hooks/usePhantomWallet'
import AcceptedProposalsPanel from 'src/v2/payouts/AcceptedProposals/AcceptedProposalPanel'
import InReviewPanel from 'src/v2/payouts/InReviewProposals/InReviewPanel'
import RejectedPanel from 'src/v2/payouts/RejectedProposals/RejectedPanel'
import ResubmitPanel from 'src/v2/payouts/ResubmitProposals/ResubmitPanel'
import SendFundsDrawer from 'src/v2/payouts/SendFundsDrawer/SendFundsDrawer'
import SendFundsModal from 'src/v2/payouts/SendFundsModal/SendFundsModal'
import SetupEvaluationDrawer from 'src/v2/payouts/SetupEvaluationDrawer/SetupEvaluationDrawer'
import StatsBanner from 'src/v2/payouts/StatsBanner'
import TransactionInitiatedModal from 'src/v2/payouts/TransactionInitiatedModal'
import ViewEvaluationDrawer from 'src/v2/payouts/ViewEvaluationDrawer/ViewEvaluationDrawer'
import getGnosisTansactionLink from 'src/v2/utils/gnosisUtils'
import getProposalUrl from 'src/v2/utils/phantomUtils'
import { erc20ABI, useConnect, useDisconnect } from 'wagmi'
import { Gnosis_Safe } from 'src/v2/constants/safe/gnosis_safe'
import safeServicesInfo from 'src/v2/constants/safeServicesInfo'
import { Realms_Solana } from 'src/v2/constants/safe/realms_solana'


const PAGE_SIZE = 500
const ERC20Interface = new ethers.utils.Interface(erc20ABI)
const safeChainIds = Object.keys(safeServicesInfo)

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(milestone.amountPaid)
	})
	return val
}

enum ModalState {
	RECEIPT_DETAILS,
	CONNECT_WALLET,
	VERIFIED_OWNER,
	TRANSATION_INITIATED
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

	const [workspaceSafe, setWorkspaceSafe] = useState('')
	const [workspaceSafeChainId, setWorkspaceSafeChainId] = useState(0)

	const [setupRubricBannerCancelled, setSetupRubricBannerCancelled] = useState(true)

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

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: workspacechainId ? workspacechainId.toString() : defaultChainId.toString(),
	})
	const [isBiconomyInitialisedDisburse, setIsBiconomyInitialisedDisburse] = useState(false)

	useEffect(() => {
		const isBiconomyLoading = localStorage.getItem('isBiconomyLoading') === 'true'
		console.log('rree', isBiconomyLoading, biconomyLoading)
		console.log('networks 2:', biconomy?.networkId?.toString(), workspacechainId, defaultChainId)

		if (biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && workspacechainId &&
			biconomy.networkId && biconomy.networkId?.toString() === workspacechainId.toString()) {
			setIsBiconomyInitialisedDisburse(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialisedDisburse, workspacechainId])


	useEffect(() => {
		if (safeAddressData) {
			const { workspaceSafes } = safeAddressData
			const safeAddress = workspaceSafes[0].address
			console.log('safeAddress', safeAddress)
			console.log('workspace safe details', workspaceSafes)
			setWorkspaceSafe(safeAddress)
			setWorkspaceSafeChainId(parseInt(workspaceSafes[0].chainId))
		}
	}, [safeAddressData])


	const [rubricDrawerOpen, setRubricDrawerOpen] = useState(false)
	const [viewRubricDrawerOpen, setViewRubricDrawerOpen] = useState(false)

	const [rewardAssetAddress, setRewardAssetAddress] = useState('')
	const [rewardAssetDecimals, setRewardAssetDecimals] = useState<number>()

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
		if (router && router.query) {
			const { grantId: gId } = router.query
			console.log('fetch 100: ', gId)
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
		if (
			workspace
			&& workspace.members
			&& workspace.members.length > 0
			&& accountData
			&& accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			console.log('fetch 500: ', tempMember)
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
		if (!workspace) {
			return
		}

		if (!grantID) {
			return
		}

		console.log('Grant ID: ', grantID)
		console.log('isUser: ', isUser)
		console.log('fetch: ', isAdmin, isReviewer)
		if (isAdmin) {
			console.log('Setting query params')
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

		if (isReviewer || isAdmin) {
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

	useEffect(() => {
		console.log('Admin params: ', queryParams)
	}, [queryParams])

	const { data, error, loading } = useGetApplicantsForAGrantQuery(queryParams)
	const { data: grantData } = useGetGrantDetailsQuery(queryParams)
	useEffect(() => {
		console.log('fetch', data)

		if (data && data.grantApplications.length) {
			setRewardAssetAddress(data.grantApplications[0].grant.reward.asset)
			if (data.grantApplications[0].grant.reward.token) {
				setRewardAssetDecimals(data.grantApplications[0].grant.reward.token.decimal)
			} else {
				setRewardAssetDecimals(CHAIN_INFO[
					getSupportedChainIdFromSupportedNetwork(
						data.grantApplications[0].grant.workspace.supportedNetworks[0],
					)
				]?.supportedCurrencies[data.grantApplications[0].grant.reward.asset.toLowerCase()]
					?.decimals)
			}

			const fetchedApplicantsData = data.grantApplications.map((applicant) => {
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
					applicant_address: getFieldString(applicant, 'applicantAddress'),
					sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
					updated_on: moment.unix(applicant.updatedAtS).format('DD MMM YYYY'),
					// applicant_name: getFieldString('applicantName'),
					project_name: getFieldString(applicant, 'projectName'),
					funding_asked: {
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
		for (const n in item) {
			if (item[n].reviewer.id === isActorId) {
				user.push(isActorId)
			}
		}

		if (user.length === 1) {
			return 9
		}

		return 0
	}

	useEffect(() => {
		// console.log('Raw reviewer data: ', reviewData)
		if (reviewData.data && reviewData.data.grantApplications.length) {
			console.log('Reviewer Applications: ', reviewData.data)
			const fetchedApplicantsData = reviewData.data.grantApplications.map((applicant) => {
				return {
					grantTitle: applicant?.grant?.title,
					applicationId: applicant.id,
					applicant_address: getFieldString(applicant, 'applicantAddress'),
					sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
					project_name: getFieldString(applicant, 'projectName'),
					funding_asked: {
						// amount: formatAmount(
						//   getFieldString('fundingAsk') || '0',
						// ),
						amount:
							applicant && getFieldString(applicant, 'fundingAsk') ? formatAmount(
								getFieldString(applicant, 'fundingAsk')!,
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
		// console.log('initialRubrics', initialRubrics)
		initialRubrics?.items.forEach((initalRubric) => {
			newRubrics.push({
				name: initalRubric.title,
				nameError: false,
				description: initalRubric.details,
				descriptionError: false,
			})
		})
		if (newRubrics.length === 0) {
			return
		}

		setRubrics(newRubrics)
		if (initialRubrics?.items[0].maximumPoints) {
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

	const [transactionData, txnLink, archiveGrantLoading, isBiconomyInitialised, archiveGrantError] = useArchiveGrant(
		isAcceptingApplications[0],
		isAcceptingApplications[1],
		grantID,
	)

	const buttonRef = React.useRef<HTMLButtonElement>(null)

	const { setRefresh } = useCustomToast(txnLink)
	useEffect(() => {
		// console.log(transactionData);
		if (transactionData) {
			setIsModalOpen(false)
			setRefresh(true)
		}

	}, [transactionData])

	React.useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])

	}, [archiveGrantError])

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = React.useState<number>()


	//Implementing the safe send

	const { phantomWalletAvailable,
		phantomWallet,
		phantomWalletConnected,
		setPhantomWalletConnected } = usePhantomWallet()

	const { connect, isConnected } = useConnect()
	const { disconnect } = useDisconnect()

	const [signerVerified, setSignerVerififed] = useState(false)
	const [proposalAddr, setProposalAddr] = useState('')

	const [initiateTransactionData, setInitiateTransactionData] = useState<any>([])
	const [gnosisBatchData, setGnosisBatchData] = useState<any>([])
	const [gnosisReadyToExecuteTxns, setGnosisReadyToExecuteTxns] = useState<any>([])

	// const supported_safes = new SupportedSafes(workspaceSafe)
	// const chainId = 4 // get your safe chain ID, currently on solana
	const isEvmChain = workspaceSafeChainId !== 9000001 ? true : false

	const current_safe = useMemo(() => {
		if (isEvmChain) {
			const txnServiceURL = safeServicesInfo[workspaceSafeChainId]
			return new Gnosis_Safe(workspaceSafeChainId, txnServiceURL, workspaceSafe)
		} else {
			if (isPlausibleSolanaAddress(workspaceSafe)) {
				return new Realms_Solana(workspaceSafe)
			}
		}
	}, [workspaceSafe])

	//checking if the realm address is valid

	useEffect(() => {
		const checkValidSafeAddress = async () => {
			const isValidSafeAddress = await current_safe?.isValidSafeAddress(workspaceSafe)
			console.log('isValidSafeAddress', isValidSafeAddress)
		}

		checkValidSafeAddress()
	}, [])



	useEffect(() => {
		const formattedTrxnData = sendFundsTo?.map((recepient, i) => (
			{
				from: current_safe?.id?.toString(),
				to: recepient.applicant_address,
				applicationId: recepient.applicationId,
				selectedMilestone: recepient.milestones[0].id,
				amount: recepient.milestones[0].amount
			})
		)
		setInitiateTransactionData(formattedTrxnData)
		setGnosisBatchData(formattedTrxnData)
	}, [sendFundsTo])

	function createEVMMetaTransactions() {
		const readyTxs = gnosisBatchData.map((data: any) => {
			const txData = encodeTransactionData(data.to, (data.amount.toString()))
			const tx = {
				to: ethers.utils.getAddress(rewardAssetAddress),
				data: txData,
				value: '0'
			}
			return tx
		})
		console.log('ready to execute tx', readyTxs)
		setGnosisReadyToExecuteTxns(readyTxs)
		return readyTxs
	}

	function encodeTransactionData(recipientAddress: string, fundAmount: string) {
		const txData = ERC20Interface.encodeFunctionData('transfer', [
			recipientAddress,
			ethers.utils.parseUnits(fundAmount, rewardAssetDecimals)
		])

		return txData
	}

	const getRealmsVerification = async () => {
		if (phantomWallet?.publicKey?.toString()) {
			const isVerified = await current_safe?.isOwner(phantomWallet.publicKey?.toString())
			console.log('realms_solana verification', isVerified)
			if (isVerified) {
				setSignerVerififed(true)
			}
		}
	}

	const verifyGnosisOwner = async () => {
		if (isConnected) {
			const isVerified = await current_safe?.isOwner(workspaceSafe)
			console.log('verifying owner', isVerified)
			if (isVerified) {
				setSignerVerififed(true)
			} else {
				console.log('not a owner')
			}
		}
	}

	useEffect(() => {
		if (phantomWalletConnected) {
			getRealmsVerification()
		} else if (isConnected) {
			verifyGnosisOwner()
		} else {
			setSignerVerififed(false)
		}
	}, [phantomWalletConnected, isConnected])

	const workspaceRegistryContract = useQBContract('workspace', workspacechainId)
	const { webwallet } = useContext(WebwalletContext)!

	useEffect(() => {
		console.log()
	}, [initiateTransactionData])

	const initiateTransaction = async () => {
		console.log('initiate transaction called')
		let proposaladdress: string | undefined
		if (isEvmChain) {
			console.log('transactions initiated --> ', gnosisReadyToExecuteTxns)
			const readyToExecuteTxs = createEVMMetaTransactions()
			const result = await current_safe?.createMultiTransaction(readyToExecuteTxs, workspaceSafe)
			console.log('Proposed transaction', result)
			proposaladdress = 'gnosisproposaladdress'
			setProposalAddr('gnosisproposaladdress')
		} else {
			proposaladdress = await current_safe?.proposeTransactions(grantData?.grants[0].title!, initiateTransactionData, phantomWallet)
			console.log('proposal address', proposaladdress)
			if (!proposaladdress) {
				throw new Error('No proposal address found!')
			}

			setProposalAddr(proposaladdress?.toString())
		}
		disburseRewardFromSafe(proposaladdress?.toString()!)
			.then(() => {
				console.log('Sent transaction to contract - realms')
			})
			.catch((err) => {
				console.log('realms sending transction error:', err)
			})

	}

	const disburseRewardFromSafe = useCallback(async (proposaladdress: string) => {
		console.log(workspacechainId)
		if (!workspacechainId) {
			return
		}

		// setCallOnContractChange(false)
		try {
			// if(activeChain?.id !== daoNetwork?.id) {
			// 	console.log('switching')
			// 	// await switchNetworkAsync!(daoNetwork?.id)
			// 	console.log('create workspace again on contract object update')
			// 	setCallOnContractChange(true)
			// 	setTimeout(() => {
			// 		if(callOnContractChange && activeChain?.id !== daoNetwork?.id) {
			// 			setCallOnContractChange(false)
			// 			throw new Error('Error switching network')
			// 		}
			// 	}, 60000)
			// 	return
			// }

			// console.log('creating workspace', accountData!.address)

			if (!workspacechainId) {
				throw new Error('No network specified')
			}

			if (!proposaladdress) {
				throw new Error('No proposal Address specified')
			}

			if (!initiateTransactionData) {
				throw new Error('No data provided!')
			}

			if (!workspace) {
				throw new Error('No workspace found!')
			}

			if (typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				return
			}

			const methodArgs = [
				initiateTransactionData.map((element: any) => (parseInt(element.applicationId, 16))),
				initiateTransactionData.map((element: any) => (parseInt(element.selectedMilestone, 16))),
				rewardAssetAddress,
				'nonEvmAssetAddress-toBeChanged',
				initiateTransactionData.map((element: any) => (ethers.utils.parseEther(element.amount.toString()))),
				workspace.id,
				proposaladdress
			]

			console.log('methodArgs', methodArgs)

			const transactionHash = await sendGaslessTransaction(
				biconomy,
				workspaceRegistryContract,
				'disburseRewardFromSafe',
				methodArgs,
				workspaceRegistryContract.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${workspacechainId}`,
				bicoDapps[workspacechainId.toString()].webHookId,
				nonce
			)

			if (!transactionHash) {
				return
			}

			const { txFee, receipt } = await getTransactionDetails(transactionHash, workspacechainId.toString())

			console.log('txFee', txFee)

			console.log('fdsao')
			await chargeGas(Number(workspace.id), Number(txFee))

		} catch (e) {
			console.log('disburse error', e)
		}
	}, [workspace, biconomyWalletClient, workspacechainId, biconomy, workspaceRegistryContract, scwAddress, webwallet, nonce, initiateTransactionData, proposalAddr])

	const onChangeRecepientDetails = (applicationId: any, fieldName: string, fieldValue: any) => {
		console.log('onChangeRecepientDetails', applicationId, fieldName, fieldValue)
		console.log('Gnosis Batch data', gnosisBatchData)
		const tempData = initiateTransactionData.map((transactionData: any) => {
			if (transactionData.applicationId === applicationId) {
				return { ...transactionData, [fieldName]: fieldValue }
			}

			return transactionData
		})

		console.log('initiateTransactionData', tempData)
		setInitiateTransactionData(tempData)
		setGnosisBatchData(tempData)
	}


	const [step, setStep] = useState(ModalState.RECEIPT_DETAILS)

	const onSendFundsButtonClicked = async (state: boolean, selectedApplicants: any[]) => {
		console.log('state', state)
		console.log('selectedApplicants', selectedApplicants)
		if (selectedApplicants.length === 1) {
			setSendFundsModalIsOpen(state)
		} else {
			setSendFundsDrawerIsOpen(state)
		}

		setSendFundsTo(selectedApplicants)
	}

	const onModalStepChange = async (currentState: number) => {
		switch (currentState) {
			case ModalState.RECEIPT_DETAILS:
				setStep(ModalState.CONNECT_WALLET)
				break
			case ModalState.CONNECT_WALLET:
				if (signerVerified) {
					setStep(ModalState.VERIFIED_OWNER)
				}

				break
			case ModalState.VERIFIED_OWNER:
				setStep(ModalState.TRANSATION_INITIATED)
				initiateTransaction()
				setSendFundsModalIsOpen(false)
				setSendFundsDrawerIsOpen(false)
				setTxnInitModalIsOpen(true)

				break
		}
	}

	const onModalClose = async () => {
		setStep(ModalState.RECEIPT_DETAILS)
		setSendFundsModalIsOpen(false)
		setSendFundsDrawerIsOpen(false)
		setTxnInitModalIsOpen(false)
		if (phantomWallet?.isConnected) {
			await phantomWallet.disconnect()
			setPhantomWalletConnected(false)
		}

		if (isConnected) {
			disconnect()
		}
	}

	useEffect(() => {
		if (signerVerified) {
			setStep(ModalState.VERIFIED_OWNER)
		}
	}, [signerVerified])

	//end of implementation


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
					reviews={applicantsData.reduce((acc: any, curr: any) => acc + curr.reviews.length, 0)}
					totalReviews={applicantsData.reduce((acc: any, curr: any) => acc + curr.reviewers.length, 0)}
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
								onSendFundsClicked={onSendFundsButtonClicked}
								onBulkSendFundsClicked={onSendFundsButtonClicked}
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
								grantData={grantData}
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

						<TabPanel
							tabIndex={3}
							borderRadius={'2px'}
							p={0}
							mt={5}
							bg={'white'}
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
							<ResubmitPanel
								applicantsData={applicantsData} />
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
					onClose={onModalClose}
					safeAddress={workspaceSafe ?? 'HWuCwhwayTaNcRtt72edn2uEMuKCuWMwmDFcJLbah3KC'}
					proposals={sendFundsTo ?? []}

					onChangeRecepientDetails={onChangeRecepientDetails}
					phantomWallet={phantomWallet}
					setPhantomWalletConnected={setPhantomWalletConnected}
					isEvmChain={isEvmChain}
					current_safe={current_safe!}
					signerVerified={signerVerified}
					initiateTransaction={initiateTransaction}
					initiateTransactionData={initiateTransactionData}

					onModalStepChange={onModalStepChange}
					step={step}
				/>

				<TransactionInitiatedModal
					isOpen={txnInitModalIsOpen && proposalAddr ? true : false}
					onClose={onModalClose}
					onComplete={() => setTxnInitModalIsOpen(false)}
					proposalUrl={isEvmChain ? getGnosisTansactionLink(current_safe?.id?.toString()!, current_safe?.chainId.toString()!) : getProposalUrl(current_safe?.id?.toString()!, proposalAddr)}
				/>

				<SendFundsDrawer
					isOpen={sendFundsDrawerIsOpen}
					onClose={onModalClose}
					// @ts-expect-error
					safeAddress={workspace?.safeAddress ?? 'HWuCwhwayTaNcRtt72edn2uEMuKCuWMwmDFcJLbah3KC'}
					proposals={sendFundsTo ?? []}

					onChangeRecepientDetails={onChangeRecepientDetails}
					phantomWallet={phantomWallet}
					setPhantomWalletConnected={setPhantomWalletConnected}
					isEvmChain={isEvmChain}
					current_safe={current_safe}
					signerVerified={signerVerified}
					initiateTransaction={initiateTransaction}
					initiateTransactionData={initiateTransactionData}

					onModalStepChange={onModalStepChange}
					step={step}
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
