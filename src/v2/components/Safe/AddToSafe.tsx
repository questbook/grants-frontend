import { useContext, useEffect, useRef, useState } from 'react'
import { Flex, Image, Text, ToastId, useToast } from '@chakra-ui/react'
import { logger } from 'ethers'
import { useRouter } from 'next/router'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { NetworkType } from 'src/constants/Networks'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useSafeOwners from 'src/hooks/useSafeOwners'
import useSafeUSDBalances from 'src/hooks/useSafeUSDBalances'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, getTransactionDetails, networksMapping, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace, isValidEthereumAddress, isValidSolanaAddress } from 'src/utils/validationUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import AddressAndSafe from 'src/v2/components/Safe/AddressAndSafe'
import Confirm from 'src/v2/components/Safe/Confirm'
import { SafeSelectOption } from 'src/v2/components/Safe/SafeSelect'
import ErrorToast from 'src/v2/components/Toasts/errorToast'
import VerifySignerModal from 'src/v2/components/VerifySignerModal'

function AddToSafe() {
	const router = useRouter()
	const { workspace, subgraphClients } = useContext(ApiClientsContext)!
	const [step, setStep] = useState<number>(0)

	const [safeAddress, setSafeAddress] = useState<string>('')
	const [isVerified, setIsVerified] = useState<boolean>()
	const [safeAddressError, setSafeAddressError] = useState<string>()

	const [selectedSafe, setSelectedSafe] = useState<SafeSelectOption>()
	const [isVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState<boolean>(false)
	const [isOwner, setIsOwner] = useState<boolean>()
	const [ownerAddress, setOwnerAddress] = useState<string>()

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>()

	const toast = useToast()
	const toastRef = useRef<ToastId>()

	const { nonce } = useQuestbookAccount()
	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: selectedSafe?.networkId ? networksMapping[selectedSafe?.networkId?.toString()] : ''
	})
	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && selectedSafe?.networkId &&
			biconomy.networkId && biconomy.networkId.toString() === networksMapping[selectedSafe?.networkId?.toString()]) {
			setIsBiconomyInitialised(true)
		}

	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, selectedSafe?.networkId])

	useEffect(() => {
		logger.info({ biconomyWalletClient }, 'Biconomy wallet client')
	}, [biconomyWalletClient])

	useEffect(() => {
		setSafeAddressError('')
	}, [safeAddress])

	useEffect(() => {
		logger.info({ step }, 'Safe step')
	}, [step])

	useEffect(() => {
		logger.info({ isOwner, ownerAddress, step }, 'Safe isOwner')
		if(isOwner && ownerAddress && ownerAddress !== '' && step === 1) {
			setStep(2)
		}
	}, [isOwner, ownerAddress])

	const { data: safesUSDBalance, loaded: loadedSafesUSDBalance } = useSafeUSDBalances({ safeAddress })

	useEffect(() => {
		const isValidEthAddress = isValidEthereumAddress(safeAddress)
		const isValidSolAddress = isValidSolanaAddress(safeAddress)
		logger.info({ isValidEthAddress, isValidSolAddress }, 'Is valid address')

		if(step > 0 || safeAddress === '') {
			setSafeAddressError('')
		} else if(!isValidEthAddress && !isValidSolAddress) {
			setSafeAddressError('Invalid address')
		} else if(safesUSDBalance?.length === 0 && loadedSafesUSDBalance && safeAddressError === '') {
			setSafeAddressError('No Safe found with this address')
		} else {
			setSafeAddressError('')
		}
		//step === 0 && safeAddress !== '' && loadedSafesUSDBalance && safesUSDBalance?.length === 0
	}, [step, safeAddress, loadedSafesUSDBalance, safesUSDBalance])

	useEffect(() => {
		if(loadedSafesUSDBalance && safesUSDBalance?.length > 0) {
			setIsVerified(true)
			setStep(1)
		}
	}, [safesUSDBalance, loadedSafesUSDBalance])

	const { data: safeOwners } = useSafeOwners({ safeAddress, chainID: selectedSafe?.networkId, type: selectedSafe?.networkType ?? NetworkType.EVM })
	useEffect(() => {
		logger.info({ safeOwners }, 'Safe owners')
	}, [safeOwners])

	const workspaceContract = useQBContract('workspace', getSupportedChainIdFromWorkspace(workspace))

	const addSafe = async() => {
		try {
			setNetworkTransactionModalStep(0)

			if(!selectedSafe) {
				throw new Error('No Safe selected')
			}

			logger.info({ selectedSafe }, 'Selected Safe')

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				logger.info({ biconomyWalletClient, scwAddress }, 'Biconomy State')
				throw new Error('Biconomy wallet client not initialised')
			}

			const chainId = getSupportedChainIdFromWorkspace(workspace)

			if(!chainId) {
				throw new Error('No network specified')
			}

			const transactionHash = await sendGaslessTransaction(
				biconomy,
				workspaceContract,
				'updateWorkspaceSafe',
				[Number(workspace?.id), new Uint8Array(32), safeAddress, parseInt(selectedSafe.networkId)],
				WORKSPACE_REGISTRY_ADDRESS[chainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			if(!transactionHash) {
				throw new Error('Transaction hash not received')
			}

			setNetworkTransactionModalStep(1)

			const { receipt } = await getTransactionDetails(transactionHash, chainId.toString())
			setTransactionHash(receipt?.transactionHash)

			setNetworkTransactionModalStep(2)

			await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)
			// console.log('txFee', txFee)

			setNetworkTransactionModalStep(4)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setNetworkTransactionModalStep(undefined)
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

	const STEPS = [
		<AddressAndSafe
			key={0}
			step={step}
			safeAddress={safeAddress}
			onChange={
				(e) => {
					const address = e.target.value
					setSafeAddress(address)
					if(!loadedSafesUSDBalance) {

					}
				}
			}
			onPasteClick={
				async() => {
					let clipboardContent = await navigator.clipboard.readText()
					logger.info({ clipboardContent }, 'Clipboard content')
					clipboardContent = clipboardContent.substring(clipboardContent.indexOf(':') + 1)
					logger.info({ clipboardContent }, 'Clipboard content (formatted)')
					setSafeAddress(clipboardContent)
				}
			}
			isVerified={isVerified !== undefined && safesUSDBalance?.length > 0 && selectedSafe !== undefined}
			isDisabled={step !== 0}
			safeAddressError={safeAddressError}
			onContinue={
				() => {
					if(step === 0) {
						setStep(1)
					} else if(step === 1) {
						setIsVerifySignerModalOpen(true)
					}
				}
			}
			isLoading={!loadedSafesUSDBalance && safeAddress !== ''}
			safesOptions={safesUSDBalance}
			selectedSafe={selectedSafe}
			onSelectedSafeChange={
				(safe) => {
					if(safe) {
						setSelectedSafe(safe)
					}
				}
			} />,
		<Confirm
			key={1}
			align='center'
			safeIcon={selectedSafe?.safeIcon}
			safeAddress={safeAddress}
			signerAddress={ownerAddress ?? ''}
			onAddToSafeClick={addSafe}
			onCancelClick={() => setStep(0)} />
	]

	return (
		<Flex
			bg='#F5F5F5'
			direction='column'
			w='100%'
			px={8}
			py={6}>
			<Text
				variant='v2_heading_3'
				fontWeight='700'>
				Safe
			</Text>
			<Flex
				mt={4}
				py={10}
				w='100%'
				borderRadius='4px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				bg='white'
				direction='column'
			 >
				{step <= 1 ? STEPS[0] : STEPS[1]}
			</Flex>
			<VerifySignerModal
				owners={safeOwners}
				isOpen={isVerifySignerModalOpen}
				onClose={() => setIsVerifySignerModalOpen(false)}
				setIsOwner={
					(newState) => {
						setIsVerifySignerModalOpen(false)
						setIsOwner(newState)
						setStep(2)
					}
				}
				networkType={selectedSafe?.networkType ?? NetworkType.EVM}
				setOwnerAddress={(owner) => setOwnerAddress(owner)} />
			<NetworkTransactionModal
				isOpen={networkTransactionModalStep !== undefined}
				subtitle='Adding Safe'
				description={
					<Flex
						w='100%'
						direction='column'>
						<Text variant='v2_body'>
							{workspace?.title}
						</Text>
						<Flex mt={1}>
							<Image src={selectedSafe?.safeIcon} />
							<Text
								variant='v2_body'
								fontWeight='500'
								ml={2}>
								{selectedSafe?.safeAddress}
							</Text>
						</Flex>
					</Flex>
				}
				currentStepIndex={networkTransactionModalStep || 0}
				steps={
					[
						'Confirming Transaction',
						'Completing Transaction',
						'Completing Indexing',
						'Adding safe to your domain on the network',
					]
				}
				viewLink={getExplorerUrlForTxHash(getSupportedChainIdFromWorkspace(workspace), transactionHash)}
				onClose={
					() => {
						setNetworkTransactionModalStep(undefined)
						router.reload()
					}
				} />
		</Flex>
	)
}

export default AddToSafe