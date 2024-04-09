import { useContext, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { Box, Button, Container, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spacer, Text, useMediaQuery } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { ArrowLeft, NotVisible, Pencil, Qb, Settings, ShareForward, Visible } from 'src/generated/icons'
import { QBAdminsContext } from 'src/libraries/hooks/QBAdminsContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import AccountDetails from 'src/libraries/ui/NavBar/_components/AccountDetails'
import BackupWallet from 'src/libraries/ui/NavBar/_components/BackupWallet'
import useGoogleDriveWalletRecoveryReact from 'src/libraries/ui/NavBar/_components/googleRecovery'
import ImportConfirmationModal from 'src/libraries/ui/NavBar/_components/ImportConfirmationModal'
import NotificationPopover from 'src/libraries/ui/NavBar/_components/NotificationPopover'
import RestoreWallet from 'src/libraries/ui/NavBar/_components/RestoreWallet'
import SignIn from 'src/libraries/ui/NavBar/_components/SignIn'
import UpdateProfileModal from 'src/libraries/ui/NavBar/_components/UpdateProfileModal'
import { DOMAIN_CACHE_KEY } from 'src/libraries/ui/NavBar/_utils/constants'
import { copyShareGrantLink } from 'src/libraries/utils/copy'
import { getNonce } from 'src/libraries/utils/gasless'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, SignInContext, WebwalletContext } from 'src/pages/_app'

type Props = {
	bg?: string
	requestProposal?: boolean
	dashboard?: boolean
	openSignIn?: boolean
}

// function getAbsoluteURL(url: string) {
// 	if(!url.startsWith('http://') && !url.startsWith('https://')) {
// 	  return 'https://' + url
// 	}

// 	return url
// }

