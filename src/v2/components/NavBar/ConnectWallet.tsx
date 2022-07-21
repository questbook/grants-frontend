import React, { useEffect, useState } from 'react'
import {
	Button, Image, Menu, MenuButton, MenuItem, MenuList, Text,
	VStack, } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ConnectWalletModal from 'src/v2/components/ConnectWalletModal'

function ConnectWallet({ onGetStartedBtnClicked, setGetStartedClicked } :{onGetStartedBtnClicked:boolean, setGetStartedClicked:(value: boolean)=>void}) {
	const [connectWalletModalIsOpen, setConnectWalletModalIsOpen] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if(onGetStartedBtnClicked) {
			setConnectWalletModalIsOpen(true)
		}
	}, [onGetStartedBtnClicked])
	/* this button style is not required anywhere in design */
	return (
		<>
			<Button
				mr={6}
				px={3}
				py={2}
				borderRadius={8}
				height={'40px'}

				color={router.pathname.includes('browse_dao') ? 'white' : 'black'}
				background={router.pathname.includes('browse_dao') ? 'black' : '#F0F0F7'}
				// transition="all 1s"
				// background="linear-gradient(180deg, #717A7C 0%, #414E50 100%)"
				// _hover={
				// 	{
				// 		background: 'linear-gradient(180deg, #6F797B 0%, #78969A 100%)',
				// 	}
				// }
				// _active={
				// 	{
				// 		background: 'linear-gradient(180deg, #515D60 0%, #374749 100%)',
				// 	}
				// }
				// _disabled={
				// 	{
				// 		background: '#D0D3D3',
				// 	}
				// }
				onClick={
					() => {
						setConnectWalletModalIsOpen(true)
					}
				}
			>
				<Image
					display={{ base:'none', md:'inherit' }}
					h="20px"
					w="20px"
					src={router.pathname.includes('browse_dao') ? '/ui_icons/light_user_account.svg' : '/ui_icons/user_account_black.svg'}
					alt="account_circle"

				/>
				<VStack
					spacing={0}
					ml={1}
					mr={1}
					alignItems="flex-start">
					{/* <Text
						fontSize="9px"
						color="white"
						fontWeight="500">
          Sign in to your account
					</Text> */}
					<Text
						fontSize="14px"
						fontWeight="500"
						px={'8px'}
						py={'4px'}
						borderRadius={'5px'}
					>
          Connect Wallet
					</Text>
				</VStack>
			</Button>

			<Menu >
				<MenuButton
					display={{ sm:'', md:'none' }}
					as={Button}
					aria-label='Options'
					rightIcon={!mobileOpen ? <Image src={'/ui_icons/hamburger.svg'} /> : <Image src={'/ui_icons/cross.svg'} />}
					variant='outline'
					onClick={() => setMobileOpen(prev => !prev)}
					borderWidth={'0px'}
					_hover={{ bg:'white' }}
					_active={{ bg:'white' }}

				/>

				<MenuList >
					<MenuItem >
     					Discover
					</MenuItem>
				</MenuList>
			</Menu>

			<ConnectWalletModal
				isOpen={connectWalletModalIsOpen}
				onClose={
					() => {
						setConnectWalletModalIsOpen(false)
						setGetStartedClicked(false)
					}
				}
			/>
		</>
	)
}

export default ConnectWallet
