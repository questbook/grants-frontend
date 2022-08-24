import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Box, Flex, HStack, Image, Spacer, Text, ToastId, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { CHAIN_INFO } from 'src/constants/chains'
import { NetworkType } from 'src/constants/Networks'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import SupportedChainId from 'src/generated/SupportedChainId'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useSafeOwners from 'src/hooks/useSafeOwners'
import useSafeUSDBalances from 'src/hooks/useSafeUSDBalances'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { addAuthorizedOwner, addAuthorizedUser, bicoDapps, chargeGas, getEventData, getTransactionDetails, networksMapping, sendGaslessTransaction } from 'src/utils/gaslessUtils'
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
import usePhantomWallet from 'src/v2/hooks/usePhantomWallet'
import { useAccount, useDisconnect } from 'wagmi'


const OnboardingCreateDomain = () => {
	const router = useRouter()
	const [step, setStep] = useState(0)
	const [currentStep, setCurrentStep] = useState<number>()
	const { network } = useNetwork()

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
	const { data: safeOwners } = useSafeOwners({ safeAddress, chainID: safeSelected?.networkId, type: safeSelected?.networkType ?? NetworkType.EVM })
	const [ txHash, setTxHash ] = useState('')
	const [ownerAddress, setOwnerAddress] = useState('')

	const [isDomainCreationSuccessful, setIsDomainCreationSuccessful] = useState(false)

	// Wagmi
	const { data: accountData } = useAccount()
	const { disconnect } = useDisconnect()

	// Solana
	const { phantomWallet } = usePhantomWallet()

	// Webwallet
	const [shouldRefreshNonce, setShouldRefreshNonce] = useState<boolean>()
	const { data: accountDataWebwallet, nonce } = useQuestbookAccount(shouldRefreshNonce)
	const { webwallet } = useContext(WebwalletContext)!
	console.log('safeSelected', safeSelected)
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: safeSelected?.networkId ? networksMapping[safeSelected?.networkId?.toString()] : '',
	})
	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	useEffect(() => {
		const isBiconomyLoading = localStorage.getItem('isBiconomyLoading') === 'true'
		console.log('rree', isBiconomyLoading, biconomyLoading)
		console.log('networks 2:', biconomy?.networkId?.toString(), safeSelected?.networkId, safeSelected?.networkId ?
			networksMapping[safeSelected?.networkId?.toString()] : undefined)
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && safeSelected?.networkId &&
			biconomy.networkId && biconomy.networkId?.toString() === networksMapping[safeSelected?.networkId?.toString()]) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, safeSelected?.networkId])

	useEffect(() => {
		disconnect()
	}, [])

	useEffect(() => {
		if(isOwner) {
			setIsVerifySignerModalOpen(false)
		}
	}, [isOwner])


	const targetContractObject = useQBContract('workspace', network as unknown as SupportedChainId)

	const { validatorApi } = useContext(ApiClientsContext)!

	const toastRef = useRef<ToastId>()
	const toast = useToast()

	useEffect(() => {
		console.log('cur step', step)
		if(step === 3 && !isOwner) {

		}

	}, [accountData, safeOwners, step, isOwner])

	useEffect(() => {
		if(nonce && nonce !== 'Token expired') {
			return
		}

		if(isOwner && webwallet) {
			addAuthorizedUser(webwallet?.address)
				.then(() => {
					setShouldRefreshNonce(true)
					console.log('Added authorized user', webwallet.address)
				})
				.catch((err) => console.log("Couldn't add authorized user", err))
		}
	}, [isOwner, webwallet, nonce])

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

	useEffect(() => {
		console.log('safeSelected', safeSelected)
	}, [safeSelected])

	const createWorkspace = useCallback(async() => {
		console.log(network)
		if(!network) {
			return
		}

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
			console.log('all', biconomy, scwAddress, nonce, webwallet)
			// console.log('creating workspace', accountData!.address)
			console.log(accountDataWebwallet?.address)
			setCurrentStep(1)
			const uploadedImageHash = (await uploadToIPFS(daoImageFile)).hash

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
					getSupportedValidatorNetworkFromChainId(network),
				],
			})

			if(!ipfsHash) {
				throw new Error('Error validating grant data')
			}

			console.log('sefe', safeSelected)
			console.log('network', network)
			if(!safeSelected || !network) {
				throw new Error('No network specified')
			}

			setCurrentStep(2)
			console.log(12344343)

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				console.log('54321')
				return
			}

			const transactionHash = await sendGaslessTransaction(
				biconomy,
				targetContractObject,
				'createWorkspace',
				[ipfsHash, new Uint8Array(32), safeAddress, 1],
				WORKSPACE_REGISTRY_ADDRESS[network as unknown as SupportedChainId],
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

			setCurrentStep(3)

			const { txFee, receipt } = await getTransactionDetails(transactionHash, network.toString())

			console.log('txFee', txFee)

			const event = await getEventData(receipt, 'WorkspaceCreated', WorkspaceRegistryAbi)
			if(event) {
				const workspace_id = Number(event.args[0].toBigInt())
				console.log('workspace_id', workspace_id)

				await addAuthorizedOwner(workspace_id, webwallet?.address!, scwAddress, network.toString(),
					'this is the safe addres - to be updated in the new flow')
				console.log('fdsao')
				await chargeGas(workspace_id, Number(txFee))
			}

			setCurrentStep(5)
			// setTimeout(() => {
			// 	router.push({ pathname: '/your_grants' })
			// }, 2000)
			setTxHash(txHash)
			setIsDomainCreationSuccessful(true)
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
	}, [biconomyWalletClient, domainName, accountDataWebwallet, network, biconomy, targetContractObject, scwAddress, webwallet, nonce, safeSelected])

	const steps = [
		<SafeDetails
			safesOptions={safesUSDBalance}
			key={0}
			step={step}
			safeAddress={safeAddress}
			isPasted={isSafeAddressPasted}
			isVerified={isSafeAddressVerified}
			isLoading={!loadedSafesUSDBalance}
			setValue={
				(newValue) => {
					setSafeAddress(newValue)
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
			onSelectedSafeChange={(newSafe) => setSafeSelected(newSafe)} />, <DomainName
			key={1}
			domainName={domainName}
			setValue={
				(newValue) => {
					setDomainName(newValue)
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
			domainNetwork={network ? CHAIN_INFO[network].name : 'Polygon'}
			domainNetworkIcon={network ? CHAIN_INFO[network].icon : CHAIN_INFO[137].icon} // polygon is the default network
			domainImageFile={daoImageFile}
			isBiconomyInitialised={isBiconomyInitialised}
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
						// setIsOwner(false)
						createWorkspace()
					}
				}
			}
			isVerified={isOwner}
			signerAddress={ownerAddress} />
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
				setOwnerAddress={(newOwnerAddress) => setOwnerAddress(newOwnerAddress)}
				networkType={safeSelected?.networkType ?? NetworkType.EVM}
				setIsOwner={
					(newState) => {
						setIsOwner(newState)
					}
				}
				owners={safeOwners}
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
				}
				networkName={network ? CHAIN_INFO[network].name : undefined}
				daoLink={network && txHash ? getExplorerUrlForTxHash(network, txHash) : undefined}
			/>
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
