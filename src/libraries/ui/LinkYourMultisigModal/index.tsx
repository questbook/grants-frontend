import { useEffect, useState } from 'react'
import {
	Button,
	Flex,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { NetworkType } from 'src/constants/Networks'
import { CeloSafe, CheckDouble, Iotex, Loader, RealmsLogo, SafeLogo, Tonkey } from 'src/generated/icons'
import useLinkYourMultisig from 'src/libraries/hooks/useLinkYourMultisig'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import SafeSelect from 'src/libraries/ui/LinkYourMultisigModal/SafeSelect'
import VerifySignerModal from 'src/libraries/ui/LinkYourMultisigModal/VerifySignerModal'
import { isSupportedAddress } from 'src/libraries/utils/validations'
import { SafeSelectOption } from 'src/types'

interface Props {
  multisigAddress?: string
  isOpen: boolean
  onClose: () => void
}

function LinkYourMultisigModal({
	isOpen,
	onClose,
	multisigAddress: _multisigAddress,
}: Props) {
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
					p={8}
				>
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
						{supportedSafeList.map((safe) => safe.icon)}
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
						}
					/>

					{
						multiSigAddressError && (
							<Text
								mt={2}
								w='100%'
								textAlign='left'
								variant='body'
								color='red'
							>
								Not a valid address!
							</Text>
						)
					}

					{loadingSafeData && renderSearchingSafe()}
					{safeState > 0 && renderSafeDropdown()}

					<Button
						mt={8}
						w='100%'
						variant='primaryLarge'
						isDisabled={!isBiconomyInitialised}
						isLoading={step !== undefined}
						onClick={
							async() => {
								if(isOwner && selectedSafeNetwork) {
								// link the safe
									await link(multiSigAddress, selectedSafeNetwork.networkId?.toString() !== '-3' ? selectedSafeNetwork.networkId?.toString() : '3')
									onClose()
								} else {
									setIsVerifySignerModalOpen(true)
								}
							}
						}
					>
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
					onClose={() => setIsVerifySignerModalOpen(false)}
				/>
			</Modal>
		)
	}

	const renderSearchingSafe = () => {
		return (
			<Flex
				justify='start'
				w='100%'
				gap={2}>
				<Loader
					className='loader'
					color='black.100' />
				<Text
					variant='body'
					color='black.300'>
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
								<CheckDouble
									color='#273B4A' />
								<Text variant='body'>
									{
										`Looks like this address is on ${safeNetworks.length} network${
											safeNetworks.length > 1 ? 's' : ''
										}`
									}
								</Text>
							</>
						) : (
							<Button
								display={
									!multiSigAddressError &&
                !loadingSafeData &&
                multiSigAddress !== ''
										? 'block'
										: 'none'
								}
								variant='link'
								style={{ cursor: 'pointer' }}
							>
								<Text
									variant='body'
									color='red'>
									But this address doesn’t exist on any of the 20 supported
									chains.
								</Text>
							</Button>
						)
					}
				</Flex>
				{
					safeNetworks.length > 0 ? (
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
									w: '100%',
								}
							}
						/>
					) : (
						<></>
					)
				}
			</>
		)
	}

	const supportedSafeList = [
		{ icon: <SafeLogo
			h='2rem'
			w='5rem' />
		},
		{ icon: <RealmsLogo
			h='2rem'
			w='5rem' />
		},
		{ icon: <CeloSafe
			h='2rem'
			w='5rem' />
		},
		{
			icon: <Iotex
				h='2rem'
				w='5rem' />
		},
		{
			icon: <Tonkey
				h='2rem'
				w='5rem' />
		}
	]

	const [multiSigAddress, setMultiSigAddress] = useState<string>('')
	const [multiSigAddressError, setMultiSigAddressError] =
    useState<boolean>(false)
	const [selectedSafeNetwork, setSelectedSafeNetwork] =
    useState<SafeSelectOption>()
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
		const isValid = isSupportedAddress(multiSigAddress)
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
		} else if(
			multiSigAddress &&
      (safeNetworks.length > 1 || safeNetworks.length === 0)
		) {
			// show dropdown
			setSafeState(2)
		} else if(multiSigAddress && safeNetworks.length === 1) {
			// show single safe
			setSafeState(1)
		}

		if(safeNetworks.length > 0) {
			setSelectedSafeNetwork(safeNetworks[0])
		}
	}, [safeNetworks])

	return buildComponent()
}

export default LinkYourMultisigModal
