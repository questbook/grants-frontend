import { useEffect, useMemo, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { logger } from 'ethers'
import { NetworkType } from 'src/constants/Networks'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
// import useSafeUSDBalances from "src/hooks/useSafeUSDBalances";
import VerifySignerModal from 'src/screens/request_proposal/_components/VerifySignerModal'
import SafeSelect, { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'
// import useSafeOwners from "src/hooks/useSafeOwners";


interface Props {
	multiSigAddress: string
	setMultiSigAddress: (value: string) => void
	step: number
	setStep: (value: number) => void
	selectedSafeNetwork: SafeSelectOption
	setSelectedSafeNetwork: (value: SafeSelectOption) => void
}

function LinkMultiSig({ multiSigAddress, setMultiSigAddress, step, setStep, selectedSafeNetwork, setSelectedSafeNetwork }: Props) {
	// console.log('selectedSafeNetwork', selectedSafeNetwork)
	const buildComponent = () => {
		return (
			<>
				<Flex alignSelf='flex-start'>
					<Button
						className='backBtn'
						variant='linkV2'
						leftIcon={<BsArrowLeft />}
						onClick={() => setStep(3)}>
						Back
					</Button>
				</Flex>

				<Flex
					className='rightScreenCard'
					flexDirection='column'
					width='100%'
					height='100%'
					gap={10}
					alignSelf='flex-start'
					// alignItems='center'
					marginRight={24}
				>
					<StepIndicator step={step} />
					<Flex
						direction='column'
						alignItems='center'
						gap={10}>
						<Flex
							direction='column'
							gap={2}
							alignItems='center'>
							<Text
								alignSelf='center'
								fontWeight='500'
								fontSize='24px'
								lineHeight='32px'
							>
								Where’s the money for the grants?
							</Text>
							<Text>
								The money will always stay in your multi sig.
							</Text>
						</Flex>

						<Flex
							direction='column'
							gap={10}
							// justifyContent='center'
							alignSelf='flex-start'
						>
							<Flex
								gap={4}
								alignItems='baseline'
								marginTop={12}>
								<Text variant='v2_subheading'>
									All the builders will be paid out from
								</Text>
								<FlushedInput
									placeholder='Solana or EVM address'
									value={multiSigAddress}
									onChange={
										(e) => {
											if(e.target.value.includes(':')) {
												setMultiSigAddress(e.target.value.split(':')[1])
											} else {
												setMultiSigAddress(e.target.value)
											}

										}
									} />
							</Flex>

							{safeState === 0 && (renderSearchingSafe())}
							{safeState === 1 && (renderSingleSafe())}
							{safeState === 2 && (renderSafeDropdown())}


						</Flex>

						<Flex
							direction='column'
							gap={1}
							alignItems='center'
							position='absolute'
							// bottom='80px'
							bottom={8}
						>
							<Text>
								We currently support
							</Text>
							<Flex gap={2}>
								<Image
									boxSize={16}
									src='/safes_icons/safe_logo.svg' />
								<Image
									boxSize={16}
									src='/safes_icons/realms_logo.svg' />
								<Image
									boxSize={16}
									src='/safes_icons/celo_safe.svg' />
							</Flex>
							<Text p={8}>
								Why do I need a multisig?
							</Text>
						</Flex>

						<Flex
							gap={8}
							width='100%'
							justifyContent='flex-end'
							// direction='row-reverse'
							alignItems='center'
							position='absolute'
							bottom='50px'
						>


							<Button
								variant='link'
								onClick={() => setStep(5)}>
								Skip for now
							</Button>
							<Button
								variant='primaryMedium'
								w='144px'
								h='48px'
								isDisabled={safeState !== 1 && !selectedSafeNetwork}
								onClick={() => setIsVerifySignerModalOpen(true)}>
								Link multisig
							</Button>
						</Flex>

					</Flex>
					{/* <Flex gap={1}>
						<Text
							variant='v2_body'
							color='black.3'>
							By continuing, you accept Questbook’s
						</Text>
						<Text
							variant='v2_body'
							fontWeight='500'>
							Terms of Service
						</Text>
					</Flex> */}

				</Flex>

				<VerifySignerModal
					owners={selectedSafeNetwork ? selectedSafeNetwork.owners : []}
					// setOwnerAddress={(newOwnerAddress) => setOwnerAddress(newOwnerAddress)}
					setIsOwner={
						(newState) => {
							setIsOwner(newState)
						}
					}
					networkType={selectedSafeNetwork?.networkType ?? NetworkType.EVM}
					isOpen={IsVerifySignerModalOpen}
					onClose={() => setIsVerifySignerModalOpen(false)} />

			</>
		)
	}

	const renderSearchingSafe = () => {
		return (
			<Flex
				className='loaderHelperText'
				gap={2}
				position='relative'
				left='386px'
				top='-40px' >
				<Image
					className='loader'
					src='/ui_icons/loader.svg'
					color='black.1'
				/>
				<Text
					variant='v2_body'
					color='black.3'>
					Searching for this address on different networks..
				</Text>
			</Flex>
		)
	}

	const renderSingleSafe = () => {
		setSelectedSafeNetwork(safeNetworks[0])
		return (
			<Flex
				gap={4}
				alignItems='baseline'>
				<Text variant='v2_subheading'>
					This multisig  is on
					{' '}
					<span style={{ textDecorationLine: 'underline' }}>
						{safeNetworks[0].networkName}
					</span>
					{' '}
					and currently has a balance of
					{' '}
					<span style={{ textDecorationLine: 'underline' }}>
						{safeNetworks[0].amount}
					</span>
					{' '}
					USD
				</Text>
			</Flex>
		)
	}

	const renderSafeDropdown = () => {
		return (
			<>
				<Flex
					className='loaderHelperText'
					position='relative'
					left='386px'
					top='-40px'
					gap={2}
					mb={4}>
					{
						safeNetworks.length > 1 ? (
							<>
								<Image
									src='/ui_icons/Done_all_alt_round.svg'
									color='#273B4A' />
								<Text
									variant='v2_body'>
									{`Looks like this address is on ${safeNetworks.length} networks`}
								</Text>

							</>
						) : (
							<Button
								variant='link'
								color='red'
								fontSize='14px'
								style={{ cursor: 'pointer' }}
							>
								But this address doesn’t exist on any of the 20 supported chains.
							</Button>
						)
					}


				</Flex>
				{
					safeNetworks.length ? (
						<SafeSelect
							safesOptions={safeNetworks}
							label=''
							helperText=''
							value={selectedSafeNetwork}
							onChange={
								(safeSelected: SafeSelectOption | undefined) => {
									if(safeSelected) {
										setSelectedSafeNetwork(safeSelected)
									}
								}
							} />
					) : <></>
				}
			</>
		)
	}

	const [safeNetworks, setSafeNetworks] = useState<SafeSelectOption[]>([])
	const [IsVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState(false)
	const [isOwner, setIsOwner] = useState(false)
	const [safeState, setSafeState] = useState(-1)
	const [loadingSafeData, setLoadingSafeData] = useState(false)

	// const [ownerAddress, setOwnerAddress] = useState('')

	// const { data: safeOwners } = useSafeOwners({ safeAddress: multiSigAddress, chainID: selectedSafeNetwork?.networkId, type: selectedSafeNetwork?.networkType ?? NetworkType.EVM })

	// const { data: safesUSDBalance, loaded: loadedSafesUSDBalance } = useSafeUSDBalances({ safeAddress: multiSigAddress })

	// useEffect(() => {
	//     setSafeNetworks([])
	//     console.log('Multi-sig address entered', multiSigAddress)
	//     console.log('Safe USD balance', safesUSDBalance)
	//     console.log('Loaded Safe USD balance', loadedSafesUSDBalance)
	//     // const networks = []
	//     // for (let i = 0; i < safesUSDBalance.length; i++) {
	//     //     console.log('network', safesUSDBalance[i].networkName)
	//     //     networks.push(safesUSDBalance[i].networkName)

	//     // }
	//     setSafeNetworks(safesUSDBalance)
	// }, [multiSigAddress])

	useMemo(() => {
		logger.info('Multi-sig address entered', multiSigAddress)
		const fetchSafeData = async() => {
			const supportedPayouts = new SupportedPayouts()
			supportedPayouts.getSafeByAddress(multiSigAddress, (safe) => {
				setLoadingSafeData(false)
				setSafeNetworks(safe)
			})
		}

		setLoadingSafeData(true)
		if(multiSigAddress) {
			setSafeState(0)
		} else {
			setSafeState(-1)
		}

		fetchSafeData()
	}, [multiSigAddress])

	useEffect(() => {
		if(multiSigAddress && loadingSafeData && safeNetworks.length < 1) {
			//search for safe in supported safes
			setSafeState(0)
		} else if(multiSigAddress && (safeNetworks.length > 1 || safeNetworks.length === 0)) {
			// show dropdown
			setSafeState(2)
		} else if(multiSigAddress && safeNetworks.length === 1) {
			// show single safe
			setSafeState(1)
		}

	}, [safeNetworks])

	useEffect(() => {
		if(isOwner) {
			setIsVerifySignerModalOpen(false)
			setStep(5)
		}
	}, [isOwner])

	return buildComponent()
}

export default LinkMultiSig
