import React, { useContext } from 'react'
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
						<Text fontWeight='bold'>
							YOUR IN-APP WALLET
						</Text>

						<Link
							ml='auto'
							fontWeight='bold'
							color='v2Grey'
							target='_blank'
							href={IN_APP_WALLET_LEARN_MORE_URL}>
							Learn More
						</Link>
					</Flex>

					<Flex
						fontSize='sm'
						px={3}
						pt={1}>
						<Link
							onClick={copyScwAddress}
							fontWeight='bold'
							color='brandv2'>
							{scwAddress}
						</Link>

						<Box w={3} />
					</Flex>

					{
						openModal && (
							<Button
								alignSelf='start'
								ml={3}
								mt={4}
								variant='link'
								leftIcon={<Image src='/ui_icons/export-wallet.svg' />}
								onClick={() => openModal('export')}>
								<Text variant='v2_body'>
									Save Wallet
								</Text>
							</Button>
						)
					}

					{
						openModal && (
							<Text
								variant='v2_body'
								color='black.2'
								fontWeight='500'
								bg='gray.2'
								mt={3}
								py={2}
								px={3}>
								Others
							</Text>
						)
					}

					{
						openModal && (
							<Button
								alignSelf='start'
								ml={3}
								my={3}
								variant='link'
								leftIcon={<Image src='/ui_icons/import-wallet.svg' />}
								onClick={() => openModal('import')}>
								<Text variant='v2_body'>
									Use another Wallet
								</Text>
							</Button>
						)
					}
				</Flex>
			</MenuList>
		</Menu>
	)

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
