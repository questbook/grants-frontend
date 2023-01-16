import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Container, Flex, Image, Spacer, Text } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { ethers } from 'ethers'
import saveAs from 'file-saver'
import { useRouter } from 'next/router'
import config from 'src/constants/config.json'
import { Pencil, Settings } from 'src/generated/icons'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import AccountDetails from 'src/libraries/ui/NavBar/_components/AccountDetails'
import ImportConfirmationModal from 'src/libraries/ui/NavBar/_components/ImportConfirmationModal'
import RecoveryModal from 'src/libraries/ui/NavBar/_components/RecoveryModal'
import SharePopover from 'src/libraries/ui/NavBar/_components/SharePopover'
import UpdateProfileModal from 'src/libraries/ui/NavBar/_components/UpdateProfileModal'
import { DOMAIN_CACHE_KEY } from 'src/libraries/ui/NavBar/_utils/constants'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import getAvatar from 'src/utils/avatarUtils'
import { getNonce } from 'src/utils/gaslessUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

type Props = {
	bg?: string
}

function NavBar({ bg = 'gray.1' }: Props) {
	const buildComponent = () => (
		<>
			<Container
				position='sticky'
				top={0}
				left={0}
				right={0}
				zIndex={1}
				// variant='header-container'
				maxH='64px'
				display='flex'
				alignItems='center'
				maxW='100vw'
				bg={bg}
				ps={24}
				pe={24}
				py='16px'
				minWidth={{ base: '-webkit-fill-available' }}
			>
				<Image
					onClick={
						() => {
							router.push({
								pathname: '/'
							})
						}
					}
					display={{ base: 'none', lg: 'inherit' }}
					mr='auto'
					src='/ui_icons/qb.svg'
					alt='Questbook'
					cursor='pointer'
				/>
				<Image
					onClick={
						() => {
							router.push({
								pathname: '/',
							})
						}
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

				{
					shouldShowTitle && (
						<Flex
							align='center'
							gap={2}
							direction='row'
							alignItems='center'
						>

							<Image
								boxSize={8}
								borderRadius='4px'
								src={grant?.workspace?.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(true, grant?.workspace?.title) : getUrlForIPFSHash(grant?.workspace?.logoIpfsHash!)}
							/>
							<Flex
								gap={0}
								direction='column'
							>
								<Text
									fontWeight='500'
									variant='v2_subheading'>
									{grant?.title}
								</Text>
								{
									(grant?.link !== undefined && grant?.link !== null) && (
										<Text
											variant='v2_metadata'
											display={grant?.link ? '' : 'none'}>
											Program details
											<Text
												variant='v2_metadata'
												display='inline-block'
												fontWeight={500}
												marginLeft={1}
												cursor='pointer'
												onClick={
													() => {
														if(grant.link !== null) {
															window.open(grant.link, '_blank')
														}
													}
												}
											>
												here
											</Text>
										</Text>
									)
								}
							</Flex>

							<Text
								px={2}
								py={1}
								ml={2}
								alignSelf='center'
								variant='v2_metadata'
								fontWeight='500'
								bg={grant?.acceptingApplications ? 'rgba(242, 148, 62, 0.2)' : 'accent.columbia'}
								color={grant?.acceptingApplications ? 'accent.carrot' : 'accent.azure'}>
								{grant?.acceptingApplications ? 'Open' : 'Closed'}
							</Text>
						</Flex>

					)
				}

				<Box ml={4} />

				{
					(shouldShowTitle && role === 'admin' && grant?.acceptingApplications && grant?.applications?.length === 0) && (
						<Pencil
							cursor='pointer'
							boxSize='20px'
							onClick={
								() => {
									router.push(
										{
											pathname: '/request_proposal/',
											query: {
												grantId: grant?.id,
												workspaceId: grant?.workspace?.id
											},
										})

								}
							} />
					)
				}

				{
					(shouldShowTitle && role === 'admin') && (
						<Settings
							boxSize='20px'
							ml={3}
							cursor='pointer'
							onClick={
								() => {
									router.push(
										{
											pathname: '/settings'
										})

								}
							} />
					)
				}

				{(role === 'admin' && !isLoading) && (<Box ml={3} />)}
				{(!isLoading && router.pathname === '/dashboard') && <SharePopover />}

				<Spacer />

				<AccountDetails
					openModal={
						(type) => {
							setType(type)
							setIsRecoveryModalOpen(true)
						}
					}
					setIsUpdateProfileModalOpen={setIsUpdateProfileModalOpen} />
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

			<UpdateProfileModal
				isOpen={isUpdateProfileModalOpen}
				onClose={() => setIsUpdateProfileModalOpen(false)} />

		</>
	)

	const { grant, role, isLoading } = useContext(GrantsProgramContext)!
	const { webwallet } = useContext(WebwalletContext)!
	const { isQbAdmin } = useContext(QBAdminsContext)!
	// const { searchString, setSearchString } = useContext(DAOSearchContext)!
	const router = useRouter()
	const toast = useCustomToast()
	const [privateKey, setPrivateKey] = useState<string>('')
	const [privateKeyError, setPrivateKeyError] = useState<string>('')

	const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false)
	const [isImportConfirmationModalOpen, setImportConfirmationModalOpen] = useState<boolean>(false)
	const [type, setType] = useState<'import' | 'export'>('export')

	const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState<boolean>(false)

	const shouldShowTitle = useMemo(() => {
		return (router.pathname === '/dashboard' && !isLoading && grant)
	}, [grant, isLoading, router.pathname])

	useEffect(() => {
		logger.info({ type, privateKey }, 'RecoveryModal')
		if(type === 'export') {
			setPrivateKey(webwallet?.privateKey ?? '')
		}
	}, [type, webwallet])

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
				status: 'success',
				title: 'Copied to clipboard',
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
			localStorage.removeItem(DOMAIN_CACHE_KEY)
			toast({
				status: 'info',
				title: 'Wallet imported successfully',
				duration: 2000,
				isClosable: true,
				onCloseComplete() {
					router.reload()
				},
			})
		} else {
			toast({
				status: 'error',
				title: 'Wallet could not be imported',
				description: 'User not authorised. Nonce not present, contact support!',
				duration: 3000,
				isClosable: true,
			})
		}

	}

	return buildComponent()
}

NavBar.defaultProps = {
	bg: 'white'
}

// NavBar.defaultProps = {
// 	bg: 'gray.1',
// 	showLogo: false,
// 	showSearchBar: false,
// 	showInviteProposals: true,
// 	showAddMembers: true,
// 	showDomains: true,
// 	showStats: true
// }

export default NavBar