function NavBar({ bg = 'gray.100', requestProposal, dashboard }: Props) {
	const { webwallet } = useContext(WebwalletContext)!
	const { importWebwallet } = useContext(WebwalletContext)!

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
				ps={[6, 6]}
				pe={24}
				backgroundColor={['gray.100', 'gray.100']}
				py='16px'
				minWidth={{ base: '-webkit-fill-available' }}
				paddingInlineEnd={['35px', '12px']}
			>
				<Qb
					boxSize='10rem'
					onClick={
						() => {
							router.push({
								pathname: '/'
							})
						}
					}
					display='inherit'
					mr='auto'
					cursor='pointer' />
				{/* {
					isQbAdmin && (
						<>
							<Image
								display={{ base: 'none', lg: 'inherit' }}
								ml='10px'
								src='/v2/icons/images/builders.svg'
								alt='Questbook Builders' />
						</>
					)
				} */}
				<Spacer />
				{
					shouldShowTitle && (
						<Flex
							align='center'
							gap={2}
							direction='row'
							alignItems='center'
							cursor='pointer'
							onClick={() => setGlyph(!glyph)}
						>

							<Image


								src={glyph ? 'https://ipfs.io/ipfs/bafkreigfsecqz2nni7jcuiwpywu54l7vgkaf3q2djad2dwttj5yehcvwbu' : 'https://ipfs.io/ipfs/bafkreieskgwijh57vzifmazsgwo454poo66pkt4m7ihw4lf7uyhkarpn6m'}
							/>


							<Text
							>
								{glyph ? 'Hide Program info' : 'Show Program info'}
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
												chainId: getSupportedChainIdFromWorkspace(grant?.workspace),
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
				{
					!isMobile[0] &&
					(router.pathname === '/') && (
						<Flex
							gap={4}
							align='center'
							mx={4}

						>
							<Text
								fontWeight='500'
								fontSize='18px'
								_hover={
									{
										color: '#557B05'
									}
								}
								fontStyle='normal'
								lineHeight='normal'
								color='#07070C'
								textAlign='center'
								cursor='pointer'
								onClick={
									() => {
										const element = document.getElementById('#granteeList')
										if(element) {
											element.scrollIntoView({ behavior: 'smooth' })
										}
									}
								}
							>
								Grantee List
							</Text>
						</Flex>
					)
				}

				<AccountDetails
					openModal={
						(type) => {
							setType(type)
							setIsRecoveryModalOpen(true)
						}
					}
					setIsUpdateProfileModalOpen={setIsUpdateProfileModalOpen}
					setSignIn={setSignIn} />

			</Container>
			{/* <RecoveryModal
				isOpen={isRecoveryModalOpen}
				onClose={() => setIsRecoveryModalOpen(false)}
				type={type}
				privateKey={privateKey}
				privateKeyError={privateKeyError}
				onChange={onChange}
				onImportClick={onImportClick}
				onSaveAsTextClick={onSaveAsTextClick}
				onCopyAndSaveManuallyClick={onCopyAndSaveManuallyClick} /> */}
			<Modal
				isCentered={true}
				size='2xl'
				isOpen={isRecoveryModalOpen}
				onClose={() => setIsRecoveryModalOpen(false)}>
				<ModalOverlay />
				<ModalContent
					maxW={['74%', '70%', '50%', '35%']}>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							pb={6}
							direction='column'
							align='center'>
							<Box
								h={6}
							 />
							{
								type === 'export' && (
									<BackupWallet
										exportWalletToGD={exportWalletToGD}
										loading={loading}
										inited={inited}
										privateKey={privateKey}
										isNewUser={false}
									/>
								)
							}

						</Flex>
						{
							type === 'import' && (
								<RestoreWallet
									loading={loading}
									inited={inited}
									importWebwallet={importWebwallet}
									importWalletFromGD={importWalletFromGD}
									closeModal={() => setIsRecoveryModalOpen(false)}
									// isNewUser={false}
								/>
							)
						}
					</ModalBody>
				</ModalContent>
			</Modal>

			<ImportConfirmationModal
				isOpen={isImportConfirmationModalOpen}
				onClose={() => setImportConfirmationModalOpen(false)}
				saveWallet={saveWallet} />
			<UpdateProfileModal
				isOpen={isUpdateProfileModalOpen}
				onClose={() => setIsUpdateProfileModalOpen(false)} />
			<SignIn
				isOpen={signIn && !!!webwallet}
				setSignIn={setSignIn}
				onClose={() => setSignIn(false)}
				exportWalletToGD={exportWalletToGD}
				importWalletFromGD={importWalletFromGD}
				loading={loading}
				inited={inited}
			/>

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
				maxH='80px'
				display='flex'
				alignItems='center'
				minW='100%'
				sx={
					{
						paddingInlineEnd: '4',
						paddingInlineStart: '0'
					}
				}
				bg={bg}
				ps={[6, 24]}
				pe={24}
				backgroundColor='gray.100'
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
								router.back()
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
								src='/v2/icons/images/builders.svg'
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
							textAlign='center'
							direction='row'
							alignItems='center'
							width='100%'
							cursor='pointer'
							onClick={() => setGlyph(!glyph)}
						>

							{glyph ? <NotVisible /> : <Visible />}


							<Text
							>
								{glyph ? 'Hide Program info' : 'Show Program info'}
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
												workspaceId: grant?.workspace?.id,
												chainId: getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
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

				{/* {(role === 'admin' && !isLoading) && (<Box ml={3} />)} */}
				{/* <Spacer /> */}
				{
					(!isLoading && router.pathname === '/dashboard') && (
						<NotificationPopover
							type='grant'
							grantId={grant?.id ?? ''} />
					)
				}
			</Container>
			{/* <RecoveryModal
				isOpen={isRecoveryModalOpen}
				onClose={() => setIsRecoveryModalOpen(false)}
				type={type}
				privateKey={privateKey}
				privateKeyError={privateKeyError}
				onChange={onChange}
				onImportClick={onImportClick}
				onSaveAsTextClick={onSaveAsTextClick}
				onCopyAndSaveManuallyClick={onCopyAndSaveManuallyClick} /> */}
			<SignIn
				isOpen={signIn && !!!webwallet}
				setSignIn={setSignIn}
				onClose={() => setSignIn(false)}
				exportWalletToGD={exportWalletToGD}
				importWalletFromGD={importWalletFromGD}
				loading={loading}
				inited={inited}
			/>

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
					variant='subheading'
				>
					Invite Proposals
				</Text>
				<SignIn
					isOpen={signIn && !!!webwallet}
					setSignIn={setSignIn}
					onClose={() => setSignIn(false)}
					exportWalletToGD={exportWalletToGD}
					importWalletFromGD={importWalletFromGD}
					loading={loading}
					inited={inited}
				/>
			</Container>
		</>
	)
	const { inited, loading, importWalletFromGD, exportWalletToGD } = useGoogleDriveWalletRecoveryReact({ googleClientID: '986000900135-tscgujbu2tjq4qk9duljom0oimnb79la.apps.googleusercontent.com' })

	const { grant, role, isLoading } = useContext(GrantsProgramContext)!
	const { dashboardStep, setDashboardStep, createingProposalStep, setCreatingProposalStep, glyph, setGlyph } = useContext(WebwalletContext)!
	const { isQbAdmin } = useContext(QBAdminsContext)!
	const { signIn, setSignIn } = useContext(SignInContext)!
	// const { searchString, setSearchString } = useContext(DAOSearchContext)!
	const router = useRouter()
	const toast = useCustomToast()
	const [privateKey, setPrivateKey] = useState<string>('')


	const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false)
	const [isImportConfirmationModalOpen, setImportConfirmationModalOpen] = useState<boolean>(false)
	const [type, setType] = useState<'import' | 'export'>('export')

	const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState<boolean>(false)

	const shouldShowTitle = useMemo(() => {
		return (router.pathname === '/dashboard' && !isLoading && grant)
	}, [grant, isLoading, router.pathname])

	const isMobile = useMediaQuery(['(max-width:600px)'])

	// useEffect(() => {
	// 	if(webwallet === undefined) {
	// 		return
	// 	}

	// 	setTimeout(() => {
	// 		if(isMobile[0] && !!dashboard && !!!webwallet) {
	// 			setSignIn(true)
	// 			return
	// 		}

	// 		setSignIn(!!openSignIn && !!!webwallet)
	// 	}, 2000)

	// }, [webwallet, openSignIn, dashboard])

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
			if(result?.value) {
				const total = result.value.reduce((acc: number, cur: { usdValueAmount: number }) => acc + cur.usdValueAmount, 0)
				logger.info({ total }, 'balance total')
			}
		})
	}, [grant?.workspace?.safe])

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
// 	bg: 'gray.100',
// 	showLogo: false,
// 	showSearchBar: false,
// 	showInviteProposals: true,
// 	showAddMembers: true,
// 	showDomains: true,
// 	showStats: true
// }

export default NavBar