import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Image,
	Link,
	Menu,
	MenuButton,
	MenuList,
	Text,
} from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { useRouter } from 'next/router'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress } from 'src/utils/formattingUtils'

const IN_APP_WALLET_LEARN_MORE_URL =
	'https://blog.questbook.xyz/posts/aug-2022-release/#:~:text=App%20Specific%20Wallet%20%2D%20Zero%20Wallet'

interface Props {
	openModal?: (type: 'import' | 'export') => void
	setIsUpdateProfileModalOpen: (isOpen: boolean) => void
}

function AccountDetails({ openModal, setIsUpdateProfileModalOpen }: Props) {
	const buildComponent = () => (
		<Menu
			size='xl'
			closeOnSelect>
			<MenuButton
				ml={3}
				variant='ghost'
				disabled={isConnecting}
				as={Button}
				rightIcon={<ChevronDownIcon />}
			>
				<HStack>
					<Image
						borderRadius='3xl'
						src={getAvatar(false, scwAddress!)}
						boxSize='24px'
					/>
				</HStack>
			</MenuButton>
			<MenuList p={0}>
				<Flex
					direction='column'
					align='stretch'
					bg='white'>
					{
						router.pathname === '/dashboard' && (role === 'admin' || role === 'reviewer') && (
							<Flex
								px={4}
								pt={3}
								align='center'>
								<Image
									boxShadow='0px 4px 16px rgba(31, 31, 51, 0.15)'
									borderRadius='3xl'
									src={getAvatar(false, scwAddress!)}
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
									icon={
										<Image
											src={!member?.fullName ? '/v2/icons/arrow right/enabled.svg' : '/v2/icons/pencil.svg'}
											boxSize='18px' />
									}
									onClick={() => setIsUpdateProfileModalOpen(true)} />
							</Flex>
						)
					}

					<Flex
						align='center'
						px={3}
						mt={3}
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
									mt={index === 0 ? 3 : 2}>
									<Image
										src={item.icon}
										boxSize='18px' />
									<Text
										ml={2}
										_hover={{ textDecoration: 'underline', cursor: 'pointer' }}
										onClick={item.onClick}
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
			</MenuList>
		</Menu>
	)

	const { workspace } = useContext(ApiClientsContext)!
	const { t } = useTranslation()
	const { role, setRole, possibleRoles } = useContext(ApiClientsContext)!
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
		return workspace?.members?.find((member) => member.actorId === scwAddress?.toLowerCase())
	}, [workspace, scwAddress])

	const menuItems = [
		{
			icon: '/v2/icons/key.svg',
			title: t('account_details.menu.save_wallet'),
			onClick: () => openModal?.('export')
		},
		{
			icon: '/v2/icons/swap.svg',
			title: router.pathname === '/dashboard' ? t(role === 'builder' ? (possibleRoles.includes('admin') ? 'account_details.menu.swap_admin' : 'account_details.menu.swap_reviewer') : 'account_details.menu.swap_builder') : 'Goto Dashboard',
			onClick: () => {
				if(router.pathname === '/dashboard') {
					if(role === 'builder') {
						if(possibleRoles.includes('admin')) {
							setRole('admin')
						} else {
							setRole('reviewer')
						}
					} else {
						setRole('builder')
					}
				}

				if(router.pathname !== '/dashboard') {
					router.push({ pathname: '/dashboard' })
				}
			}
		},
		{
			icon: '/v2/icons/add user.svg',
			title: t('account_details.menu.use_another_wallet'),
			onClick: () => openModal?.('import')
		},
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
