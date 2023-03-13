import { useContext } from 'react'
import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { Wallet } from 'ethers'
import { Qb } from 'src/generated/icons'
import CreateNewWallet from 'src/libraries/ui/NavBar/_components/CreateNewWallet'
import RestoreWallet from 'src/libraries/ui/NavBar/_components/RestoreWallet'
import { SignInMethodContext, SignInTitleContext, WebwalletContext } from 'src/pages/_app'
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
	const { importWebwallet } = useContext(WebwalletContext)!
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

	// console.log(signInTitle, 'tabtab')
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


					<ModalCloseButton />
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
										variant='v2_subheading'
										fontWeight='500'
										mt={[5,0]}
									>
										{Title()}
									</Text>
									<Text
										variant='v2_body'
										mt={1}
										mb={5}
										color='black.3'>
										Use your existing Questbook wallet or create new one
									</Text>
									<Button
										variant='primaryMedium'
										marginTop={[4,9]}
										borderRadius='20'
										width={['90%', '80%']}
										height={10}
										onClick={() => setSignInMethod('newWallet')}
									>
										<Text
											variant='v2_body'
											color='gray.100'
											fontWeight='500'
										>
											Create new wallet
										</Text>
									</Button>

									<Button
										variant='primaryMedium'
										marginTop={2}
										width={['90%', '80%']}
										bg='gray.3'
										height={10}
										borderRadius='20'
										onClick={() => setSignInMethod('existingWallet')}
									>
										<Text
											variant='v2_body'
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