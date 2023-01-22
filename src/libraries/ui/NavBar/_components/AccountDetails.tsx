import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Flex,
	IconButton,
	Image,
	Link,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
} from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { useRouter } from 'next/router'
import { AddUser, ArrowRight, Key, Pencil } from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { GrantProgramContext } from 'src/contexts/GrantProgramContext'
import { WebwalletContext } from 'src/contexts/WebwalletContext'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

const IN_APP_WALLET_LEARN_MORE_URL =
	'https://blog.questbook.xyz/posts/aug-2022-release/#:~:text=App%20Specific%20Wallet%20%2D%20Zero%20Wallet'

interface Props {
	openModal?: (type: 'import' | 'export') => void
	setIsUpdateProfileModalOpen: (isOpen: boolean) => void
}

function AccountDetails({ openModal, setIsUpdateProfileModalOpen }: Props) {
	const buildComponent = () => (
		<Popover
			placement='bottom-end'
			isLazy
			initialFocusRef={popoverRef}>
			{
				({ onClose }) => (
					<>
						<PopoverTrigger>
							<Button
								variant='ghost'
								bg='gray.1'
								disabled={isConnecting}
								as={Button}
								rightIcon={<ChevronDownIcon />}
							>
								<Image
									borderRadius='3xl'
									src={member?.profilePictureIpfsHash ? getUrlForIPFSHash(member.profilePictureIpfsHash) : getAvatar(false, scwAddress ?? 'generic')}
									boxSize='24px'
								/>
							</Button>
						</PopoverTrigger>
						<PopoverContent>
							<PopoverArrow />
							<PopoverBody>
								<Flex
									direction='column'
									align='stretch'
									bg='white'>
									{
										(router.pathname === '/dashboard' && (role === 'admin' || role === 'reviewer')) && (
											<Flex
												px={4}
												pt={3}
												align='center'>
												<Image
													boxShadow='0px 4px 16px rgba(31, 31, 51, 0.15)'
													borderRadius='3xl'
													src={member?.profilePictureIpfsHash ? getUrlForIPFSHash(member.profilePictureIpfsHash) : getAvatar(false, scwAddress!)}
													boxSize='24px' />
												<Text
													ml={3}
													variant='v2_body'
													fontWeight='500'>
													{!member?.fullName ? 'Setup' : 'Update'}
													{' '}
													your profile
												</Text>
												<IconButton
													variant='ghost'
													ml='auto'
													aria-label='setup-profile'
													size='24px'
													icon={!member?.fullName ? <ArrowRight boxSize='18px' /> : <Pencil boxSize='18px' />}
													onClick={() => setIsUpdateProfileModalOpen(true)} />
											</Flex>
										)
									}

									<Flex
										align='center'
										px={3}
										mt={4}
									>
										<Text
											variant='v2_body'
											color='gray.5'>
											Your zero wallet
										</Text>

										<Link
											ml='auto'
											target='_blank'
											href={IN_APP_WALLET_LEARN_MORE_URL}>
											<Text
												variant='v2_body'>
												Learn More
											</Text>
										</Link>
									</Flex>

									<Flex
										fontSize='sm'
										px={3}
										pt={1}>
										<Link onClick={copyScwAddress}>
											<Text variant='v2_body'>
												{formatAddress(scwAddress ?? '')}
											</Text>
										</Link>

										<Box w={3} />
									</Flex>

									{
										openModal &&
						menuItems.map((item, index) => {
							return (
								<Flex
									key={index}
									ml={3}
									mt={4}>
									{item.icon}
									<Text
										ml={2}
										_hover={{ textDecoration: 'underline', cursor: 'pointer' }}
										onClick={
											() => {
												onClose()
												item.onClick()
											}
										}
										variant='v2_body'
									>
										{item.title}
									</Text>
								</Flex>

							)
						})
									}

									<Box mb={2} />
								</Flex>
							</PopoverBody>
						</PopoverContent>
					</>
				)
			}
		</Popover>
	)

	const popoverRef = useRef<HTMLButtonElement>(null)
	const { t } = useTranslation()
	const { grant, role } = useContext(GrantProgramContext)!
	const { webwallet, scwAddress } = useContext(WebwalletContext)!

	const router = useRouter()
	useEffect(() => {
		logger.info({ pathname: router.pathname }, 'Could set up profile')
	}, [router.pathname])
	const toast = useCustomToast()

	const isConnected = useMemo(() => {
		return !!scwAddress
	}, [scwAddress])

	const isConnecting = useMemo(() => {
		return !scwAddress && !!webwallet?.address
	}, [scwAddress, webwallet?.address])

	const member = useMemo(() => {
		return grant?.workspace?.members?.find((member) => member.actorId === scwAddress?.toLowerCase())
	}, [grant, scwAddress])

	const menuItems = [
		{
			icon: <Key boxSize='18px' />,
			title: t('account_details.menu.save_wallet'),
			onClick: () => openModal?.('export')
		},
		{
			icon: <AddUser boxSize='18px' />,
			title: t('account_details.menu.use_another_wallet'),
			onClick: () => openModal?.('import')
		},
		// {
		// 	icon: <Settings boxSize='18px' />,
		// 	title: 'Settings',
		// 	onClick: () => router.push('/settings')
		// }
	]

	function copyScwAddress() {
		copy(scwAddress!)
		toast({
			title: 'Copied in-app wallet address successfully',
			status: 'success',
			duration: 2500,
		})
	}

	if(!isConnected && !isConnecting) {
		return <Box />
	}

	return buildComponent()
}

export default AccountDetails
