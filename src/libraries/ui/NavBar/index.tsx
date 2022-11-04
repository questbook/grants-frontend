import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Search2Icon } from '@chakra-ui/icons'
import { Center, Container, Image, Input, InputGroup, InputLeftElement, Spacer, useToast } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { ethers } from 'ethers'
import saveAs from 'file-saver'
import { useRouter } from 'next/router'
import { DAOSearchContext } from 'src/hooks/DAOSearchContext'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import logger from 'src/libraries/logger'
import AccountDetails from 'src/libraries/ui/NavBar/AccountDetails'
import ImportConfirmationModal from 'src/libraries/ui/NavBar/ImportConfirmationModal'
import RecoveryModal from 'src/libraries/ui/NavBar/RecoveryModal'
import { getNonce } from 'src/utils/gaslessUtils'

type Props = {
	showSearchBar: boolean
}

function NavBar({ showSearchBar }: Props) {
	const buildComponent = () => (
		<>
			<Container
				position='sticky'
				top={0}
				left={0}
				right={0}
				zIndex={1}
				variant='header-container'
				maxH='64px'
				display='flex'
				maxW='100vw'
				bg='white'
				ps='42px'
				pe='15px'
				py='16px'
				minWidth={{ base: '-webkit-fill-available' }}
			>
				<Image
					onClick={
						() => router.push({
							pathname: '/',
						})
					}
					display={{ base: 'none', lg: 'inherit' }}
					mr='auto'
					src='/ui_icons/qb.svg'
					alt='Questbook'
					cursor='pointer'
				/>
				<Image
					onClick={
						() => router.push({
							pathname: '/',
						})
					}
					display={{ base: 'inherit', lg: 'none' }}
					mr='auto'
					src='/ui_icons/qb.svg'
					alt='Questbook'
					cursor='pointer'
				/>
				{
					isQbAdmin && (
						<>
							<Image
								display={{ base: 'none', lg: 'inherit' }}
								ml='10px'
								src='/ui_icons/builders.svg'
								alt='Questbook Builders'
							/>
						</>
					)
				}
				<Spacer />
				{/* {
				// @TODO-gasless: FIX HERE
				true && (
					<Flex
						align="center"
						justify="center"
						borderRadius="2px"
						bg="#F0F0F7"
						px={2.5}
						py={2.5}>
						<Image
							src='/ui_icons/ellipse.svg'
							boxSize="8px"
							mr={2}
							display="inline-block" />
						<Text
							fontSize="14px"
							lineHeight="20px"
							fontWeight="500"
							color="#122224">
							{
								chainId
									? CHAIN_INFO[chainId].isTestNetwork && !SHOW_TEST_NETS
										? 'Unsupported Network'
										: CHAIN_INFO[chainId].name
									: 'Unsupported Network'
							}
						</Text>
					</Flex>

				)
			} */}

				{/* @TODO-gasless: FIX HERE */}
				{
					showSearchBar && (
						<Center>
							<InputGroup mx='20px'>
								<InputLeftElement pointerEvents='none'>
									<Search2Icon color='gray.300' />
								</InputLeftElement>
								<Input
									type='search'
									placeholder='Search'
									size='md'
									defaultValue={searchString}
									width='25vw'
									onChange={(e) => setSearchString(e.target.value)} />
							</InputGroup>
						</Center>
					)
				}
				<Spacer />
				<AccountDetails
					openModal={
						(type) => {
							setType(type)
							setIsRecoveryModalOpen(true)
						}
					} />

				{/* {!connected && <GetStarted onGetStartedClick={onGetStartedClick} />} */}
				{/* {
				isDisconnected && false && (
					<ConnectWallet
						onGetStartedBtnClicked={onGetStartedBtnClicked}
						setGetStartedClicked={setGetStartedClicked} />
				)
			} */}
			</Container>
			<RecoveryModal
				isOpen={isRecoveryModalOpen}
				onClose={() => setIsRecoveryModalOpen(false)}
				type={type}
				privateKey={privateKey}
				privateKeyError={privateKeyError}
				onChange={onChange}
				onImportClick={onImportClick}
				onSaveAsTextClick={onSaveAsTextClick}
				onCopyAndSaveManuallyClick={onCopyAndSaveManuallyClick} />

			<ImportConfirmationModal
				isOpen={isImportConfirmationModalOpen}
				onClose={() => setImportConfirmationModalOpen(false)}
				saveWallet={saveWallet} />

		</>
	)

	const { isQbAdmin } = useContext(QBAdminsContext)!
	const { searchString, setSearchString } = useContext(DAOSearchContext)!
	const router = useRouter()
	const toast = useToast()
	const [privateKey, setPrivateKey] = useState<string>('')
	const [privateKeyError, setPrivateKeyError] = useState<string>('')

	const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false)
	const [isImportConfirmationModalOpen, setImportConfirmationModalOpen] = useState<boolean>(false)
	const [type, setType] = useState<'import' | 'export'>('export')

	useEffect(() => {
		logger.info({ type, privateKey }, 'RecoveryModal')
		if(type === 'export') {
			const privateKey = localStorage.getItem('webwalletPrivateKey')
			setPrivateKey(privateKey ?? '')
		}
	}, [type])

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPrivateKey(e.target.value)
		try {
			new ethers.Wallet(e.target.value)
			setPrivateKeyError('')
		} catch(error) {
			if(e.target.value !== '') {
				setPrivateKeyError('Invalid private key')
			} else {
				setPrivateKeyError('')
			}
		}
	}

	const onImportClick = () => {
		setImportConfirmationModalOpen(true)
	}

	const onSaveAsTextClick = () => {
		var blob = new Blob([privateKey], { type: 'text/plain;charset=utf-8' })
		saveAs(blob, 'key.txt', { autoBom: true })
	}

	const onCopyAndSaveManuallyClick = () => {
		const copied = copy(privateKey)
		if(copied) {
			toast({
				title: 'Copied to clipboard',
				status: 'success',
				duration: 3000,
				isClosable: true,
			})
		}
	}

	const saveWallet = async() => {
		const Wallet = new ethers.Wallet(privateKey)
		const nonce = await getNonce(Wallet)
		if(nonce) {
			localStorage.setItem('webwalletPrivateKey', privateKey)
			localStorage.setItem('nonce', nonce)
			localStorage.removeItem('scwAddress')
			localStorage.removeItem('currentWorkspace')
			toast({
				title: 'Wallet imported successfully',
				status: 'success',
				duration: 3000,
				isClosable: true,
				onCloseComplete() {
					router.reload()
				},
			})
		} else {
			toast({
				title: 'Wallet could not be imported',
				description: 'User not authorised. Nonce not present, contact support!',
				status: 'warning',
				duration: 3000,
				isClosable: true,
			})
		}

	}

	return buildComponent()
}

export default NavBar
