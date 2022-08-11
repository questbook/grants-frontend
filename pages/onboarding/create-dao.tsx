import { useContext, useEffect, useRef, useState } from 'react'
import { Box, HStack, Image, Spacer, Text, ToastId, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { WebwalletContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import getErrorMessage from 'src/utils/errorUtils'
import {
	apiKey,
	getTransactionReceipt,
	sendGaslessTransaction,
	webHookId
} from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedValidatorNetworkFromChainId } from 'src/utils/validationUtils'
import { Organization } from 'src/v2/assets/custom chakra icons/Organization'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import CreateDaoFinal from 'src/v2/components/Onboarding/CreateDao/CreateDaoFinal'
import CreateDaoNameInput from 'src/v2/components/Onboarding/CreateDao/CreateDaoNameInput'
import CreateDaoNetworkSelect from 'src/v2/components/Onboarding/CreateDao/CreateDaoNetworkSelect'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import BackgroundImageLayout from 'src/v2/components/Onboarding/UI/Layout/BackgroundImageLayout'
import OnboardingCard from 'src/v2/components/Onboarding/UI/Layout/OnboardingCard'

const OnboardingCreateDao = () => {
	const router = useRouter()
	const { data: accountData, nonce } = useQuestbookAccount()

	const [step, setStep] = useState(0)
	const [daoName, setDaoName] = useState<string>()
	const [daoNetwork, setDaoNetwork] = useState<NetworkSelectOption>()
	const [daoImageFile, setDaoImageFile] = useState<File | null>(null)
	const [callOnContractChange, setCallOnContractChange] = useState(false)
	const [currentStep, setCurrentStep] = useState<number>()
	const { network, switchNetwork } = useNetwork()

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		apiKey: apiKey,
		// targetContractABI: WorkspaceRegistryAbi,
		// chainId: network
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState('not ready')

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress) {
			setIsBiconomyInitialised('ready')
		}
	}, [biconomy, biconomyWalletClient, scwAddress])


	const targetContractObject = useQBContract('workspace', daoNetwork?.id)

	const { validatorApi } = useContext(ApiClientsContext)!
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const createWorkspace = async() => {
		setCallOnContractChange(false)
		setCurrentStep(0)
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
			console.log(12344343);

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				console.log("54321")
				return
			}

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

			await getTransactionReceipt(transactionHash, daoNetwork.id.toString())

			setCurrentStep(3)

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

	// useEffect(() => {

	// 	if(isBiconomyInitialised === "ready" && daoNetwork){
	// 		setCallOnContractChange(false)
	// 		createWorkspace()
	// 		.then(() => {setIsBiconomyInitialised("done")})
	// 	}

	// }, [targetContractObject, isBiconomyInitialised, daoNetwork])


	// Removed for implementing gasless wallet instead of injected connectors.
	// const { data: signer } = useSigner()
	// useEffect(() => {
	// 	if (!signer) {
	// 		const connector = connectors.find((x) => x.id === 'injected')
	// 		connect(connector)
	// 	}
	// }, [signer])

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
					switchNetwork(network.id)
					console.log('NETWORK', network)
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
			onSubmit={() => createWorkspace()}
		// 		activeChain?.id &&
		// daoNetwork?.id &&
		// ((activeChain.id !== daoNetwork.id && switchNetworkAsync) ||
		//   activeChain.id === daoNetwork.id)
		// 			? () => createWorkspace()
		// 			: null
		// 	}
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
			<NetworkTransactionModal
				isOpen={currentStep !== undefined}
				subtitle='creating DAO'
				description={
					<HStack w='100%'>
						<Text
							fontWeight={'500'}
							fontSize={'17px'}
						>
							{daoName}
						</Text>

						<Spacer />

						<Box>
							{
								daoImageFile ? (
									<Image
										objectFit="cover"
										src={URL.createObjectURL(daoImageFile)}
										w="100%"
										h="100%"
										minH={'48px'}
										minW={'48px'}
									/>
								) : (

									<Organization
										color={'#389373'}
										boxSize={8} />
								)
							}
						</Box>
					</HStack>
				}
				currentStepIndex={currentStep || 0}
				steps={
					[
						'Connect your wallet',
						'Uploading data to IPFS',
						'Sign transaction',
						'Waiting for transaction to complete',
						'DAO created on-chain',
					]
				} />
		</>
	)
}

export default OnboardingCreateDao
