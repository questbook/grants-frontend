import React, { useContext } from 'react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	HStack,
	Image,
	Link,
	Menu,
	MenuButton,
	MenuList,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { WebwalletContext } from 'src/pages/_app'
import getAvatar from 'src/utils/avatarUtils'

const IN_APP_WALLET_LEARN_MORE_URL = 'https://blog.questbook.xyz/posts/aug-2022-release/#:~:text=App%20Specific%20Wallet%20%2D%20Zero%20Wallet'

function AccountDetails() {
	const { webwallet, scwAddress } = useContext(WebwalletContext)!
	const { network } = useNetwork()

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

	return (
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
				<VStack p={3}>
					<HStack
						fontSize={15}
						w='100%'
						justify='space-between'
						color='v2Grey'>
						<Text fontWeight='bold'>
							YOUR IN-APP WALLET
						</Text>

						<Link
							fontWeight='bold'
							color='v2Grey'
							target='_blank'
							href={IN_APP_WALLET_LEARN_MORE_URL}>
							Learn More
						</Link>
					</HStack>

					<HStack fontSize='sm'>
						<Link
							onClick={copyScwAddress}
							fontWeight='bold'
							color='brandv2'>
							{scwAddress}
						</Link>

						<Box w={3} />

						<Text color='v2Grey'>
							{network}
						</Text>
					</HStack>
				</VStack>
			</MenuList>
		</Menu>
	)
}

export default AccountDetails
