import React, { useEffect, useState } from 'react'
import {
	Button, Image, Menu, MenuButton, MenuItem, MenuList, Text, } from '@chakra-ui/react'
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
				borderRadius={'4px'}
				color={'white' }
				background={'black'}
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
					src={router.pathname.includes('browse_dao') || router.pathname.includes('profile') ? '/ui_icons/light_user_account.svg' : '/ui_icons/user_account_black.svg'}
					alt="account_circle"
					mr={'10px'}
				/>
				<Text
					fontSize="14px"
					fontWeight="500"
					px={'0px'}
					py={'0px'}
				>
          Connect Wallet
				</Text>
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
