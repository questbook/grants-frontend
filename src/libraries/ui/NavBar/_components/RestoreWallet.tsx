import { useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Input, ModalBody, Text } from '@chakra-ui/react'
import { utils, Wallet } from 'ethers'
import { Gdrive } from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
interface Props {
    importWebwallet: (privateKey: string) => void
    inited: boolean
    loading: boolean
    importWalletFromGD: () => Promise<Wallet>
    closeModal: () => void
    setSignInMethod?: (signInMethod: 'newWallet' | 'existingWallet' | 'choosing') => void
}

function RestoreWallet({ setSignInMethod, closeModal, inited, loading, importWalletFromGD, importWebwallet }: Props) {
	const toast = useCustomToast()
	const [isEnteringPrivateKey, setIsEnteringPrivateKey] = useState<boolean>(false)
	const [isValidKey, setIsValidKey] = useState<boolean>(false)
	const [privateKey, setPrivateKey] = useState<string>('')
	useEffect(() => {
		if(utils.isHexString(privateKey, 32)) {
			setIsValidKey(true)
		} else {
			setIsValidKey(false)
		}
	}, [privateKey])
	const buildComponent = () => {
		return (
			<ModalBody>
				<Flex
					pb={6}
					direction='column'
					align='center'>
					{
						(!!setSignInMethod || (isEnteringPrivateKey)) && (
							<Button
								colorScheme='gray.1'
								textColor='black'
								// variant='linkV2'
								ml={!!setSignInMethod ? -5 : -10}
								mt={!!setSignInMethod ? 0 : -7}
								alignSelf='flex-start'
								leftIcon={<BsArrowLeft />}
								onClick={
									() => {
										if(!isEnteringPrivateKey) {
											if(!setSignInMethod) {
												return
											}

											setSignInMethod('choosing')
										} else {
											setIsEnteringPrivateKey(false)
										}
									}
								}
							>
								Back
							</Button>
						)
					}
					<Text
						variant='v2_subheading'
						fontWeight='500'
						mt={1}>
						Restore your Questbook wallet
					</Text>
					<Text
						variant='v2_body'
						mt={1}
						mb={4}
						color='black.3'>
						Restore your existing wallet with the private key.
					</Text>
					{
						!isEnteringPrivateKey && (
							<Button

								marginTop={4}
								w='80%'
								bg='gray.3'
								h='10'
								borderRadius={0}
								isDisabled={loading || !inited}
								leftIcon={<Gdrive />}
								onClick={
									async() => {
										try {
											importWebwallet((await importWalletFromGD()).privateKey)
											toast({
												title: 'Restored from Google Drive.',
												status: 'success',
												duration: 3000,
												isClosable: true,
												position:'top-left'
											})
											closeModal()
										} catch(error) {
											// this means the error is generated from google itself
											if(error && typeof error === 'object' && 'type' in error) {
												if(error.type === 'popup_closed') {
													toast({
														title: 'Google popup closed',
														status: 'error',
														duration: 3000,
														isClosable: true,
													})
												} else {
													toast({
														title: 'Failed to restore.',
														description: 'Unknown error',
														status: 'error',
														duration: 3000,
														isClosable: true,
													})
												}
											} else if(error && typeof error === 'string') {
												toast({
													title: 'Failed to restore.',
													description: error,
													status: 'error',
													duration: 3000,
													isClosable: true,
												})
											} else {
												toast({
													title: 'Failed to restore.',
													description: 'Unknown error',
													status: 'error',
													duration: 3000,
													isClosable: true,
												})
											}
										}
									}
								}
							>
								<Text
									variant='v2_body'
									color='black'
									fontWeight='500'
								>
									Export from Google Drive
								</Text>
							</Button>
						)
					}

					{
						!isEnteringPrivateKey && (
							<Button

								marginTop={2}
								w='80%'
								bg='gray.3'
								h='10'
								borderRadius={0}
								onClick={() => setIsEnteringPrivateKey(true)}
							>
								<Text
									// alignSelf='flex-start'
									variant='v2_body'
									color='black'
									fontWeight='500'
								>
									Enter your private key
								</Text>
							</Button>
						)
					}
					{
						isEnteringPrivateKey && (
							<Input
								marginTop={5}
								width='90%'
								variant='flushed'
								placeholder='Enter your private key'
								value={privateKey}
								onChange={(e) => setPrivateKey(e.target.value)}
							 />
						)
					}
					{
						isEnteringPrivateKey && (
							<Button
								marginTop={3}
								width='90%'
								bg='black.1'
								colorScheme='white'
								textColor='gray.1'
								disabled={!isValidKey}
								onClick={
									() => {
										try {
											importWebwallet(privateKey)
											closeModal()
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
								continue
							</Button>
						)
					}
				</Flex>
			</ModalBody>
		)
	}

	return buildComponent()
}

export default RestoreWallet