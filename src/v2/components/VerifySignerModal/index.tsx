import React, { useEffect, useState } from 'react'
import { AlertDialogOverlay, Box, Flex, Image, Link, Modal, ModalBody, ModalContent, Text, useToast, VStack } from '@chakra-ui/react'
import { NetworkType } from 'src/constants/Networks'
import { MetamaskFox } from 'src/v2/assets/custom chakra icons/SupportedWallets/MetamaskFox'
import { PhantomLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/PhantomLogo'
import { WalletConnectLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/WalletConnectLogo'
import ErrorToast from 'src/v2/components/Toasts/errorToast'
import SuccessToast from 'src/v2/components/Toasts/successToast'
import usePhantomWallet from 'src/v2/hooks/usePhantomWallet'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import VerifySignerErrorState from './VeirfySignerErrorState'
import VerifyWalletButton from './VerifySignerButton'

const VerifySignerModal = ({
	owners,
	isOpen,
	onClose,
	redirect,
	setIsOwner,
	networkType,
	setOwnerAddress
}: {
	owners: string[],
	isOpen: boolean,
	onClose: () => void,
	redirect?: () => void,
	setIsOwner: (newState: boolean) => void,
	networkType: NetworkType,
	setOwnerAddress: (ownerAddress: string) => void
}) => {
	const [connectClicked, setConnectClicked] = useState(false)
	const [walletClicked, setWalletClicked] = useState(false)
	const [redirectInitiated, setRedirectInitiated] = useState(false)
	const { phantomWallet, phantomWalletConnected } = usePhantomWallet()
	const { disconnect } = useDisconnect()
	const toast = useToast()

	const {
		isError: isErrorConnecting,
		connect,
		connectors
	} = useConnect()

	const {
		data: accountData
	} = useAccount()

	const availableWallets = [{
		name: 'Metamask',
		icon: <MetamaskFox
			h={8}
			w={'33px'} />,
		isPopular: true,
		id: 'injected',
	}, {
		name: 'WalletConnect',
		icon: <WalletConnectLogo
			h={8}
			w={'33px'} />,
		isPopular: false,
		id: 'walletConnect'
	}]

	const solanaWallets = [{
		name: 'Phantom',
		icon: <PhantomLogo
			h={8}
			w={'33px'} />,
		isPopular: true,
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
		console.log(accountData)
		if(accountData) {
			if(!redirectInitiated && redirect && connectClicked) {
				setRedirectInitiated(true)
				setConnectClicked(false)
				redirect()
			}
		}
	}, [accountData])

	useEffect(() => {
		if(isOpen && walletClicked) {
			if(networkType === NetworkType.EVM && accountData?.address && owners.includes(accountData?.address)) {
				setIsOwner(true)
				setOwnerAddress(accountData.address)
				// alert('Your safe ownership is proved.')
				toast.closeAll()
				toast({
					duration: 3000,
					isClosable: true,
					position: 'top-right',
					render: () => SuccessToast({
						content: 'Gotcha! You are one of the safe\'s owners.',
						close: () => { }
					}),
				})
			} else if(networkType === NetworkType.Solana && phantomWallet?.publicKey && owners.includes(phantomWallet?.publicKey.toString())) {
				setIsOwner(true)
				setOwnerAddress(phantomWallet?.publicKey.toString())
				// alert('Your safe ownership is proved.')
				toast.closeAll()
				toast({
					duration: 3000,
					isClosable: true,
					position: 'top-right',
					render: () => SuccessToast({
						content: 'Gotcha! You are one of the safe\'s owners.',
						close: () => { }
					}),
				})
			} else if(phantomWallet?.publicKey || accountData?.address) {
				// setIsOwner(false)
				if(accountData?.address) {
					disconnect()
				}

				phantomWallet?.disconnect()

				toast.closeAll()
				// alert('Whoops! Looks like this wallet is not a signer on the safe.')
				toast({
					duration: 3000,
					isClosable: true,
					position: 'top-right',
					render: () => ErrorToast({
						content: 'Whoops! Looks like this wallet is not an owner of the safe.',
						close: () => { }
					}),
				})
			}

			setWalletClicked(false)
		}
	}, [walletClicked, accountData, owners, toast, phantomWallet?.publicKey, isOpen, phantomWallet?.disconnect])

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			scrollBehavior={'outside'}
			size={isError ? 'md' : '2xl'}
		>
			<AlertDialogOverlay
				background={'rgba(240, 240, 247, 0.7)'}
				backdropFilter={'blur(10px)'}
			/>

			<ModalContent
				w={'36rem'}
				boxShadow={'none'}
				filter={'drop-shadow(2px 4px 40px rgba(31, 31, 51, 0.05))'}
				borderRadius={'base'}
				fontFamily={'Neue-Haas-Grotesk-Display, sans-serif'}
				fontSize={'1rem'}
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
								direction={'column'}
								alignItems={'center'}
								py={6}>
								<Image
									boxSize="48px"
									src='/ui_icons/verify-signer-top.svg'
									alt='Questbook'
								/>

								<Text
									mt={6}
									variant="v2_heading_3"
									fontWeight="500"
								>
									Verify you’re a signer
								</Text>
								<Text
									variant="v2_body"
									color="black.3">
									Connect your wallet which is a signer on the safe.
								</Text>

								<VStack
									mt={6}
									direction={'column'}
									w={'full'}
									px={4}
									spacing={4}
								>
									{
										networkType === NetworkType.EVM ? (
											availableWallets.map((wallet, index) => (
												<VerifyWalletButton
													key={index}
													icon={wallet.icon}
													name={wallet.name}
													isPopular={wallet.isPopular}
													onClick={
														() => {
															const connector = connectors.find((x) => x.id === wallet.id)
															setConnectClicked(true)
															setWalletClicked(true)
															if(connector) {
																connect(connector)
															}

															// showToast()
															// onClose()
														}
													} />
											))) : (solanaWallets.map((wallet, index) => (
											<VerifyWalletButton
												key={index}
												icon={wallet.icon}
												name={wallet.name}
												isPopular={wallet.isPopular}
												onClick={
													() => {
														setWalletClicked(true)
														phantomWallet?.connect()
														// showToast()
													}
												} />
										)))
									}
								</VStack>

								<Text
									mt={6}
									variant="v2_body">
									Need help? Join our
									<Link
										mx={0.25}
										fontWeight="500"
										color={'black.1'}
										isExternal
										href="https://youtube.com">
										Discord
									</Link>
									{' '}
									to get instant support.
								</Text>

								<Box h={5} />

							</Flex>
						)
					}
				</ModalBody>
			</ModalContent>

		</Modal>
	)
}

export default VerifySignerModal