import { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { DEFAULT_NETWORK } from 'src/constants'
import { APPLICATION_REGISTRY_ADDRESS, WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import applicantDetailsList from 'src/constants/applicantDetailsList'
import { USD_ASSET, USD_DECIMALS, USD_ICON } from 'src/constants/chains'
import GrantFactoryAbi from 'src/contracts/abi/GrantFactoryAbi.json'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import SupportedChainId from 'src/generated/SupportedChainId'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { DOMAIN_CACHE_KEY } from 'src/libraries/ui/NavBar/_utils/constants'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { GRANT_CACHE_KEY } from 'src/screens/dashboard/_utils/constants'
import { SafeSelectOption } from 'src/screens/request_proposal/_components/SafeSelect'
import useUpdateRFP from 'src/screens/request_proposal/_hooks/useUpdateRFP'
import BuilderDiscovery from 'src/screens/request_proposal/_subscreens/BuilderDiscovery'
import LinkMultiSig from 'src/screens/request_proposal/_subscreens/LinkMultiSig'
import Payouts from 'src/screens/request_proposal/_subscreens/Payouts'
import ProposalReview from 'src/screens/request_proposal/_subscreens/ProposalReview'
import ProposalSubmission from 'src/screens/request_proposal/_subscreens/ProposalSubmission'
import { PayoutMode } from 'src/screens/request_proposal/_utils/constants'
import { DropdownOption, GrantFields } from 'src/screens/request_proposal/_utils/types'
// import { today } from 'src/screens/request_proposal/_utils/utils'
import { RFPFormContext, RFPFormProvider } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { addAuthorizedOwner, addAuthorizedUser, bicoDapps, chargeGas, getEventData, getTransactionDetails, networksMapping, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedValidatorNetworkFromChainId } from 'src/utils/validationUtils'

function RequestProposal() {
	const buildComponent = () => {
		return (
			<Flex
				className='card'
				minWidth='90%'
				// gap={8}
				bgColor='white'
				padding={4}
				width='1276px'
				justifyContent='center'
				alignItems='center'
				marginTop={8}
				// marginRight={16}
				// marginLeft={16}
				marginBottom={4}
				alignSelf='center'
				overflow='scroll'
				// position='relative'
			>
				{/* <Button onClick={() => createGrant()}>create grant</Button> */}
				{renderBody()}
			</Flex>
		)
	}

	const renderBody = () => {
		switch (step) {
		case 1:
			return (
				<ProposalSubmission
					proposalName={proposalName}
					setProposalName={setProposalName}
					startdate={startDate!}
					setStartdate={setStartDate}
					endDate={endDate!}
					setEndDate={setEndDate}
					requiredDetails={requiredDetails}
					link={link}
					setLink={setLink}
					doc={doc!}
					setDoc={setDoc}
					step={step}
					setStep={setStep}
					allApplicantDetails={allApplicantDetails}
					setAllApplicantDetails={setAllApplicantDetails}
					extraDetailsFields={extraDetailsFields}
					setExtraDetailsFields={setExtraDetailsFields}
					handleOnEditProposalSubmission={handleOnEdit}
					rfpFormSubmissionType={rfpFormType}
				/>
			)
		case 2:
			return (
				<ProposalReview
					reviewMechanism={reviewMechanism!}
					setReviewMechanism={setReviewMechanism}
					step={step}
					setStep={setStep}
					rubricInputValues={rubricInputValues}
					setRubricInputValues={setRubricInputValues}
					rubrics={rubrics}
					setRubrics={setRubrics}
					rfpFormSubmissionType={rfpFormType}
					handleOnEdit={handleOnEdit}
				 />
			)
		case 3:
			return (
				<>
					<Payouts
						payoutMode={payoutMode}
						setPayoutMode={setPayoutMode}
						amount={amount}
						setAmount={setAmount}
						step={step}
						setStep={setStep}
						milestones={milestones}
						setMilestones={setMilestones}
						shouldCreateRFP={shouldCreateRFP}
						createRFP={createRFP}
						setOpenNetworkTransactionModal={setIsNetworkTransactionModalOpen}
						rfpFormSubmissionType={rfpFormType}
						handleOnEdit={handleOnEdit}
						updateRFP={updateRFP}
					/>
					<NetworkTransactionFlowStepperModal
						isOpen={isNetworkTransactionModalOpen}
						currentStepIndex={currentStepIndex!}
						viewTxnLink={getExplorerUrlForTxHash(network, rfpUpdateTxHash)}
						onClose={
							async() => {
								setCurrentStepIndex(undefined)
								setRole('admin')
								const ret = await router.push({ pathname: '/dashboard' })
								if(ret) {
									router.reload()
								}
							}
						}
					/>
				</>
			)
		case 4: return (
			<LinkMultiSig
				multiSigAddress={multiSigAddress}
				setMultiSigAddress={setMultiSigAddress}
				step={step}
				setStep={setStep}
				selectedSafeNetwork={selectedSafeNetwork!}
				setSelectedSafeNetwork={setSelectedSafeNetwork} />
		)
		case 5: return (
			<>
				<BuilderDiscovery
					domainName={domainName}
					setDomainName={setDomainName}
					domainImage={domainImage!}
					setDomainImage={setDomainImage}
					step={step}
					setIsOpen={setIsNetworkTransactionModalOpen}
					createWorkspace={createWorkspaceAndGrant} />
				<NetworkTransactionFlowStepperModal
					isOpen={isNetworkTransactionModalOpen}
					currentStepIndex={currentStepIndex!}
					viewTxnLink={getExplorerUrlForTxHash(network, txHash)}
					onClose={
						async() => {
							setCurrentStepIndex(undefined)
							setRole('admin')
							const ret = await router.push({ pathname: '/dashboard' })
							if(ret) {
								router.reload()
							}
						}
					}
				/>
			</>
		)
		}
	}

	const { workspace, chainId } = useContext(ApiClientsContext)!

	// State for proposal creation
	// const todayDate = today()
	const [proposalName, setProposalName] = useState('')
	const [startDate, setStartDate] = useState<string>()
	const [endDate, setEndDate] = useState<string>()
	const [shouldCreateRFP, setShouldCreateRFP] = useState(false)

	// const [submitType, setSubmitType] = useState<RFPFormType>('submit')

	const applicantDetails: ApplicantDetailsFieldType[] = applicantDetailsList.filter(detail => detail.isRequired)
		.map(({
			title, id, inputType, isRequired, pii
		}) => {
			return {
				title,
				required: isRequired || false,
				id,
				inputType,
				pii
			}
		})
		.filter((obj) => obj !== null)

	const extraDetailsFieldsList = applicantDetailsList.filter(detail => detail.isRequired === false).map(({
		title, id, inputType, isRequired, pii
	}) => {
		return {
			title,
			required: isRequired || false,
			id,
			inputType,
			pii
		}
	})
		.filter((obj) => obj !== null)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [requiredDetails, setRequiredDetails] = useState<ApplicantDetailsFieldType[]>(applicantDetails)
	const [extraDetailsFields, setExtraDetailsFields] = useState<ApplicantDetailsFieldType[]>(extraDetailsFieldsList)
	const [allApplicantDetails, setAllApplicantDetails] = useState<{ [key: string]: ApplicantDetailsFieldType }>({})
	const [link, setLink] = useState('')
	const [doc, setDoc] = useState<FileList>()

	const [step, setStep] = useState(1)

	// State for Proposal Review
	const [reviewMechanism, setReviewMechanism] = useState<DropdownOption>({
		label: '',
		value: ''

	})
	const [rubrics, setRubrics] = useState({})
	const [rubricInputValues, setRubricInputValues] = useState<string[]>(['Team competence', 'Idea Quality', 'Relevance to our ecosystem'])

	// State for Payouts
	const [payoutMode, setPayoutMode] = useState<DropdownOption>({
		label: '',
		value: ''
	})
	const [amount, setAmount] = useState(0)
	const [milestones, setMilestones] = useState<string[]>([])

	// State for Linking MultiSig
	const [multiSigAddress, setMultiSigAddress] = useState('')
	const [selectedSafeNetwork, setSelectedSafeNetwork] = useState<SafeSelectOption>()

	// State for Builder Discovery
	const [domainName, setDomainName] = useState('')
	const [domainImage, setDomainImage] = useState<File | null>(null)

	// State for Network Transaction Flow
	const [isNetworkTransactionModalOpen, setIsNetworkTransactionModalOpen] = useState(false)
	const [currentStepIndex, setCurrentStepIndex] = useState<number>()

	// state for gasless transactions
	const [txHash, setTxHash] = useState('')

	// state for workspace creation
	// const [workspaceId, setWorkspaceId] = useState('')

	// Webwallet
	const [shouldRefreshNonce, setShouldRefreshNonce] = useState<boolean>()
	const { data: accountDataWebwallet, nonce } = useQuestbookAccount(shouldRefreshNonce)
	const { webwallet } = useContext(WebwalletContext)!

	const { subgraphClients, setRole } = useContext(ApiClientsContext)!
	const { network } = useNetwork()
	const targetContractObject = useQBContract('workspace', network as unknown as SupportedChainId)

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: process.env.NEXT_PUBLIC_IS_TEST === 'true' ? '5' : selectedSafeNetwork?.networkId ? networksMapping[selectedSafeNetwork?.networkId?.toString()] : DEFAULT_NETWORK,
		shouldRefreshNonce: shouldRefreshNonce
	})
	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	const toast = useCustomToast()

	const router = useRouter()

	const grantContract = useQBContract('grantFactory', network)

	const { rfpData, rfpFormType, RFPEditFormData, setRFPEditFormData } = useContext(RFPFormContext)!
	const { updateRFP, txHash: rfpUpdateTxHash } = useUpdateRFP(setCurrentStepIndex, setIsNetworkTransactionModalOpen)

	// useEffect(() => {
	// 	if(role === 'admin' && workspace) {
	// 		setShouldCreateRFP(true)
	// 	}
	// }, [role, workspace])

	useEffect(() => {
		// console.log("add_user", nonce, webwallet)
		if(nonce && nonce !== 'Token expired') {
			return
		}

		if(webwallet) {
			addAuthorizedUser(webwallet?.address)
				.then(() => {
					setShouldRefreshNonce(true)
					// console.log('Added authorized user', webwallet.address)
				})
			// .catch((err) => console.log("Couldn't add authorized user", err))
		}
	}, [webwallet, nonce])

	useEffect(() => {

		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && biconomy.networkId) {
			if(!selectedSafeNetwork?.networkId) {
				setIsBiconomyInitialised(true)
			// eslint-disable-next-line sonarjs/no-duplicated-branches
			} else if(selectedSafeNetwork?.networkId && biconomy.networkId.toString() === networksMapping[selectedSafeNetwork?.networkId?.toString()]) {
				setIsBiconomyInitialised(true)
			}
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, selectedSafeNetwork?.networkId])

	useEffect(() => {
		if(rfpData) {
			// setRequiredDetails(rfpData.allApplicantDetails)
			setExtraDetailsFields(rfpData.allApplicantDetails!)
			setRubrics(rfpData.rubrics)
			// setPayoutMode(rfpData.payoutMode)
			setAmount(parseInt(rfpData.amount))
			setMilestones(rfpData.milestones)
			setProposalName(rfpData.proposalName)
			setStartDate(rfpData.startDate)
			setEndDate(rfpData.endDate)

			if(rfpData.link) {
				setLink(rfpData.link)
			} else {
				setLink('')
			}

			if(rfpData.reviewMechanism === 'voting') {
				setReviewMechanism({
					label: 'Voting',
					value: 'voting',
				})
			} else if(rfpData.reviewMechanism === 'rubrics') {
				setReviewMechanism({
					label: 'Rubric',
					value: 'rubrics',
				})
			}

			if(rfpData.payoutMode === 'in_one_go') {
				setPayoutMode({
					label: PayoutMode.IN_ONE_GO,
					value: 'in_one_go',
				})
			} else if(rfpData.payoutMode === 'milestones') {
				setPayoutMode({
					label: PayoutMode.BASED_ON_MILESTONE,
					value: 'milestones',
				})
			}

			if(rfpData.rubrics?.length > 0) {
				setRubricInputValues(rfpData.rubrics)
			}

			if(rfpData.milestones?.length > 0) {
				setMilestones(rfpData.milestones)
			} else {
				setMilestones([])
			}
		}
	}, [rfpData])

	// create workspace and grant
	const createWorkspaceAndGrant = useCallback(async() => {
		try {
			setCurrentStepIndex(0)
			const uploadedImageHash = (await uploadToIPFS(domainImage)).hash
			const { hash: workspaceCreateIpfsHash } = await validateAndUploadToIpfs('WorkspaceCreateRequest', {
				title: domainName!,
				about: '',
				logoIpfsHash: uploadedImageHash,
				creatorId: accountDataWebwallet!.address!,
				creatorPublicKey: webwallet?.publicKey,
				socials: [],
				supportedNetworks: [
					getSupportedValidatorNetworkFromChainId(network!),
				],
			})

			if(!workspaceCreateIpfsHash) {
				throw new Error('Error validating grant data')
			}

			// if (!selectedSafeNetwork || !network) {
			// 	throw new Error('No network specified')
			// }

			if(!network) {
				throw new Error('No network specified')
			}

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				return
			}

			// setCurrentStepIndex(1)

			const transactionHash = await sendGaslessTransaction(
				biconomy,
				targetContractObject,
				'createWorkspace',
				[workspaceCreateIpfsHash, new Uint8Array(32), multiSigAddress, selectedSafeNetwork ? parseInt(selectedSafeNetwork.networkId) : '0'],
				WORKSPACE_REGISTRY_ADDRESS[network],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${network}`,
				bicoDapps[network].webHookId,
				nonce
			)

			if(!transactionHash) {
				return
			}

			const { txFee: workspaceCreateTxFee, receipt: workspaceCreateReceipt } = await getTransactionDetails(transactionHash, network.toString())
			setTxHash(workspaceCreateReceipt?.transactionHash)
			logger.info({ network, subgraphClients }, 'Network and Client')
			await subgraphClients[network]?.waitForBlock(workspaceCreateReceipt?.blockNumber)

			// setCurrentStepIndex(1)
			const event = await getEventData(workspaceCreateReceipt, 'WorkspaceCreated', WorkspaceRegistryAbi)
			if(event) {
				const workspaceId = Number(event.args[0].toBigInt())
				logger.info('workspace_id', workspaceId)
				const newWorkspace = `chain_${network}-0x${workspaceId.toString(16)}`
				logger.info({ newWorkspace }, 'New workspace created')
				localStorage.setItem(DOMAIN_CACHE_KEY, newWorkspace)
				await addAuthorizedOwner(workspaceId, webwallet?.address!, scwAddress, network.toString(),
					'this is the safe addres - to be updated in the new flow')

				await chargeGas(workspaceId, Number(workspaceCreateTxFee), network)


				// createGrant()
				let fileIPFSHash = ''
				if(doc) {
					const fileCID = await uploadToIPFS(doc[0]!)
					logger.info('fileCID', fileCID)
					fileIPFSHash = fileCID.hash
				}

				let payout: string
				if(payoutMode.label === PayoutMode.IN_ONE_GO) {
					payout = 'in_one_go'
				} else if(payoutMode!.label === PayoutMode.BASED_ON_MILESTONE) {
					payout = 'milestones'
				}

				let review: string = ''
				if(reviewMechanism.label === 'Voting') {
					review = 'voting'
				} else if(reviewMechanism.label === 'Rubric') {
					review = 'rubrics'
				}

				const data: GrantFields = {
					title: proposalName!,
					startDate: startDate!,
					endDate: endDate!,
					// details: allApplicantDetails!,
					link: link!,
					docIpfsHash: fileIPFSHash,
					reward: {
						asset: USD_ASSET!,
						committed: amount.toString()!,
						token: {
							label: 'USD',
							address: USD_ASSET!,
							decimal: USD_DECIMALS.toString(),
							iconHash: USD_ICON
						}
					},
					payoutType: payout!,
					milestones: milestones!,
					creatorId: accountDataWebwallet!.address!,
					workspaceId: workspaceId.toString()!,
					fields: allApplicantDetails,
				}

				if(review) {
					data['reviewType'] = review
				}

				// validate grant data
				const { hash: grantCreateIpfsHash } = await validateAndUploadToIpfs('GrantCreateRequest', data)

				let rubricHash = ''
				if(reviewMechanism.label === 'Rubric') {
					const { hash: auxRubricHash } = await validateAndUploadToIpfs('RubricSetRequest', {
						rubric: {
							rubric: rubrics,
							isPrivate: false
						},
					})

					if(auxRubricHash) {
						rubricHash = auxRubricHash
					}
				}

				logger.info('rubric hash', rubricHash)
				if(workspaceId) {
					const methodArgs = [
						workspaceId.toString(),
						grantCreateIpfsHash,
						rubricHash,
						WORKSPACE_REGISTRY_ADDRESS[network!],
						APPLICATION_REGISTRY_ADDRESS[network!],
					]
					logger.info('methodArgs for grant creation', methodArgs)
					const response = await sendGaslessTransaction(
						biconomy,
						grantContract,
						'createGrant',
						methodArgs,
						grantContract.address,
						biconomyWalletClient!,
						scwAddress!,
						webwallet,
						`${network}`,
						bicoDapps[network!.toString()].webHookId,
						nonce
					)
					if(!response) {
						return
					}

					// setCurrentStep(2)
					setCurrentStepIndex(1)
					const { txFee: createGrantTxFee, receipt: createGrantTxReceipt } = await getTransactionDetails(response, network!.toString())
					setTxHash(createGrantTxReceipt?.transactionHash)
					await subgraphClients[network!].waitForBlock(createGrantTxReceipt?.blockNumber)

					setCurrentStepIndex(2)
					await chargeGas(workspaceId, Number(createGrantTxFee), network!)

					setCurrentStepIndex(3) // 3 is the final step
				} else {
					logger.info('workspaceId not found')
				}
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setCurrentStepIndex(3) // 3 is the final step
			const message = getErrorMessage(e)
			logger.info('error', message)
			toast({
				position: 'top',
				status: 'error',
				title: message,
			})
		}
	}, [biconomyWalletClient, domainName, accountDataWebwallet, allApplicantDetails, link, doc, rubrics, amount, payoutMode, reviewMechanism, startDate, network, biconomy, targetContractObject, scwAddress, webwallet, nonce, selectedSafeNetwork, milestones])

	const handleOnEdit = (field: string, value: string | ApplicantDetailsFieldType[] | string []) => {
		// const { value } = e.target
		logger.info('rfp edited', { ...RFPEditFormData, [field]: value })
		setRFPEditFormData({ ...RFPEditFormData, [field]: value })
	}


	const createRFP = useCallback(async() => {
		try {
			setCurrentStepIndex(0)
			let fileIPFSHash = ''
			if(doc) {
				const fileCID = await uploadToIPFS(doc[0]!)
				logger.info('fileCID', fileCID)
				fileIPFSHash = fileCID.hash
			}

			let payout: string
			if(payoutMode.label === PayoutMode.IN_ONE_GO) {
				payout = 'in_one_go'
			} else if(payoutMode!.label === PayoutMode.BASED_ON_MILESTONE) {
				payout = 'milestones'
			}

			let review: string
			if(reviewMechanism?.label === 'Voting') {
				review = 'voting'
			} else if(reviewMechanism?.label === 'Rubric') {
				review = 'rubrics'
			}

			// validate grant data
			const { hash: grantCreateIpfsHash } = await validateAndUploadToIpfs('GrantCreateRequest', {
				title: proposalName!,
				startDate: startDate!,
				endDate: endDate!,
				// details: allApplicantDetails!,
				link: link!,
				docIpfsHash: fileIPFSHash,
				reward: {
					asset: USD_ASSET!,
					committed: amount.toString()!,
					token: {
						label: 'USD',
						address: USD_ASSET!,
						decimal: USD_DECIMALS.toString(),
						iconHash: USD_ICON
					}
				},
				payoutType: payout!,
				reviewType: review!,
				milestones,
				creatorId: accountDataWebwallet!.address!,
				workspaceId: Number(workspace?.id).toString(),
				fields: allApplicantDetails,
			})

			logger.info('grantCreateIpfsHash', grantCreateIpfsHash)
			let rubricHash = ''

			const { hash: auxRubricHash } = await validateAndUploadToIpfs('RubricSetRequest', {
				rubric: {
					rubric: rubrics,
					isPrivate: false
				},
			})

			if(auxRubricHash) {
				rubricHash = auxRubricHash
			}
			// }

			logger.info('rubric hash', rubricHash)
			logger.info('workspace', workspace)
			if(workspace) {
				const methodArgs = [
					Number(workspace?.id).toString(),
					grantCreateIpfsHash,
					rubricHash,
					WORKSPACE_REGISTRY_ADDRESS[network!],
					APPLICATION_REGISTRY_ADDRESS[network!],
				]
				logger.info('methodArgs for grant creation', methodArgs)
				const response = await sendGaslessTransaction(
					biconomy,
					grantContract,
					'createGrant',
					methodArgs,
					grantContract.address,
						biconomyWalletClient!,
						scwAddress!,
						webwallet,
						`${network}`,
						bicoDapps[network!.toString()].webHookId,
						nonce
				)
				if(!response) {
					return
				}

				// setCurrentStep(2)
				setCurrentStepIndex(1)
				const { txFee: createGrantTxFee, receipt: createGrantTxReceipt } = await getTransactionDetails(response, network!.toString())
				setTxHash(createGrantTxReceipt?.transactionHash)
				await subgraphClients[network!].waitForBlock(createGrantTxReceipt?.blockNumber)

				const event = await getEventData(createGrantTxReceipt, 'GrantCreated', GrantFactoryAbi)

				if(event) {
					const grantId = event.args[0].toString()
					localStorage.setItem(`${GRANT_CACHE_KEY}-${chainId}-${workspace.id}`, grantId)
					logger.info('grantId', grantId, chainId)
					setCurrentStepIndex(2)
					await chargeGas(Number(workspace?.id), Number(createGrantTxFee), network!)

					setCurrentStepIndex(3) // 3 is the final step
				}

			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setCurrentStepIndex(3) // 3 is the final step
			const message = getErrorMessage(e)
			logger.info('error', message)
			toast({
				position: 'top',
				status: 'error',
				title: message,
			})
		}
	}, [biconomyWalletClient, workspace, proposalName, rubrics, accountDataWebwallet, allApplicantDetails, link, doc, rubrics, amount, payoutMode, reviewMechanism, startDate, network, biconomy, targetContractObject, scwAddress, webwallet, nonce, selectedSafeNetwork, milestones])

	return buildComponent()
}

RequestProposal.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderSidebar={false}
			// navbarConfig={{ showDomains: true }}
		>
			<RFPFormProvider>
				{page}
			</RFPFormProvider>
		</NavbarLayout>
	)
}

export default RequestProposal