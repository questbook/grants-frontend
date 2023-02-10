import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { Box, Button, Container, Flex, Image, Spacer, Text, useMediaQuery } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import copy from 'copy-to-clipboard'
import { ethers } from 'ethers'
import saveAs from 'file-saver'
import { useRouter } from 'next/router'
import config from 'src/constants/config.json'
import { ArrowLeft, Pencil, Settings, ShareForward } from 'src/generated/icons'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import AccountDetails from 'src/libraries/ui/NavBar/_components/AccountDetails'
import ImportConfirmationModal from 'src/libraries/ui/NavBar/_components/ImportConfirmationModal'
import NotificationPopover from 'src/libraries/ui/NavBar/_components/NotificationPopover'
import RecoveryModal from 'src/libraries/ui/NavBar/_components/RecoveryModal'
import UpdateProfileModal from 'src/libraries/ui/NavBar/_components/UpdateProfileModal'
import { DOMAIN_CACHE_KEY } from 'src/libraries/ui/NavBar/_utils/constants'
import { copyShareGrantLink } from 'src/libraries/utils/copy'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import getAvatar from 'src/utils/avatarUtils'
import { nFormatter } from 'src/utils/formattingUtils'
import { getNonce } from 'src/utils/gaslessUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

type Props = {
	bg?: string
	requestProposal?: boolean
	dashboard?: boolean
}

