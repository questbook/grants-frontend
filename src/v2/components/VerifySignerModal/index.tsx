import React, { useCallback, useEffect, useState } from 'react'
import { AlertDialogOverlay, Box, Flex, Image, Link, Modal, ModalBody, ModalContent, Text, useToast, VStack } from '@chakra-ui/react'
import { MetamaskFox } from 'src/v2/assets/custom chakra icons/SupportedWallets/MetamaskFox'
import { WalletConnectLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/WalletConnectLogo'
import ErrorToast from 'src/v2/components/Toasts/errorToast'
import SuccessToast from 'src/v2/components/Toasts/successToast'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import VerifySignerErrorState from './VeirfySignerErrorState'
import VerifyWalletButton from './VerifySignerButton'

const VerifySignerModal = ({
	owners,
	isOpen,
	onClose,
	redirect,
	setIsOwner,
}: {
	owners: string[],
	isOpen: boolean,
	onClose: () => void,
	redirect?: () => void,
	setIsOwner: (newState: boolean) => void
}) => {
	const [connectClicked, setConnectClicked] = useState(false)
	const [redirectInitiated, setRedirectInitiated] = useState(false)
	const { disconnect } = useDisconnect()
	const toast = useToast()

	const {
		isError: isErrorConnecting,
		connect,
		connectors
	} = useConnect()

	const { data: accountData } = useAccount()

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
		if(accountData) {
			if(!redirectInitiated && redirect && connectClicked) {
				setRedirectInitiated(true)
				setConnectClicked(false)
				redirect()
			}
		}
	}, [accountData])

	const showToast = useCallback(() => {
		console.log('hzn', accountData?.address, owners)
		if(accountData?.address && owners.includes(accountData?.address)) {
			setIsOwner(true)
			// alert('Your safe ownership is proved.')
			toast.closeAll()
			toast({
				duration: 3000,
				isClosable: true,
				position: 'top-right',
				render: () => SuccessToast({
					content: 'Gotcha! You are one of the safe\'s owners.',
					close: () => {}
				}),
			})
		} else {
			// setIsOwner(false)
			if(accountData?.address) {
				disconnect()
			}

			toast.closeAll()
			toast({
				duration: 3000,
				isClosable: true,
				position: 'top-right',
				render: () => ErrorToast({
					content: 'Whoops! Looks like this wallet is not an owner of the safe.',
					close: () => {}
				}),

			})
		}
	}, [accountData, owners, toast])

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
								tryAgain={showToast}
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
										availableWallets.map((wallet, index) => (
											<VerifyWalletButton
												key={index}
												icon={wallet.icon}
												name={wallet.name}
												isPopular={wallet.isPopular}
												onClick={
													() => {
														const connector = connectors.find((x) => x.id === wallet.id)
														if(!connector) {
															return alert('This wallet is not supported.')
														}

														setConnectClicked(true)
														connect(connector)

														showToast()
														// onClose()
													}
												} />
										))
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