import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertDialogOverlay, Box, Flex, Modal, ModalBody, ModalContent, Text, useToast, VStack } from '@chakra-ui/react'
import { NetworkType } from 'src/constants/Networks'
import { Metamask, Phantom, WalletConnect } from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import VerifySignerErrorState from 'src/libraries/ui/LinkYourMultisigModal/VerifySignerErrorState'
import ConnectWalletButton from 'src/screens/dashboard/_components/FundBuilder/ConnectWalletButton'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'

const VerifySignerModal = ({
	owners,
	isOpen,
	onClose,
	redirect,
	setIsOwner,
	networkType,
	// setOwnerAddress
}: {
    owners: string[]
    isOpen: boolean
    onClose: () => void
    redirect?: () => void
    setIsOwner: (newState: boolean) => void
    networkType: NetworkType
    // setOwnerAddress: (ownerAddress: string) => void
}) => {
	const buildComponent = () => (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			scrollBehavior='outside'
			size={isError ? 'md' : '2xl'}
		>
			<AlertDialogOverlay
				background='rgba(240, 240, 247, 0.7)'
				backdropFilter='blur(10px)'
			/>

			<ModalContent
				w='36rem'
				boxShadow='none'
				filter='drop-shadow(2px 4px 40px rgba(31, 31, 51, 0.05))'
				borderRadius='base'
				fontSize='1rem'
			>
				<ModalBody
					p={0}
				>
					{
						isError ? (
							<VerifySignerErrorState
								onBack={() => setIsError(false)}
								onClose={onClose}
							/>
						) : (
							<Flex
								direction='column'
								alignItems='center'
								py={1}>

								<Text
									mt={6}
									fontWeight='500'
								>
									{t('/onboarding/create-domain.verify_signer_title')}
								</Text>
								<Text
									variant='v2_body'>
									{t('/onboarding/create-domain.verify_signer_desc')}
								</Text>

								<VStack
									mt={6}
									direction='column'
									w='full'
									px={4}
									spacing={4}
								>
									{
										networkType === NetworkType.EVM
											? (availableWallets.map((wallet) => (
												<ConnectWalletButton
													id={wallet.id}
													key={wallet.id}
													icon={wallet.icon}
													name={wallet.name}
													verifying={verifying}
													isDisabled={verifying !== undefined && verifying !== wallet.id}
													onClick={
														async() => {
															setVerifying(wallet.id)
															const connector = connectors.find((x) => x.id === wallet.id)!
															// swallow error here so we don't fail the remaining logic
															const isConnected = await connector.isAuthorized().catch(() => false)

															setConnectClicked(true)
															if(!isConnected) {
																try {
																	if(connector) {
																		connect({ connector })
																		toast({
																			title: 'Connecting to wallet',
																			status: 'info',
																			duration: 3000
																		})
																	} else {
																		toast({
																			title: 'Connector not found!',
																			status: 'error',
																			duration: 3000
																		})
																		setVerifying(undefined)
																	}
																} catch(e) {
																	logger.error('evm error', e)
																	customToast({
																		title: 'Some error occurred',
																		description: 'Please try again',
																		status: 'error',
																		duration: 5000,
																	})
																}
															} else {
																customToast({
																	status: 'info',
																	title: `Wallet already connected to address ${address} on chain ${chain?.name}`,
																	duration: 5000,
																})
															}

															setWalletClicked(true)
														}
													} />
											)))
											: (solanaWallets.map((wallet, index) => (
												<ConnectWalletButton
													id={wallet.id}
													key={index}
													icon={wallet.icon}
													name={wallet.name}
													verifying={verifying}
													isDisabled={verifying !== undefined && verifying !== wallet.id}
													onClick={
														async() => {
															setVerifying(wallet.id)
															await phantomWallet?.connect()
															setWalletClicked(true)
															// showToast()
														}
													} />
											)))
									}
								</VStack>

								<Text
									mt={6}
									variant='v2_body'
									fontWeight='500'
									cursor='pointer'>
									Why should I verify?
								</Text>

								<Box h={5} />

							</Flex>
						)
					}
				</ModalBody>
			</ModalContent>

		</Modal>
	)

	const [connectClicked, setConnectClicked] = useState(false)
	const [walletClicked, setWalletClicked] = useState(false)
	const [verifying, setVerifying] = useState<string>()
	const [redirectInitiated, setRedirectInitiated] = useState(false)
	const { phantomWallet } = usePhantomWallet()
	const { disconnectAsync } = useDisconnect()
	const toast = useToast()
	const customToast = useCustomToast()
	const { t } = useTranslation()

	const { isError: isErrorConnecting, connect, connectors } = useConnect()
	const { address } = useAccount()
	const { chain } = useNetwork()

	const availableWallets = [{
		name: 'Metamask',
		icon: <Metamask
			h={8}
			w='33px' />,
		isPopular: true,
		id: 'injected',
	}, {
		name: 'WalletConnect',
		icon: <WalletConnect
			h={8}
			w='33px' />,
		isPopular: false,
		id: 'walletConnect'
	}]

	const solanaWallets = [{
		name: 'Phantom',
		icon: <Phantom
			h={8}
			w='33px' />,
		isPopular: false,
		id: 'phantom',
	}]

	const [isError, setIsError] = React.useState(false)

	useEffect(() => {
		if(isOpen) {
			setIsError(false)
		}
	}, [isOpen])

	useEffect(() => {
		setIsError(isErrorConnecting)
	}, [isErrorConnecting])

	useEffect(() => {
		// console.log(accountData)
		if(address) {
			if(!redirectInitiated && redirect && connectClicked) {
				setRedirectInitiated(true)
				setConnectClicked(false)
				redirect()
			}
		}
	}, [address])

	useEffect(() => {
		logger.info('VerifySignerModal', { owners, isOpen, walletClicked, networkType, phantomWallet, address })
		if(isOpen && walletClicked) {
			if(networkType === NetworkType.EVM && address && owners.includes(address)) {
				setIsOwner(true)
				// setOwnerAddress(address)
				// alert('Your safe ownership is proved.')
				// customToast.closeAll()
				customToast({
					duration: 3000,
					isClosable: true,
					position: 'top-right',
					title: t('/onboarding/create-domain.successful_verification'),
					status: 'success',
				})
			// eslint-disable-next-line sonarjs/no-duplicated-branches
			} else if(networkType === NetworkType.Solana && phantomWallet?.publicKey && owners.includes(phantomWallet?.publicKey.toString())) {
				setIsOwner(true)
				// setOwnerAddress(phantomWallet?.publicKey.toString())
				// alert('Your safe ownership is proved.')
				// customToast.closeAll()
				customToast({
					duration: 3000,
					isClosable: true,
					position: 'top-right',
					title: t('/onboarding/create-domain.successful_verification'),
					status: 'success',
				})
			} else if(phantomWallet?.publicKey || address) {
				setIsOwner(false)
				if(address) {
					disconnectAsync()
				}

				phantomWallet?.disconnect()

				// customToast.closeAll()
				// alert('Whoops! Looks like this wallet is not a signer on the safe.')
				customToast({
					duration: 3000,
					isClosable: true,
					position: 'top-right',
					title: 'Whoops! Looks like this wallet is not an owner of the safe.',
					status: 'error',
				})
			}

			setWalletClicked(false)
		}

		setVerifying(undefined)
	}, [walletClicked, address, owners, toast, phantomWallet?.publicKey, isOpen, phantomWallet?.disconnect])

	return buildComponent()
}

export default VerifySignerModal

