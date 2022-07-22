import { useContext, useEffect, useRef, useState } from 'react'
import { Box, HStack, Image, Spacer, Text, ToastId, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import useQBContract from 'src/hooks/contracts/useQBContract'
import getErrorMessage from 'src/utils/errorUtils'
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
import { useAccount, useConnect, useNetwork, useSigner } from 'wagmi'

const OnboardingCreateDao = () => {
	const router = useRouter()
	const { data: accountData } = useAccount()
	const [step, setStep] = useState(0)
	const [daoName, setDaoName] = useState<string>()
	const [daoNetwork, setDaoNetwork] = useState<NetworkSelectOption>()
	const [daoImageFile, setDaoImageFile] = useState<File | null>(null)
	const [callOnContractChange, setCallOnContractChange] = useState(false)
	const [currentStep, setCurrentStep] = useState<number>()

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
				creatorId: accountData!.address!,
				socials: [],
				supportedNetworks: [getSupportedValidatorNetworkFromChainId(daoNetwork!.id)],
			})
			if(!ipfsHash) {
				throw new Error('Error validating grant data')
			}

			setCurrentStep(2)
			const createWorkspaceTransaction = await workspaceRegistryContract.createWorkspace(ipfsHash, new Uint8Array(32), 0)
			setCurrentStep(3)
			await createWorkspaceTransaction.wait()

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
		if(activeChain?.id === daoNetwork?.id && callOnContractChange) {
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
			} />,
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
			onSubmit={activeChain?.id && daoNetwork?.id && ((activeChain.id !== daoNetwork.id && switchNetworkAsync) || (activeChain.id === daoNetwork.id)) ? () => createWorkspace() : null}
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
			pathname: '/'
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
						'DAO created on-chain'
					]
				} />
		</>
	)
}

export default OnboardingCreateDao