import React, { useEffect } from 'react'
import { AlertDialogOverlay, Box, Flex, Image, Link, Modal, ModalBody, ModalContent, Text, VStack } from '@chakra-ui/react'
import { MetamaskFox } from 'src/v2/assets/custom chakra icons/SupportedWallets/MetamaskFox'
import { WalletConnectLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/WalletConnectLogo'
import ConnectWalletButton from 'src/v2/components/ConnectWalletModal/ConnectWalletButton'
import ConnectWalletErrorState from 'src/v2/components/ConnectWalletModal/ConnectWalletErrorState'
import { useConnect } from 'wagmi'

const ConnectWalletModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean
	onClose: () => void
}) => {
	const {
		isError: isErrorConnecting,
		connectAsync,
		connectors
	} = useConnect()

	const availableWallets = [{
		name: 'Metamask',
		icon: <MetamaskFox
			h={8}
			w='33px' />,
		isPopular: true,
		id: 'injected',
	}, {
		name: 'WalletConnect',
		icon: <WalletConnectLogo
			h={8}
			w='33px' />,
		isPopular: false,
		id: 'walletConnect'
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

	return (
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
				fontFamily='Neue-Haas-Grotesk-Display, sans-serif'
				fontSize='1rem'
			>
				<ModalBody
					p={0}
				>
					{
						isError ? (
							<ConnectWalletErrorState
								onBack={() => setIsError(false)}
								onClose={onClose}
							/>
						) : (
							<Flex
								direction='column'
								alignItems='center'
								py={6}>
								<Image
									boxSize='48px'
									src='/ui_icons/verify-signer-top.svg'
									alt='Questbook'
								/>

								<Text
									mt={6}
									variant='v2_heading_3'
									fontWeight='500'
								>
									Migrate your profile
								</Text>
								<Text
									variant='v2_body'
									color='black.3'>
									Connect your wallet
								</Text>

								<VStack
									mt={6}
									direction='column'
									w='full'
									px={4}
									spacing={4}
								>
									{
										availableWallets.map((wallet, index) => (
											<ConnectWalletButton
												key={index}
												icon={wallet.icon}
												name={wallet.name}
												isPopular={wallet.isPopular}
												onClick={
													async() => {
														const connector = connectors.find((x) => x.id === wallet.id)
														if(connector) {
															try {
																await connectAsync({ connector })
																// eslint-disable-next-line @typescript-eslint/no-explicit-any
															} catch(e: any) {
																// console.log('evm error', e)
															}
														}
														// showToast()
														// onClose()
													}
												} />
										))
									}
								</VStack>

								<Text
									mt={6}
									variant='v2_body'>
									Need help? Join our
									<Link
										mx={0.25}
										fontWeight='500'
										color='black.1'
										isExternal
										href='https://discord.gg/questbook'>
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

export default ConnectWalletModal