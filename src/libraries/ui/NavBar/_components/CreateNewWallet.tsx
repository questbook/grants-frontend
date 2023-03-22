import { useEffect, useState } from 'react'
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
	const [newWallet, setNewWallet] = useState<ethers.Wallet>()
	const buildComponent = () => {
		return (
			<ModalBody
			// w='100%'
			>
				<Flex
					pb={6}
					direction='column'
					align='center'>
					<Button
						colorScheme='white'
						textColor='black'
						// variant='linkV2'
						ml={-5}
						marginBottom={-2}
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
						privateKey={newWallet?.privateKey}
						isNewUser={true}
					/>

					<Flex
						alignItems='flex-start'
						alignContent='flex-start'
						border='1px'
						borderColor='blackAlpha.100'
						width='93%'
						paddingBottom='3'
					>
						<Checkbox
							marginTop={3}
							marginLeft={-1}
							color='black'
							alignSelf='flex-start'
							checked={isPrivateKeySaved}
							paddingLeft={5}
							onChange={() => setIsPrivateKeySaved(!isPrivateKeySaved)}
						>
							<Text
								variant='subheading'
								fontWeight='500'
								marginLeft={2}
								fontSize={['11', '15']}>

								I have saved my Questbook wallet private key.
							</Text>
						</Checkbox>
					</Flex>
					<Button
						marginTop={6}
						//  variant='primaryMedium'
						borderRadius='0px'
						_hover={{ bg:'gray.500' }}
						isDisabled={!isPrivateKeySaved || !newWallet?.privateKey}
						width='30%'
						bg='black.100'
						_disabled={{ bg: 'gray.300', color: 'black.100', textColor:'gray.500' }}
						textColor='gray.100'
						onClick={
							() => {
								if(!newWallet?.privateKey) {
									return
								}

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

	useEffect(() => {
		const newWallet = ethers.Wallet.createRandom()
		setNewWallet(newWallet)
	}, [])

	return buildComponent()
}

export default CreateNewWallet