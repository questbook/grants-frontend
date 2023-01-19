import { useEffect, useState } from 'react'
import { Button, Flex, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { NetworkType } from 'src/constants/Networks'
import useLinkYourMultisig from 'src/libraries/hooks/useLinkYourMultisig'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { isValidSafeAddress } from 'src/libraries/utils/validations'
import VerifySignerModal from 'src/screens/request_proposal/_components/VerifySignerModal'
import SafeSelect from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'
import { SafeSelectOption } from 'src/v2/components/Safe/SafeSelect'

interface Props {
	multisigAddress?: string
	isOpen: boolean
	onClose: () => void
}

function LinkYourMultisigModal({ isOpen, onClose, multisigAddress: _multisigAddress }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='xl'
				isCentered>
				<ModalOverlay />
				<ModalContent
					flexDirection='column'
					w='100%'
					gap={1}
					alignItems='center'
					p={8}>
					<ModalCloseButton />

					<Text fontWeight='500'>
						Link your multisig
					</Text>

					<Text mt={1}>
						Link your multisig to fund builders on Questbook
					</Text>

					<Text mt={6}>
						We currently support
					</Text>
					<Flex gap={2}>
						{
							supportedSafeList.map((safe) => (
								<Image
									key={safe.icon}
									h='2rem'
									w='5rem'
									src={safe.icon} />
							))
						}
					</Flex>

					<FlushedInput
						w='100%'
						flexProps={{ w: '100%' }}
						mt={8}
						textAlign='left'
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

					{
						multiSigAddressError && (
							<Text
								mt={2}
								w='100%'
								textAlign='left'
								variant='v2_body'
								color='red'>
								Not a valid address!
							</Text>
						)
					}

					{loadingSafeData && renderSearchingSafe()}
					{safeState > 0 && (renderSafeDropdown())}

					<Button
						mt={8}
						w='100%'
						variant='primaryLarge'
						isDisabled={!isBiconomyInitialised}
						isLoading={step !== undefined}
						onClick={
							async() => {
								if(isOwner) {
									// link the safe
									await link(multiSigAddress)
									onClose()
								} else {
									setIsVerifySignerModalOpen(true)
								}
							}
						}>
						{isOwner ? 'Link Multisig' : 'Verify you are a signer'}
					</Button>

					<Button
						variant='link'
						mt={6}>
						Why do I need a multisig?
					</Button>

				</ModalContent>

				<VerifySignerModal
					owners={selectedSafeNetwork ? selectedSafeNetwork.owners : []}
					setIsOwner={
						(newState) => {
							logger.info('setIsOwner', newState)
							setIsOwner(newState)
							setIsVerifySignerModalOpen(false)
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
				justify='start'
				w='100%'
				gap={2} >
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

	const renderSafeDropdown = () => {
		return (
			<>
				<Flex
					w='100%'
					gap={2}
					mb={4}>
					{
						safeNetworks.length > 0 ? (
							<>
								<Image
									src='/ui_icons/Done_all_alt_round.svg'
									color='#273B4A' />
								<Text
									variant='v2_body'>
									{`Looks like this address is on ${safeNetworks.length} network${safeNetworks.length > 1 ? 's' : ''}`}
								</Text>

							</>
						) : (
							<Button
								display={(!multiSigAddressError && !loadingSafeData && multiSigAddress !== '') ? 'block' : 'none'}
								variant='link'
								style={{ cursor: 'pointer' }}
							>
								<Text
									variant='v2_body'
									color='red'>
									But this address doesn’t exist on any of the 20 supported chains.
								</Text>
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
							}
							flexProps={
								{
									w: '100%'
								}
							}
						/>
					) : <></>
				}
			</>
		)
	}

	const supportedSafeList = [{ icon: '/safes_icons/safe_logo.svg' }, { icon: '/safes_icons/realms_logo.svg' }, { icon: '/safes_icons/celo_safe.svg' }]

	const [multiSigAddress, setMultiSigAddress] = useState<string>('')
	const [multiSigAddressError, setMultiSigAddressError] = useState<boolean>(false)
	const [selectedSafeNetwork, setSelectedSafeNetwork] = useState<SafeSelectOption>()
	const [safeNetworks, setSafeNetworks] = useState<SafeSelectOption[]>([])
	const [IsVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState(false)
	const [isOwner, setIsOwner] = useState(false)
	const [safeState, setSafeState] = useState(-1)
	const [loadingSafeData, setLoadingSafeData] = useState(false)

	const { link, isBiconomyInitialised, step } = useLinkYourMultisig()

	const fetchSafeData = async(address: string) => {
		const supportedPayouts = new SupportedPayouts()
		setLoadingSafeData(true)
		await supportedPayouts.getSafeByAddress(address, (safe) => {
			logger.info('Safe data fetched', { safe })
			setLoadingSafeData(false)
			setSafeNetworks(safe)
		})
	}

	useEffect(() => {
		if(_multisigAddress) {
			setMultiSigAddress(_multisigAddress)
		}
	}, [_multisigAddress])

	useEffect(() => {
		setMultiSigAddressError(false)
		const isValid = isValidSafeAddress(multiSigAddress)
		logger.info('Safe address entered', { multiSigAddress, isValid })
		if(multiSigAddress !== '' && isValid) {
			fetchSafeData(multiSigAddress)
		} else if(multiSigAddress !== '' && !isValid) {
			setMultiSigAddressError(true)
		} else {
			setSafeState(-1)
		}

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

		if(safeNetworks.length === 1) {
			setSelectedSafeNetwork(safeNetworks[0])
		}
	}, [safeNetworks])

	return buildComponent()
}

export default LinkYourMultisigModal