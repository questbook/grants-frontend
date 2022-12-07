import { Button, Flex, ToastId, useToast } from "@chakra-ui/react"
import {useRouter} from "next/router"
import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from "react"
import NetworkTransactionFlowStepperModal from "src/components/ui/NetworkTransactionFlowStepperModal"
import ErrorToast from "src/components/ui/toasts/errorToast"
import { WORKSPACE_REGISTRY_ADDRESS } from "src/constants/addresses"
import applicantDetailsList from "src/constants/applicantDetailsList"
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import SupportedChainId from "src/generated/SupportedChainId"
import useQBContract from "src/hooks/contracts/useQBContract"
import { useBiconomy } from "src/hooks/gasless/useBiconomy"
import { useNetwork } from "src/hooks/gasless/useNetwork"
import { useQuestbookAccount } from "src/hooks/gasless/useQuestbookAccount"
import logger from "src/libraries/logger"
import NavbarLayout from "src/libraries/ui/navbarLayout"
import { validateAndUploadToIpfs, validateRequest } from "src/libraries/validator"
import { ApiClientsContext, WebwalletContext } from "src/pages/_app"
import { ApplicantDetailsFieldType, ReviewType } from "src/types"
import getErrorMessage from "src/utils/errorUtils"
import { getExplorerUrlForTxHash } from "src/utils/formattingUtils"
import { addAuthorizedOwner, addAuthorizedUser, bicoDapps, chargeGas, getEventData, getTransactionDetails, networksMapping, sendGaslessTransaction } from "src/utils/gaslessUtils"
import { uploadToIPFS } from "src/utils/ipfsUtils"
import { getSupportedValidatorNetworkFromChainId } from "src/utils/validationUtils"
import { SafeSelectOption } from "src/v2/components/Onboarding/CreateDomain/SafeSelect"
import BuilderDiscovery from "./_subscreens/BuilderDiscovery"
import LinkMultiSig from "./_subscreens/LinkMultiSig"
import Payouts from "./_subscreens/Payouts"
import ProposalReview from "./_subscreens/ProposalReview"
import ProposalSubmission from "./_subscreens/ProposalSubmission"
import { today } from "./_utils/utils"

let typeA: keyof typeof applicantDetailsList 