function NavBar({ bg = 'gray.1', requestProposal, dashboard }: Props) {
	const MainNavBar = () => (
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
				ps={[6, 24]}
				pe={24}
				backgroundColor={['black.1' ,'gray.1']}
				py='16px'
				minWidth={{ base: '-webkit-fill-available' }}
			>
				<Image
					alignSelf='flex-start'
					onClick={
						() => {
							router.push({
								pathname: '/'
							})
						}
					}
					display={['none', 'inherit' ]}
					mr='auto'
					src='/ui_icons/qb.svg'
					alt='Questbook'
					cursor='pointer' />
				<Image
					onClick={
						() => {
							router.push({
								pathname: '/',
							})
						}
					}
					display={['inherit', 'none' ]}
					mr='auto'
					src='/ui_icons/Group 11070.png'
					alt='Questbook'
					cursor='pointer' />
				{
					isQbAdmin && (
						<>
							<Image
								display={{ base: 'none', lg: 'inherit' }}
								ml='10px'
								src='/ui_icons/builders.svg'
								alt='Questbook Builders' />
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
								<Flex
									align='center'
									gap={2}>
									{
										(grant?.link !== undefined && grant?.link !== null) && (
											<Flex gap={1}>
												<Text
													as='span'
													variant='v2_metadata'>
													Program details
												</Text>
												<Text
													as='span'
													variant='v2_metadata'
													fontWeight={500}
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
											</Flex>

										)
									}
									{
										safeUSDAmount !== undefined && (
											<Flex gap={1}>
												<Text
													as='span'
													variant='v2_metadata'>
													Program multisig:
												</Text>
												<Text
													as='span'
													variant='v2_metadata'
													fontWeight={500}
												>
													{nFormatter(safeUSDAmount.toFixed(0), 0)}
													{' '}
													USD
												</Text>
											</Flex>

										)
									}
								</Flex>
							</Flex>

							<Text
								variant={grant?.acceptingApplications ? 'openTag' : 'closedTag'}>
								{grant?.acceptingApplications ? 'Open' : 'Closed'}
							</Text>
						</Flex>

					)
				}

				<Box ml={4} />

				{
					(shouldShowTitle && role === 'admin' && grant?.acceptingApplications) && (
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

				{
					(!isLoading && router.pathname === '/dashboard') && (
						<NotificationPopover
							type='grant'
							grantId={grant?.id ?? ''} />
					)
				}

				{
					(!isLoading && router.pathname === '/dashboard') && (
						<ShareForward
							ml={4}
							onClick={
								() => {
									if(grant?.id) {
										const ret = copyShareGrantLink()
										logger.info('copyGrantLink', ret)
										toast({
											title: ret ? 'Share link copied!' : 'Failed to copy',
											status: ret ? 'success' : 'error',
											duration: 3000,
										})
									}
								}
							}
							cursor='pointer'
							boxSize='20px' />
					)
				}

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
	const SmallScreensDashboardNavBar = () => (
		<>
			<Container
				position='sticky'
				top={0}
				left={0}
				right={0}
				zIndex={1}
				// variant='header-container'
				maxH='60px'
				display='flex'
				alignItems='center'
				minW='100%'
				sx={
					{
						paddingInlineEnd: '0',
						paddingInlineStart: '0'
					}
				}
				bg={bg}
				ps={[6, 24]}
				pe={24}
				backgroundColor='gray.1'
				py='16px'
				minWidth={{ base: '-webkit-fill-available' }}
			>
				<Button
					variant='linkV2'
					fontWeight='500'
					leftIcon={<ArrowLeft />}
					onClick={
						() => {
							if(dashboardStep === false) {
								router.push('/')
							} else {
								setDashboardStep(false)
							}
						}
					} />
				{
					isQbAdmin && (
						<>
							<Image
								display={{ base: 'none', lg: 'inherit' }}
								ml='10px'
								src='/ui_icons/builders.svg'
								alt='Questbook Builders' />
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
							width='100%'
						>

							<Image
								boxSize={8}
								borderRadius='4px'
								src={grant?.workspace?.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(true, grant?.workspace?.title) : getUrlForIPFSHash(grant?.workspace?.logoIpfsHash!)} />
							<Flex
								gap={0}
								direction='column'
							>
								<Text
									fontWeight='500'
									variant='v2_subheading'
									fontSize='12px'
									width='100%'
								>
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
							{/* <Text
								variant={grant?.acceptingApplications ? 'openTag' : 'closedTag'}>
								{grant?.acceptingApplications ? 'Open' : 'Closed'}
							</Text> */}
						</Flex>

					)
				}

				<Box ml={4} />

				{
					(shouldShowTitle && role === 'admin' && grant?.acceptingApplications) && (
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
				<Spacer />

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
	const SmallScreensRequestProposalNavBar = () => (
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
				// alignItems='flext-start'
				alignItems='center'
				maxW='100vw'
				bg={bg}
				ps={22}
				pe={10}
				py='16px'
				minWidth={{ base: '-webkit-fill-available' }}
			>
				<Button
					variant='linkV2'
					fontWeight='500'
					leftIcon={<ArrowLeft />}
					onClick={
						() => {
							if(createingProposalStep === 1) {
								router.push('/')
							} else {
								setCreatingProposalStep(createingProposalStep - 1)
							}
						}
					} />
				<Text
					fontWeight='500'
					variant='v2_subheading'
				>
					Invite Proposals
				</Text>
			</Container>
		</>
	)
	const { grant, role, isLoading } = useContext(GrantsProgramContext)!
	const { dashboardStep, setDashboardStep, createingProposalStep, setCreatingProposalStep } = useContext(WebwalletContext)!
	const { webwallet } = useContext(WebwalletContext)!
	const { isQbAdmin } = useContext(QBAdminsContext)!
	// const { searchString, setSearchString } = useContext(DAOSearchContext)!
	const router = useRouter()
	const toast = useCustomToast()
	const [privateKey, setPrivateKey] = useState<string>('')
	const [privateKeyError, setPrivateKeyError] = useState<string>('')
	const [safeUSDAmount, setSafeUSDAmount] = useState<number>()

	const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false)
	const [isImportConfirmationModalOpen, setImportConfirmationModalOpen] = useState<boolean>(false)
	const [type, setType] = useState<'import' | 'export'>('export')

	const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState<boolean>(false)

	const shouldShowTitle = useMemo(() => {
		return (router.pathname === '/dashboard' && !isLoading && grant)
	}, [grant, isLoading, router.pathname])

	const isMobile = useMediaQuery(['(max-width:600px)'])

	useEffect(() => {
		logger.info({ type, privateKey }, 'RecoveryModal')
		if(type === 'export') {
			setPrivateKey(webwallet?.privateKey ?? '')
		}
	}, [type, webwallet])

	useEffect(() => {
		if(!grant?.workspace?.safe?.address || !grant?.workspace?.safe?.chainId) {
			return
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		new SupportedPayouts().getSafe(parseInt(grant.workspace?.safe?.chainId), grant.workspace.safe.address).getTokenAndbalance().then((result: any) => {
			logger.info({ result }, 'safe balance')
			if(result) {
				const total = result?.reduce((acc: number, cur: {usdValueAmount: number}) => acc + cur.usdValueAmount, 0)
				logger.info({ total }, 'balance total')
				setSafeUSDAmount(total)
			}
		})
	}, [grant?.workspace?.safe])

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

	if(!isMobile[0]) {
		return <MainNavBar />
	} else if(requestProposal === true) {
		return <SmallScreensRequestProposalNavBar />
	} else if(dashboard === true) {
		return <SmallScreensDashboardNavBar />
	} else {
		return <MainNavBar />
	}
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