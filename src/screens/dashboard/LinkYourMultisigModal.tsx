import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Image, Input, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { NetworkType } from 'src/constants/Networks'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { ModalContext } from 'src/screens/dashboard/Context'
import VerifySignerModal from 'src/screens/request_proposal/_components/VerifySignerModal'
import SafeSelect from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'
import { SafeSelectOption } from 'src/v2/components/Safe/SafeSelect'

function LinkYourMultisigModal() {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isLinkYourMultisigModalOpen}
				onClose={
					() => {
						setIsLinkYourMultisigModalOpen(false)
					}
				}
				size='2xl'
				isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />

					<Flex
						direction='column'
						gap={1}
						alignItems='center'
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

						<Flex direction='column'>
							<Input
								variant='flushed'
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

							{/* <Box mt={1} /> */}
							{safeState === 0 && (renderSearchingSafe())}
							{safeState === 1 && (renderSingleSafe())}
							{safeState === 2 && (renderSafeDropdown())}
						</Flex>

						<Text p={8}>
							Why do I need a multisig?
						</Text>
					</Flex>
				</ModalContent>

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
			</Modal>
		)
	}

	const renderSearchingSafe = () => {
		return (
			<Flex
				gap={2}
				left='386px'
				top='-36px' >
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
				</Text>
				<FlushedInput
					value={safeNetworks[0].networkName}
					isDisabled />
				<Text variant='v2_subheading'>
					and currently has a balance of
				</Text>
				<FlushedInput
					value={safeNetworks[0].amount}
					isDisabled />
				<Text variant='v2_subheading'>
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

	const { isLinkYourMultisigModalOpen, setIsLinkYourMultisigModalOpen } = useContext(ModalContext)!

	const [multiSigAddress, setMultiSigAddress] = useState<string>('')
	const [selectedSafeNetwork, setSelectedSafeNetwork] = useState<SafeSelectOption>()
	const [safeNetworks, setSafeNetworks] = useState<SafeSelectOption[]>([])
	const [IsVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState(false)
	const [isOwner, setIsOwner] = useState(false)
	const [safeState, setSafeState] = useState(-1)
	const [loadingSafeData, setLoadingSafeData] = useState(false)

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
		logger.info('Safe state changed', { safeState, safeNetworks })
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

	return buildComponent()
}

export default LinkYourMultisigModal