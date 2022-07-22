import { useContext, useEffect, useRef, useState } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { GitHubTokenContext, WebwalletContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import getErrorMessage from 'src/utils/errorUtils'
import {
	apiKey,
	getEventData,
	getTransactionReceipt,
	sendGaslessTransaction,
	webHookId,
} from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedValidatorNetworkFromChainId } from 'src/utils/validationUtils'
import CreateDaoFinal from 'src/v2/components/Onboarding/CreateDao/CreateDaoFinal'
import CreateDaoNameInput from 'src/v2/components/Onboarding/CreateDao/CreateDaoNameInput'
import CreateDaoNetworkSelect from 'src/v2/components/Onboarding/CreateDao/CreateDaoNetworkSelect'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import CreateDaoModal from 'src/v2/components/Onboarding/UI/CreateDaoModal'
import BackgroundImageLayout from 'src/v2/components/Onboarding/UI/Layout/BackgroundImageLayout'
import OnboardingCard from 'src/v2/components/Onboarding/UI/Layout/OnboardingCard'
import { useConnect, useNetwork, useSigner } from 'wagmi'

const OnboardingCreateDao = () => {
	const router = useRouter()
	const { data: accountData, nonce } = useQuestbookAccount()
	useEffect(() => {
		console.log('!!!', accountData)
	}, [accountData])
	const [step, setStep] = useState(0)
	const [daoName, setDaoName] = useState<string>()
	const [daoNetwork, setDaoNetwork] = useState<NetworkSelectOption>()
	const [daoImageFile, setDaoImageFile] = useState<File | null>(null)
	const [callOnContractChange, setCallOnContractChange] = useState(false)
	const [currentStep, setCurrentStep] = useState<number>()

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!
	const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		apiKey: apiKey,
		targetContractABI: WorkspaceRegistryAbi,
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	useEffect(() => {
		console.log('THIS IS BICONOMY', biconomy)
		console.log('THIS IS BICONOMY SECOND', biconomyWalletClient)
		if(biconomy && biconomyWalletClient && scwAddress) {
			setIsBiconomyInitialised(true)
		} else {
			setIsBiconomyInitialised(false)
		}
	}, [biconomy, biconomyWalletClient, scwAddress])

	const { activeChain, switchNetworkAsync, data } = useNetwork()
	const {
		connect,
		connectors
	} = useConnect()

	const workspaceRegistryContract = useQBContract('workspace', daoNetwork?.id)
	const { validatorApi } = useContext(ApiClientsContext)!
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const createWorkspace = async() => {
		setCallOnContractChange(false)
		setCurrentStep(0)
		try {
			if(activeChain?.id !== daoNetwork?.id) {
				console.log('switching')
				await switchNetworkAsync!(daoNetwork?.id)
				console.log('create workspace again on contract object update')
				setCallOnContractChange(true)
				setTimeout(() => {
					if(callOnContractChange && activeChain?.id !== daoNetwork?.id) {
						setCallOnContractChange(false)
						throw new Error('Error switching network')
					}
				}, 60000)
				return
			}

			console.log('creating workspace')
			setCurrentStep(1)
			const uploadedImageHash = (await uploadToIPFS(daoImageFile)).hash
			const {
				data: { ipfsHash },
			} = await validatorApi.validateWorkspaceCreate({
				title: daoName!,
				about: '',
				logoIpfsHash: uploadedImageHash,
				creatorId: accountData!.address,
				socials: [],
				supportedNetworks: [
					getSupportedValidatorNetworkFromChainId(daoNetwork!.id),
				],
			})
			if(!ipfsHash) {
				throw new Error('Error validating grant data')
			}

			if(!daoNetwork) {
				throw new Error('No network specified')
			}

			setCurrentStep(2)

			if(!isBiconomyInitialised) {
				return
			}

			if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
				return
			}

			const targetContractObject = new ethers.Contract(
				WORKSPACE_REGISTRY_ADDRESS[daoNetwork.id],
				WorkspaceRegistryAbi,
				webwallet
			)
			console.log('ENTERING')
			console.log(daoNetwork.id, scwAddress, webwallet, nonce, webHookId)

			const transactionHash = await sendGaslessTransaction(
				biconomy,
				targetContractObject,
				'createWorkspace',
				[ipfsHash, new Uint8Array(32), 0],
				WORKSPACE_REGISTRY_ADDRESS[daoNetwork.id],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${daoNetwork.id}`,
				webHookId,
				nonce
			)

			// console.log(transactionHash)
			// const receipt = await getTransactionReceipt(transactionHash)

			// console.log('THIS IS RECEIPT', receipt)

			// const createWorkspaceTransactionData = await getEventData(
			// 	receipt,
			// 	'WorkspaceCreated',
			// 	WorkspaceRegistryAbi
			// )

			// if(createWorkspaceTransactionData) {
			// 	console.log('THIS IS EVENT', createWorkspaceTransactionData.args)
			// }

			// const createWorkspaceTransaction = await workspaceRegistryContract.createWorkspace(ipfsHash, new Uint8Array(32), 0)
			setCurrentStep(3)
			// const createWorkspaceTransactionData = await createWorkspaceTransaction.wait()

			setCurrentStep(5)
			setTimeout(() => {
				router.push({ pathname: '/your_grants' })
			}, 2000)
		} catch(e) {
			setCurrentStep(undefined)
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
	}

	useEffect(() => {
		console.log(workspaceRegistryContract)
		console.log(
			'HERE I AM',
			activeChain?.id,
			daoNetwork?.id,
			callOnContractChange
		)
		//@TODO-gasless: FIX HERE
		if(/*activeChain?.id ===*/ daoNetwork?.id && callOnContractChange) {
			setCallOnContractChange(false)
			createWorkspace()
		}
	}, [workspaceRegistryContract])

	const { data: signer } = useSigner()
	useEffect(() => {
		if(!signer) {
			const connector = connectors.find((x) => x.id === 'injected')
			connect(connector)
		}
	}, [signer])

	const steps = [
		<CreateDaoNameInput
			key={'createdao-onboardingstep-0'}
			daoName={daoName}
			onSubmit={
				(name) => {
					setDaoName(name)
					nextClick()
				}
			}
		/>,
		<CreateDaoNetworkSelect
			key={'createdao-onboardingstep-1'}
			daoNetwork={daoNetwork}
			onSubmit={
				(network) => {
					setDaoNetwork(network)
					nextClick()
				}
			}
		/>,
		<CreateDaoFinal
			key={'createdao-onboardingstep-2'}
			daoNetwork={daoNetwork!}
			daoName={daoName!}
			daoImageFile={daoImageFile}
			onImageFileChange={(image) => setDaoImageFile(image)}
			isBiconomyInitialised={isBiconomyInitialised}
			onSubmit={
				activeChain?.id &&
        daoNetwork?.id &&
        ((activeChain.id !== daoNetwork.id && switchNetworkAsync) ||
          activeChain.id === daoNetwork.id)
					? () => createWorkspace()
					: null
			}
		/>,
	]

	const nextClick = () => {
		if(step === 0) {
			setStep(1)
			return
		}

		if(step === 1) {
			setStep(2)
			return
		}

		router.push({
			pathname: '/',
		})
	}

	const backClick = () => {
		if(step === 2) {
			setStep(1)
			return
		}

		if(step === 1) {
			setStep(0)
			return
		}

		router.back()
	}

	return (
		<>
			<BackgroundImageLayout
				imageSrc={'/onboarding-create-dao.png'}
				imageBackgroundColor={'#C2E7DA'}
				imageProps={
					{
						mixBlendMode: 'color-dodge'
					}
				}
			>
				<OnboardingCard onBackClick={backClick}>
					{steps[step]}
				</OnboardingCard>
			</BackgroundImageLayout>
			<CreateDaoModal
				isOpen={currentStep !== undefined}
				onClose={() => {}}
				daoName={daoName}
				daoNetwork={daoNetwork}
				daoImageFile={daoImageFile}
				steps={
					[
						'Connect your wallet',
						'Uploading data to IPFS',
						'Sign transaction',
						'Waiting for transaction to complete',
						'DAO created on-chain',
					]
				}
				currentStep={currentStep}
			/>
		</>
	)
}

export default OnboardingCreateDao
