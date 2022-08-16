import { useContext, useEffect, useRef, useState } from 'react'
import { Box, Flex, HStack, Image, Spacer, Text, ToastId, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import SupportedChainId from 'src/generated/SupportedChainId'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useSafeOwners from 'src/hooks/useSafeOwners'
import useSafeUSDBalances from 'src/hooks/useSafeUSDBalances'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, getTransactionReceipt, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedValidatorNetworkFromChainId } from 'src/utils/validationUtils'
import { Organization } from 'src/v2/assets/custom chakra icons/Organization'
import AccountDetails from 'src/v2/components/NavBar/AccountDetails'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import { ConfirmData, DomainName, SafeDetails } from 'src/v2/components/Onboarding/CreateDomain'
import { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'
import SuccessfulDomainCreationModal from 'src/v2/components/Onboarding/CreateDomain/SuccessfulDomainCreationModal'
import QuestbookLogo from 'src/v2/components/QuestbookLogo'
import VerifySignerModal from 'src/v2/components/VerifySignerModal'
import { useAccount, useDisconnect } from 'wagmi'

const OnboardingCreateDomain = () => {
	const router = useRouter()
	const [step, setStep] = useState(0)
	const [currentStep, setCurrentStep] = useState<number>()


	// State variables for step 0 and 1
	const [safeAddress, setSafeAddress] = useState('')
	const [isSafeAddressPasted, setIsSafeAddressPasted] = useState(false)
	const [isSafeAddressVerified, setIsSafeAddressVerified] = useState(false)
	const { data: safesUSDBalance, loaded: loadedSafesUSDBalance } = useSafeUSDBalances({ safeAddress })
	const [safeSelected, setSafeSelected] = useState<SafeSelectOption>()

	// State variables for step 2
	const [domainName, setDomainName] = useState('')
	const [isDomainNameVerified, setIsDomainNameVerified] = useState(false)

	// State variables for step 3 and 4
	const [daoImageFile, setDaoImageFile] = useState<File | null>(null)
	const [isOwner, setIsOwner] = useState(false)
	const [isVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState(false)
	const { data: safeOwners } = useSafeOwners({ safeAddress, chainID: safeSelected?.networkId ?? '' })

	const [isDomainCreationSuccessful, setIsDomainCreationSuccessful] = useState(false)

	// Wagmi
	const { data: accountData } = useAccount()
	const { disconnect } = useDisconnect()

	const { data: accountDataWebwallet, nonce } = useQuestbookAccount()

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: safeSelected?.networkId ?? ''
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState('not ready')

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress) {
			setIsBiconomyInitialised('ready')
		}
	}, [biconomy, biconomyWalletClient, scwAddress])


	const targetContractObject = useQBContract('workspace', safeSelected?.networkId as unknown as SupportedChainId)

	const { validatorApi } = useContext(ApiClientsContext)!

	const toastRef = useRef<ToastId>()
	const toast = useToast()

	useEffect(() => {
		if(step === 3) {
			if(accountData?.address && safeOwners.includes(accountData?.address)) {
				setIsOwner(true)
				setIsVerifySignerModalOpen(false)
				alert('Your safe ownership is proved.')
			} else {
				setIsOwner(false)
				if(accountData?.address) {
					disconnect()
				}

				alert('Whoops! Looks like this wallet is not a signer on the safe.')
			}
		}

	}, [accountData, safeOwners, step])

	useEffect(() => {
		if(!setIsSafeAddressVerified) {
			return
		}

		if(Object.keys(safesUSDBalance).length > 0) {
			setIsSafeAddressVerified(true)
			setIsSafeAddressPasted(true)
		} else {
			setIsSafeAddressVerified(false)
			setIsSafeAddressPasted(false)
		}
	}, [safesUSDBalance])

	useEffect(() => {
		if(!setIsDomainNameVerified) {
			return
		}

		setIsDomainNameVerified(domainName.length > 0)
	}, [domainName])

	const createWorkspace = async() => {
		// setCallOnContractChange(false)
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

			console.log('creating workspace', accountData!.address)
			setCurrentStep(1)
			const uploadedImageHash = (await uploadToIPFS(daoImageFile)).hash

			const {
				data: { ipfsHash },
			} = await validatorApi.validateWorkspaceCreate({
				title: domainName!,
				about: '',
				logoIpfsHash: uploadedImageHash,
				creatorId: accountDataWebwallet!.address!,
				socials: [],
				supportedNetworks: [
					getSupportedValidatorNetworkFromChainId(safeSelected?.networkId as unknown as SupportedChainId),
				],
			})

			if(!ipfsHash) {
				throw new Error('Error validating grant data')
			}

			if(safeSelected?.networkId) {

				throw new Error('No network specified')
			}

			setCurrentStep(2)
			console.log(12344343)

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				console.log('54321')
				return
			}

			if(!safeSelected) {
				return
			}

			const transactionHash = await sendGaslessTransaction(
				biconomy,
				targetContractObject,
				'createWorkspace',
				[ipfsHash, new Uint8Array(32), 0],
				WORKSPACE_REGISTRY_ADDRESS[safeSelected.networkId as unknown as SupportedChainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${safeSelected.networkId}`,
				bicoDapps[safeSelected.networkId].webHookId,
				nonce
			)

			await getTransactionReceipt(transactionHash, `${safeSelected.networkId}`)

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

	const steps = [
		<SafeDetails
			safesOptions={safesUSDBalance}
			key={0}
			step={step}
			safeAddress={safeAddress}
			isPasted={isSafeAddressPasted}
			isVerified={isSafeAddressVerified}
			isLoading={!loadedSafesUSDBalance}
			onChange={
				(e) => {
					setSafeAddress(e.target.value)
				}
			}
			onContinue={
				() => {
					if(step === 0) {
						setStep(1)
					} else if(step === 1) {
						setStep(2)
					}
				}
			}
			safeSelected={safeSelected!}
			onSelectedSafeChange={setSafeSelected} />, <DomainName
			key={1}
			domainName={domainName}
			onChange={
				(e) => {
					setDomainName(e.target.value)
				}
			}
			isVerified={isDomainNameVerified}
			setIsVerified={setIsDomainNameVerified}
			onContinue={
				() => {
					setStep(3)
				}
			} />, <ConfirmData
			key={2}
			safeAddress={safeAddress}
			safeChainIcon="/ui_icons/gnosis.svg"
			domainName={domainName}
			domainNetwork="Polygon"
			domainNetworkIcon='/ui_icons/polygon.svg'
			domainImageFile={daoImageFile}
			onImageFileChange={(image) => setDaoImageFile(image)}
			onCreateDomain={
				() => {
					console.log('Is Owner: ', isOwner)
					if(!isOwner && !isVerifySignerModalOpen) {
						setIsVerifySignerModalOpen(true)
						// setIsOwner(true)
					} else if(isOwner) {
						// This would open the Network Transaction Modal
						// setCurrentStep(1)
						// This would open the final successful domain creation modal
						// setIsVerifySignerModalOpen(true)
						// setIsDomainCreationSuccessful(true)
						// setIsOwner(false)
						createWorkspace()
					}
				}
			}
			isVerified={isOwner}
			signerAddress="0xE6379586E5D8350038E9126c5553c0C77549B6c3" />
	]


	return (
		<>
			<Flex
				position="absolute"
				left={0}
				right={0}
				top={0}
				bottom={0}
				zIndex={-1} >
				<Image
					src="/background/create-domain.jpg"
					w="100%"
					h="100%" />
			</Flex>

			<Flex
				direction="column"
				w="100vw"
				h="100vh">
				<Flex
					w="100vw"
					h="64px"
					align="center"
					px="42px">
					<QuestbookLogo color='white' />
					<Box mr="auto" />
					<AccountDetails />
				</Flex>

				{

					<Flex
						key={step}
						w="47%"
						h={step === 0 ? '43%' : (step === 1 ? '55%' : (step === 2 ? '38%' : (isOwner ? '36%' : '40%')))}
						mx="auto"
						mt="15vh"
						bg="white"
						p={6}
						boxShadow="2.2px 4.43px 44.33px rgba(31, 31, 51, 0.05)"
						borderRadius="4px"
						direction="column">
						{step <= 1 ? steps[0] : (step === 2 ? steps[1] : steps[2])}
					</Flex>

				}
			</Flex>
			<NetworkTransactionModal
				isOpen={currentStep !== undefined}
				subtitle='creating DAO'
				description={
					<HStack w='100%'>
						<Text
							fontWeight={'500'}
							fontSize={'17px'}
						>
							{domainName}
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
						'Confirming Transaction',
						'Complete Transaction',
						'Complete indexing',
						'Create domain on the network',
						'Your domain is now on-chain'
					]
				} />
			<VerifySignerModal
				isOpen={isVerifySignerModalOpen}
				onClose={
					() => {
						setIsVerifySignerModalOpen(false)
					}
				} />
			<SuccessfulDomainCreationModal
				isOpen={isDomainCreationSuccessful}
				onClose={
					() => {
						setIsDomainCreationSuccessful(false)
					}
				} />
		</>
	)
}

// OnboardingCreateDomain.getLayout = function(page: ReactElement) {
// 	return (
// 		<NavbarLayout renderSidebar={false}>
// 			{page}
// 		</NavbarLayout>
// 	)
// }

export default OnboardingCreateDomain
