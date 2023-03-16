import { useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Checkbox, Flex, ModalBody, Text } from '@chakra-ui/react'
import { ethers, Wallet } from 'ethers'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import BackupWallet from 'src/libraries/ui/NavBar/_components/BackupWallet'
interface Props {
    importWebwallet: (privateKey: string) => void
    inited: boolean
    loading: boolean
    exportWalletToGD: (wallet: Wallet) => Promise<void>
    setSignIn: (signIn: boolean) => void
    setSignInMethod: (signInMethod: 'newWallet' | 'existingWallet' | 'choosing') => void
}

function CreateNewWallet({ setSignInMethod, setSignIn, inited, loading, exportWalletToGD, importWebwallet }: Props) {
	const toast = useCustomToast()
	const [isPrivateKeySaved, setIsPrivateKeySaved] = useState<boolean>(false)
	const [newWallet, setNewWallet] = useState<ethers.Wallet>(ethers.Wallet.createRandom())
	const buildComponent = () => {
		return (
			<ModalBody>
				<Flex
					pb={6}
					direction='column'
					align='center'>
					<Button
						colorScheme='white'
						textColor='black'
						// variant='linkV2'
						ml={-5}
						alignSelf='flex-start'
						leftIcon={<BsArrowLeft />}
						onClick={() => setSignInMethod('choosing')}
					>
						Back
					</Button>

					<BackupWallet
						loading={loading}
						inited={inited}
						exportWalletToGD={exportWalletToGD}
						privateKey={newWallet.privateKey}
						isNewUser={true}
					/>


					<Checkbox
						marginTop={4}
						alignSelf='flex-start'
						checked={isPrivateKeySaved}
						paddingLeft={5}
						onChange={() => setIsPrivateKeySaved(!isPrivateKeySaved)}
					>
						<Text
							variant='v2_subheading'
							fontWeight='500'
							fontSize={['11', '14']}>
							
							I have saved my Questbook wallet private key.
						</Text>
					</Checkbox>
					<Button
						marginTop={6}
						//  variant='primaryMedium'
						_hover={{ bg:'gray.500' }}
						isDisabled={!isPrivateKeySaved}
						width='30%'
						bg='black.100'
						_disabled={{bg: "gray.3", color: "black.100", textColor:'gray.500' }}
						textColor='gray.100'
						onClick={
							() => {
								try {
									importWebwallet(newWallet.privateKey)
									setSignIn(false)
								} catch{
									toast({
										title: 'Error',
										description: 'Try again later.',
										status: 'warning',
										duration: 6000,
										isClosable: true,
									})
								}
							}
						}
					>
						Continue
					</Button>
				</Flex>
			</ModalBody>
		)
	}

	return buildComponent()
}

export default CreateNewWallet