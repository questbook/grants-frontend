import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Search2Icon } from '@chakra-ui/icons'
import { Center, Container, Image, Input, InputGroup, InputLeftElement, Spacer } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { ethers } from 'ethers'
import saveAs from 'file-saver'
import { useRouter } from 'next/router'
import { DAOSearchContext } from 'src/hooks/DAOSearchContext'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import AccountDetails from 'src/libraries/ui/NavBar/_components/AccountDetails'
import AddMemberButton from 'src/libraries/ui/NavBar/_components/AddMemberButton'
import Domains from 'src/libraries/ui/NavBar/_components/Domains'
import ImportConfirmationModal from 'src/libraries/ui/NavBar/_components/ImportConfirmationModal'
import InviteProposalButton from 'src/libraries/ui/NavBar/_components/InviteProposalButton'
import RecoveryModal from 'src/libraries/ui/NavBar/_components/RecoveryModal'
import StatsButton from 'src/libraries/ui/NavBar/_components/StatsButton'
import { getNonce } from 'src/utils/gaslessUtils'

type Props = {
	bg?: string
	showLogo?: boolean
	showSearchBar?: boolean
	showInviteProposals?: boolean
	showAddMembers?: boolean
	showDomains?: boolean
	showStats?: boolean
}

function NavBar({ bg, showLogo, showAddMembers, showInviteProposals, showStats, showDomains, showSearchBar }: Props) {
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
				bg={bg}
				ps='42px'
				pe='15px'
				py='16px'
				minWidth={{ base: '-webkit-fill-available' }}
			>
				{
					showLogo && (
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
					)
				}
				{
					showLogo && (
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
					)
				}
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

				{showDomains && <Domains />}
				{showStats && <StatsButton />}
				<Spacer />

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

				{showAddMembers && <AddMemberButton />}
				{showInviteProposals && <InviteProposalButton />}

				<AccountDetails
					openModal={
						(type) => {
							setType(type)
							setIsRecoveryModalOpen(true)
						}
					} />
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
	const toast = useCustomToast()
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
			localStorage.removeItem('currentWorkspace')
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
	bg: 'white',
	showLogo: true,
	showSearchBar: true,
	showInviteProposals: false,
	showAddMembers: false,
	showDomains: false,
	showStats: false
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
