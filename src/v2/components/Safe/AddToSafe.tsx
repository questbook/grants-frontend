import { useContext, useEffect, useState } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import { DEFAULT_NOTE, INSUFFICIENT_FUNDS_NOTE, USD_THRESHOLD } from 'src/constants'
import { NetworkType } from 'src/constants/Networks'
import useSafeOwners from 'src/hooks/useSafeOwners'
import useSafeUSDBalances from 'src/hooks/useSafeUSDBalances'
import { isValidEthereumAddress, isValidSolanaAddress } from 'src/utils/validationUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import AddressAndSafe from 'src/v2/components/Safe/AddressAndSafe'
import Confirm from 'src/v2/components/Safe/Confirm'
import { SafeSelectOption } from 'src/v2/components/Safe/SafeSelect'
import VerifySignerModal from 'src/v2/components/VerifySignerModal'

function AddToSafe() {
	const { workspace } = useContext(ApiClientsContext)!
	const [step, setStep] = useState<number>(0)

	const [safeAddress, setSafeAddress] = useState<string>('')
	const [isVerified, setIsVerified] = useState<boolean>()
	const [safeAddressError, setSafeAddressError] = useState<string>()

	const [selectedSafe, setSelectedSafe] = useState<SafeSelectOption>()
	const [isVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState<boolean>(false)
	const [isOwner, setIsOwner] = useState<boolean>()
	const [ownerAddress, setOwnerAddress] = useState<string>()

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()

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
		if(step > 0 || safeAddress === '') {
			setSafeAddressError('')
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

	const addSafe = async() => {}

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
						const isValidEthAddress = isValidEthereumAddress(address)
						const isValidSolAddress = isValidSolanaAddress(address)
						logger.info({ isValidEthAddress, isValidSolAddress }, 'Is valid address')
						if(!isValidEthAddress && !isValidSolAddress) {
							setSafeAddressError('Invalid address')
						}
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
			safesOptions={[safesUSDBalance?.some((safe: SafeSelectOption) => safe.amount >= USD_THRESHOLD) ? DEFAULT_NOTE : INSUFFICIENT_FUNDS_NOTE, ...safesUSDBalance!]}
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
						<Text>
							{workspace?.title}
						</Text>
						<Flex mt={1}>
							<Image src={selectedSafe?.safeIcon} />
							<Text ml={2}>
								{selectedSafe?.safeAddress}
							</Text>
						</Flex>
					</Flex>
				}
				currentStepIndex={networkTransactionModalStep || 0}
				steps={
					[
						'Confirming Transaction',
						'Complete Transaction',
						'Complete Indexing',
						'Create domain on the network',
						'Your domain is now on-chain'
					]
				}
				viewLink={undefined}
				onClose={() => setNetworkTransactionModalStep(undefined)} />
		</Flex>
	)
}

export default AddToSafe