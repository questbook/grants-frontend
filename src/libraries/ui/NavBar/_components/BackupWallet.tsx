import { useEffect } from 'react'
import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { ethers, Wallet } from 'ethers'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { Gdrive } from 'src/generated/icons'
import { CopyIcon } from '@chakra-ui/icons'
interface Props {
	privateKey: string
	inited: boolean
	loading: boolean
	exportWalletToGD: (wallet: Wallet) => Promise<void>
	isNewUser: boolean
}
export default function BackupWallet({ isNewUser, exportWalletToGD, loading, inited, privateKey }: Props) {
	const toast = useCustomToast()
	const title = isNewUser ? 'New Questbook wallet' : 'Backup your Questbook wallet'
	useEffect(() => {
	}, [loading, inited])
	return (
		<>
			<Flex
				flexDirection='column'
				paddingRight='19px'
				paddingLeft='19px'
				// width='40%'
			>
				<Text
					variant='v2_subheading'
					fontWeight='500'
					alignSelf='center'
					fontSize={14}>
					{title}
				</Text>
				<Text
					variant='v2_body'
					align='center'

					fontSize={13}
					color='black.3'>
					You will need the private key to sign into Questbook again. Save it in a
					secure place.
				</Text>

				<Textarea
				readOnly
				fontSize={[13, 15]}
				w='100%'
				mt={12}
				textAlign='center'
				fontWeight={1000}
				style={{
					textShadow: "0px 0px 3px rgba(0,0,0,0.5)",
					color: "transparent"
				}}
				value={privateKey}
			/>
				
				<Flex
					flexDirection='row'
					gap={3}
					width='100%'
					marginTop={2}
					marginBottom={5}
				>
					<Button
						width='50%'
						bg='gray.3'
						height={10}
						w='90%'
						borderRadius='20'
						leftIcon={<Gdrive />}
						// variant='primaryMedium'
						marginTop={4}
						isDisabled={loading || !inited}
						onClick={
							async () => {
								try {
									await exportWalletToGD(new ethers.Wallet(privateKey))
									toast({
										title: 'Imported to Google Drive',
										status: 'success',
										duration: 3000,
										isClosable: true,
									})
								} catch {
									toast({
										title: 'Error, try again with another account.',
										status: 'success',
										duration: 3000,
										isClosable: true,
									})
								}
							}
						}

					>
						<Text
							variant='body'
							color='black'
							fontSize={['11px', '14px']}
							fontWeight='500'
						>
							Save in Google Drive
						</Text>
					</Button>

					<Button
						// variant='primaryMedium'
						marginTop={4}
						width='90%'
						bg='gray.3'
						height={10}
						borderRadius='20'
						leftIcon={<CopyIcon/>}

						onClick={
							() => {
								const copied = copy(privateKey)
								if (copied) {
									toast({
										title: 'Copied to clipboard',
										status: 'success',
										duration: 2000,
										isClosable: true,
									})
								}
							}
						}
					>
						<Text
							variant='body'
							color='black'
							fontSize={['11px', '14px']}
							fontWeight='500'
						>
							Back up manually
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}