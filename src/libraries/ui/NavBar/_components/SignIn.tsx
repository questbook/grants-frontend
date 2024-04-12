import { useContext, useEffect } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { logger, Wallet } from 'ethers'
import { Qb } from 'src/generated/icons'
import CreateNewWallet from 'src/libraries/ui/NavBar/_components/CreateNewWallet'
import RestoreWallet from 'src/libraries/ui/NavBar/_components/RestoreWallet'
import { generateToken, verifyToken } from 'src/libraries/utils/authToken'
import { SignInMethodContext, SignInTitleContext, WebwalletContext } from 'src/pages/_app'
import { useAccount, useAccountEffect, useDisconnect, useSignMessage } from 'wagmi'

interface Props {
	isOpen: boolean
	setSignIn: (signIn: boolean) => void
	onClose: () => void
	inited: boolean
	loading: boolean
	exportWalletToGD: (wallet: Wallet) => Promise<void>
	importWalletFromGD: () => Promise<Wallet>
	// onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function SignIn({ inited, loading, importWalletFromGD, exportWalletToGD, isOpen, onClose, setSignIn }: Props) {
	// const [signInMethod, setSignInMethod] = useState<'newWallet' | 'existingWallet' | 'choosing'>('choosing')
	const { signInMethod, setSignInMethod } = useContext(SignInMethodContext)!
	const { importWebwallet, setScwAddress, setWebwallet, webwallet } = useContext(WebwalletContext)!
	const { isConnected, address, connector } = useAccount()
	const { disconnect } = useDisconnect()
	const accountData = useAccountEffect({
		onDisconnect() {
			setWebwallet(undefined)
			setScwAddress(undefined)
			localStorage.removeItem('isEOA')
			localStorage.removeItem('scwAddress')
			localStorage.removeItem('webwalletPrivateKey')
			localStorage.removeItem('authToken')
			setSignInMethod('choosing')
		}

	})
	logger.info('Account data', accountData)


	// useEffect(() => {
	// 	const scw = localStorage.getItem('scwAddress')
	// 	if(isDisconnected && scw){
	// 		setWebwallet(undefined)
	// 		setScwAddress(undefined)
	// 		localStorage.removeItem('isEOA')
	// 		localStorage.removeItem('scwAddress')
	// 		localStorage.removeItem('webwalletPrivateKey')
	// 		localStorage.removeItem('authToken')
	// 		setSignInMethod('choosing')
	// 	}

	// }, [isDisconnected])

	useEffect(() => {
		const authToken = localStorage.getItem('authToken')
		const scwAddress = localStorage.getItem('scwAddress')
		if(isConnected && address && authToken && !webwallet) {
			logger.info('Setting webwallet')
			setWebwallet({
				address: address,
				publicKey: address,
				privateKey: address,
				mnemonic: address,
				...connector,
			} as never as Wallet)
			setScwAddress(address)
			setSignIn(false)

		}

		if(isConnected && address && scwAddress && (address !== scwAddress)) {
			logger.info('Disconnecting')
			setWebwallet(undefined)
			setScwAddress(undefined)
			localStorage.removeItem('isEOA')
			localStorage.removeItem('scwAddress')
			localStorage.removeItem('webwalletPrivateKey')
			localStorage.removeItem('authToken')
			setSignInMethod('choosing')
			disconnect()
		}
		// if(!authToken){
		// 	ConnectAuth(address)
		// }
	}, [isConnected, address])


	const { data: signMessageData, error, signMessage, variables } = useSignMessage({
		mutation: {
			async onSuccess(data, variables, context) {
				logger.info('Sign message success', data, variables, context)
				logger.info('Sign message success', data)

				const wallet = {
					address: address,
					publicKey: address,
					privateKey: address,
					mnemonic: address,
					provider: await connector?.getProvider(),
					...connector,
				}
				//  localStorage.setItem('isEOA', data)
				//  localStorage.setItem('authToken', data)
				const tokenId = localStorage.getItem('authTokenId')
				if(data && tokenId) {
					const tokenData = await verifyToken(tokenId, data)
					localStorage.removeItem('authTokenId')
					if(tokenData) {
						localStorage.setItem('authToken', tokenData) // Storing the verified token directly
					}

					logger.info('Token signed', tokenData)
					setScwAddress(address)
					setWebwallet(wallet as never as Wallet)
					setSignIn(false)
				}


			},
			onError(error, variables, context) {
				logger.info('Sign message error', error, variables, context)
			},
		}

	})

