import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Flex,
	HStack,
	Image,
	Link,
	Menu,
	MenuButton,
	MenuList,
	Text,
	useToast,
} from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { WebwalletContext } from 'src/pages/_app'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress } from 'src/utils/formattingUtils'

const IN_APP_WALLET_LEARN_MORE_URL = 'https://blog.questbook.xyz/posts/aug-2022-release/#:~:text=App%20Specific%20Wallet%20%2D%20Zero%20Wallet'

interface Props {
	openModal?: (type: 'import' | 'export') => void
}

function AccountDetails({ openModal }: Props) {
	const buildComponent = () => (
		<Menu>
			<MenuButton
				background='#F0F0F7'
				disabled={isConnecting}
				as={Button}
				rightIcon={<ChevronDownIcon />}>
				<HStack>
					<Image
						borderRadius='3xl'
						src={getAvatar(false, webwallet!.address)}
						boxSize='24px' />
				</HStack>
			</MenuButton>
			<MenuList p={0}>
				<Flex
					direction='column'
					align='stretch'>
					<Flex
						align='center'
						px={3}
						pt={3}
						fontSize={15}
						w='100%'
						color='v2Grey'>
						<Text
							variant='v2_body'
							color='black.3'>
							Your in-app wallet
						</Text>

						<Link
							ml='auto'
							target='_blank'
							href={IN_APP_WALLET_LEARN_MORE_URL}>
							<Text
								variant='v2_metadata'
								fontWeight='500'>
								Learn More
							</Text>
						</Link>
					</Flex>

					<Flex
						fontSize='sm'
						px={3}
						pt={1}>
						<Link
							onClick={copyScwAddress}>
							<Text variant='v2_body'>
								{formatAddress(scwAddress ?? '')}
							</Text>

						</Link>

						<Box w={3} />
					</Flex>

					{
						openModal && (
							<Text
								ml={3}
								mt={3}
								_hover={{ textDecoration: 'underline', cursor: 'pointer' }}
								onClick={() => openModal('export')}
								variant='v2_body'
								lineHeight='20px'>
								{t('recovery.menu.save_wallet')}
							</Text>
						)
					}

					{
						openModal && (
							<Text
								ml={3}
								mt={2}
								_hover={{ textDecoration: 'underline', cursor: 'pointer' }}
								onClick={() => openModal('import')}
								variant='v2_body'
								lineHeight='20px'>
								{t('recovery.menu.use_another_wallet')}
							</Text>
						)
					}

					<Box mb={2} />
				</Flex>
			</MenuList>
		</Menu>
	)

	const { t } = useTranslation()
	const { webwallet, scwAddress } = useContext(WebwalletContext)!

	const toast = useToast()

	const isConnected = !!scwAddress
	const isConnecting = !scwAddress && !!webwallet?.address

	function copyScwAddress() {
		copy(scwAddress!)
		toast({
			title: 'Copied in-app wallet address successfully',
			status: 'success',
			duration: 2500
		})
	}

	if(!isConnected && !isConnecting) {
		return <Box />
	}

	return buildComponent()
}

export default AccountDetails