function RequestProposal() {
    const buildComponent = () => {
        return (
            <Flex className='card' minWidth='90%' gap={8} bgColor='white' padding={4} justifyContent='center' alignItems='center' marginTop={8} marginRight={16} marginLeft={16} marginBottom={4}>
                <Button onClick={() => createGrant()}>create grant</Button>
                {renderBody()}
            </Flex>
        )
    }

    const renderBody = () => {
        switch (step) {
            case 1:
                return (<ProposalSubmission
                    proposalName={proposalName}
                    setProposalName={setProposalName}
                    startdate={startDate}
                    setStartdate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    requiredDetails={requiredDetails}
                    moreDetails={moreDetails}
                    setMoreDetails={setMoreDetails}
                    link={link}
                    setLink={setLink}
                    doc={doc!}
                    setDoc={setDoc}
                    step={step}
                    setStep={setStep}
                    allApplicantDetails={allApplicantDetails}
                    setAllApplicantDetails={setAllApplicantDetails}
                />)
            case 2:
                return (<ProposalReview
                    numberOfReviewers={numberOfReviewers}
                    setNumberOfReviewers={setNumberOfReviewers}
                    reviewMechanism={reviewMechanism}
                    setReviewMechanism={setReviewMechanism}
                    step={step} setStep={setStep}
                    rubrics={rubrics}
                    setRubrics={setRubrics} />)
            case 3:
                return (<Payouts
                    payoutMode={payoutMode}
                    setPayoutMode={setPayoutMode}
                    amount={amount}
                    setAmount={setAmount}
                    step={step}
                    setStep={setStep}
                    milestones={milestones}
                    setMilestones={setMilestones} />)
            case 4: return (<LinkMultiSig
                multiSigAddress={multiSigAddress}
                setMultiSigAddress={setMultiSigAddress}
                step={step}
                setStep={setStep}
                selectedSafeNetwork={selectedSafeNetwork!}
                setSelectedSafeNetwork={setSelectedSafeNetwork}></LinkMultiSig>)
            case 5: return (
                <><BuilderDiscovery
                    domainName={domainName}
                    setDomainName={setDomainName}
                    domainImage={domainImage!}
                    setDomainImage={setDomainImage}
                    step={step}
                    setIsOpen={setIsNetworkTransactionModalOpen}
                    createWorkspace={createWorkspace} />
                    <NetworkTransactionFlowStepperModal
                        isOpen={isNetworkTransactionModalOpen}
                        currentStepIndex={currentStepIndex! }
                        viewTxnLink={getExplorerUrlForTxHash(network, txHash)} 
                        onClose={() => {
                            setCurrentStepIndex(undefined)
                            router.push({ pathname: '/your_grants' })
                            }}/>
                </>)
        }
    }

    // State for proposal creation
    const todayDate = today()
    const [proposalName, setProposalName] = useState('')
    const [startDate, setStartDate] = useState(todayDate)
    const [endDate, setEndDate] = useState('')

    const applicantDetails = applicantDetailsList
		.map(({
			title, id, inputType, isRequired,
		}, index) => {
			if(index === applicantDetailsList.length - 1) {
				return null
			}

			if(index === applicantDetailsList.length - 2) {
				return null
			}

			return {
				title,
				required: isRequired || false,
				id,
				inputType,
			}
		})
		.filter((obj) => obj !== null)
        
    const [requiredDetails, setRequiredDetails] = useState(applicantDetails)
    const [moreDetails, setMoreDetails] = useState([''])
    const [allApplicantDetails, setAllApplicantDetails] = useState<ApplicantDetailsFieldType[]>([])
    const [link, setLink] = useState('')
    const [doc, setDoc] = useState<FileList>()

    const [step, setStep] = useState(1)

    // State for Proposal Review
    const [numberOfReviewers, setNumberOfReviewers] = useState(2)
    const [reviewMechanism, setReviewMechanism] = useState('')
    const [rubrics, setRubrics] = useState({})

    // State for Payouts
    const [payoutMode, setPayoutMode] = useState('')
    const [amount, setAmount] = useState(0)
    const [milestones, setMilestones] = useState({})

    // State for Linking MultiSig
    const [multiSigAddress, setMultiSigAddress] = useState('')
    const [selectedSafeNetwork, setSelectedSafeNetwork] = useState<SafeSelectOption>()

    // State for Builder Discovery
    const [domainName, setDomainName] = useState('')
    const [domainImage, setDomainImage] = useState<File | null>(null);

    // State for Network Transaction Flow
    const [isNetworkTransactionModalOpen, setIsNetworkTransactionModalOpen] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState<number>()

    // state for gasless transactions
    const [txHash, setTxHash] = useState('')

    // state for workspace creation
    const [workspaceId, setWorkspaceId] = useState('')

    // Webwallet
	const [shouldRefreshNonce, setShouldRefreshNonce] = useState<boolean>()
	const { data: accountDataWebwallet, nonce } = useQuestbookAccount(shouldRefreshNonce)
	const { webwallet } = useContext(WebwalletContext)!

    const { validatorApi, subgraphClients } = useContext(ApiClientsContext)!
    const { network } = useNetwork()
    const targetContractObject = useQBContract('workspace', network as unknown as SupportedChainId)

    const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: selectedSafeNetwork?.networkId ? networksMapping[selectedSafeNetwork?.networkId?.toString()] : '',
		shouldRefreshNonce: shouldRefreshNonce
	})
	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

    const toastRef = useRef<ToastId>()
	const toast = useToast()

    const router = useRouter()

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
        console.log('start date', startDate)
    }, [])


    useEffect(() => {

		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && selectedSafeNetwork?.networkId &&
			biconomy.networkId && biconomy.networkId.toString() === networksMapping[selectedSafeNetwork?.networkId?.toString()]) {
			setIsBiconomyInitialised(true)
		}

	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, selectedSafeNetwork?.networkId])


    // create workspace
    const createWorkspace = useCallback(async() => {
		
		try {
			setCurrentStepIndex(0)
			const uploadedImageHash = (await uploadToIPFS(domainImage)).hash
            console.log('domain logo', uploadedImageHash)
			const {
				data: { ipfsHash },
			} = await validatorApi.validateWorkspaceCreate({
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

			if(!ipfsHash) {
				throw new Error('Error validating grant data')
			}

			console.log('sefe', selectedSafeNetwork)
			console.log('network', network)
			if(!selectedSafeNetwork || !network) {
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
				[ipfsHash, new Uint8Array(32), multiSigAddress, parseInt(selectedSafeNetwork.networkId)],
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

			const { txFee, receipt } = await getTransactionDetails(transactionHash, network.toString())
			setTxHash(receipt?.transactionHash)
			logger.info({ network, subgraphClients }, 'Network and Client')
			await subgraphClients[network]?.waitForBlock(receipt?.blockNumber)
			console.log('txFee', txFee)

			setCurrentStepIndex(1)
			const event = await getEventData(receipt, 'WorkspaceCreated', WorkspaceRegistryAbi)
			if(event) {
				const workspaceId = Number(event.args[0].toBigInt())
				console.log('workspace_id', workspaceId)
                setWorkspaceId(workspaceId.toString())
				const newWorkspace = `chain_${network}-0x${workspaceId.toString(16)}`
				logger.info({ newWorkspace }, 'New workspace created')
				localStorage.setItem('currentWorkspace', newWorkspace)
				await addAuthorizedOwner(workspaceId, webwallet?.address!, scwAddress, network.toString(),
					'this is the safe addres - to be updated in the new flow')
				
				await chargeGas(workspaceId, Number(txFee), network)
			}

			setCurrentStepIndex(2)
			setCurrentStepIndex(3) // 3 is the final step
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setCurrentStepIndex(3) // 3 is the final step
			const message = getErrorMessage(e)
			toastRef.current = toast({
				position: 'top',
				render: () => ErrorToast({
					content: message,
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
		}
	}, [biconomyWalletClient, domainName, accountDataWebwallet, network, biconomy, targetContractObject, scwAddress, webwallet, nonce, selectedSafeNetwork])

    // create grant
    // 1. upload document to ipfs
    const createGrant = useCallback(async() => {
        let fileIPFSHash = ''
        if(doc) {
             const fileCID = await uploadToIPFS(doc[0]!)
            console.log('fileCID', fileCID)
            fileIPFSHash = fileCID.hash
        }

        // 2. validate grant data
       const ipfsHash =  validateAndUploadToIpfs("GrantCreateRequest", {
            title: proposalName!,
            startDate: startDate!,
            endDate: endDate!,
            details: moreDetails!,
            link: link!,
            docIpfsHash: fileIPFSHash,
            reward: amount!,
            payoutType: payoutMode!,
            reviewType: reviewMechanism!,
            creatorId: accountDataWebwallet!.address!,
            workspaceId: workspaceId!,
        })

        console.log('ipfsHash', ipfsHash)

        if (reviewMechanism === 'Rubrics') {
            const {
                data: { ipfsHash: auxRubricHash },
            } = await validatorApi.validateRubricSet({
                rubric: rubrics,
            })
        }
        
    }, [accountDataWebwallet])
    
    // 3. create grant


    return buildComponent()
}

RequestProposal.getLayout = function (page: ReactElement) {
    return (
        <NavbarLayout renderSidebar={false}>
            {page}
        </NavbarLayout>
    )
}

export default RequestProposal