	logger.info('Sign message data', signMessageData, error, variables)
	const { signInTitle } = useContext(SignInTitleContext)!
	function Title() {
		if(signInTitle === 'admin') {
			return 'To join as an admin, sign in with wallet'
		}

		if(signInTitle === 'postComment') {
			return 'To post a comment, sign in with wallet'
		}

		if(signInTitle === 'reviewer') {
			return 'To submit a review, sign in with wallet'
		}

		if(signInTitle === 'submitProposal') {
			return 'To submit a proposal, sign in with wallet'
		}

		return 'To run a grant program, sign in with wallet'
	}

	const ConnectAuth = async(address: string) => {

		const authToken = localStorage.getItem('authToken')
		const jwtRegex = new RegExp('^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_.+/=]*$')
		if(!authToken?.match(jwtRegex)) {
			const token = await generateToken(address)
			localStorage.setItem('authTokenId', token?.id)
			localStorage.setItem('isEOA', 'true')
			if(token) {
				// const sign = await webwallet.signMessage(token?.nonce)
				await signMessage({
					message: token?.nonce,
				})
			}
		}
	}

	const buildComponent = () => {
		return (
			<Modal
				isCentered={true}
				size='xxl'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					maxW={['94%', '70%', '50%', '35%']}
				>


					<ModalCloseButton
						onClick={
							() => {
								setSignInMethod('choosing')
							}
						}
					/>
					{/* {signInMethod!='choosing'&&
                    } */}
					{
						signInMethod === 'choosing' && (
							<ModalBody>
								<Flex
									p={6}
									direction='column'
									align='center'>
									<Qb
										maxH='64px'
										boxSize='10rem' />
									<Text
										variant='subheading'
										fontSize='16px'
										fontWeight='500'
										mt={[5, 0]}
									>
										{Title()}
									</Text>
									<Text
										variant='body'
										mt={1}
										fontSize='14px'
										mb={5}
										color='black.300'>
										Use your existing Questbook wallet or create new one
									</Text>
									<Button
										variant='primaryMedium'
										marginTop={[4, 6]}
										borderRadius='20'
										width={['90%', '75%']}
										height='45px'
										onClick={() => setSignInMethod('newWallet')}
									>
										<Text
											variant='body'
											color='gray.100'
											fontWeight='500'
										>
											Create new wallet
										</Text>
									</Button>
									<Button
										variant='primaryMedium'
										marginTop={[4, 6]}
										borderRadius='20'
										width={['90%', '75%']}
										height='45px'
										onClick={() => setSignInMethod('externalWallet')}
									>
										<Text
											variant='body'
											color='gray.100'
											fontWeight='500'
										>
											Connect external wallet
										</Text>
									</Button>

									<Button
										variant='primaryMedium'
										marginTop={4}
										width={['90%', '75%']}
										bg='gray.300'
										height='45px'
										borderRadius='20'
										marginBottom={2}
										onClick={() => setSignInMethod('existingWallet')}
									>
										<Text
											variant='body'
											color='black'
											fontWeight='500'
										>
											I have a Questbook wallet
										</Text>
									</Button>
								</Flex>
							</ModalBody>
						)
					}
					{
						signInMethod === 'externalWallet' && (
							<ModalBody>
								<Flex
									p={6}
									direction='column'
									align='center'>
									<Qb
										maxH='64px'
										boxSize='10rem' />
									<Text
										variant='subheading'
										fontSize='16px'
										fontWeight='500'
										mt={[5, 0]}
									>
										{Title()}
									</Text>
									<Text
										variant='body'
										mt={1}
										fontSize='14px'
										mb={5}
										color='black.300'>
										Connect using your external wallet
									</Text>
									<Button
										variant='primaryMedium'
										marginTop={[4, 6]}
										borderRadius='20'
										width={['90%', '75%']}
										height='45px'
										onClick={
											async() => {
												if(isConnected) {
													await ConnectAuth(address as string)
												}
											}
										}
									>

										{isConnected ? 'Verify to Continue' : <ConnectButton />}

									</Button>
								</Flex>
							</ModalBody>
						)
					}
					{
						signInMethod === 'existingWallet' && (
							<RestoreWallet
								importWebwallet={importWebwallet}
								inited={inited}
								loading={loading}
								importWalletFromGD={importWalletFromGD}
								closeModal={() => setSignIn(false)}
								setSignInMethod={setSignInMethod}
							/>
						)
					}
					{
						signInMethod === 'newWallet' && (
							<CreateNewWallet
								importWebwallet={importWebwallet}
								inited={inited}
								loading={loading}
								exportWalletToGD={exportWalletToGD}
								setSignIn={setSignIn}
								setSignInMethod={setSignInMethod}
							/>
						)
					}

				</ModalContent>
			</Modal>
		)
	}

	return buildComponent()
}

export default SignIn