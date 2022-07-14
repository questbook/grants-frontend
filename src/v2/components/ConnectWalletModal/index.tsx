import React, { useEffect, useState } from 'react'
import { AlertDialogOverlay, Box, Flex, Image, Link, Modal, ModalBody, ModalContent, Text, VStack } from '@chakra-ui/react'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { MetamaskFox } from 'src/v2/assets/custom chakra icons/SupportedWallets/MetamaskFox'
import { WalletConnectLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/WalletConnectLogo'
import { useConnect } from 'wagmi'
import ConnectWalletButton from './ConnectWalletButton'
import ConnectWalletErrorState from './ConnectWalletErrorState'

const ConnectWalletModal = ({
	isOpen,
	onClose,
	redirect,
}: {
	isOpen: boolean,
	onClose: () => void,
	redirect?: () => void,
}) => {
	const [connectClicked, setConnectClicked] = useState(false)
	const [redirectInitiated, setRedirectInitiated] = useState(false)

	const {
		isError: isErrorConnecting,
		connect,
		connectors
	} = useConnect()

	const {
		data: accountData
	} = useQuestbookAccount()

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
							<ConnectWalletErrorState
								onBack={() => setIsError(false)}
								onClose={onClose}
							/>
						) : (
							<Flex
								direction={'column'}
								alignItems={'center'}>
								<Image
									h={8}
									src='/questbooklogomini-black.svg'
									alt='Questbook'
									my={8}
								/>
								<Box
									h={0.5}
									w={'full'}
									style={
										{
											background: 'linear-gradient(89.92deg, rgba(224, 224, 236, 0) 0.04%, #E0E0EC 48.36%, rgba(224, 224, 236, 0) 99.3%)'
										}
									}
								/>

								<Text
									mt={8}
									fontWeight={'bold'}
									fontSize={'2xl'}
									lineHeight={'8'}
								>
								Connect Wallet
								</Text>
								<Text
									mt={2}
									color={'brandText'}>
								To start using Questbook, connect with one of your wallets.
								</Text>

								<VStack
									mt={6}
									direction={'column'}
									w={'full'}
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
													() => {
														const connector = connectors.find((x) => x.id === wallet.id)
														setConnectClicked(true)
														if(connector) {
															connect(connector)
														}
													}
												} />
										))
									}
								</VStack>

								<Text
									my={8}
									fontSize={'sm'}
									color={'brandText'}
									textAlign={'center'}
								>
									By connecting your wallet, you accept Questbook’s
									{' '}
									<Link
										fontSize={'1rem'}
										variant={'basev2'}
										href='http://socionity.com/privacy.html'
										isExternal>
								Terms of Service
									</Link>
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