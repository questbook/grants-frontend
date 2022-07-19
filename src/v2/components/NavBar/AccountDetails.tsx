import React, { useContext } from 'react'
import {
	Button,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext, GitHubTokenContext, NonceContext, WebwalletContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import {Wallet} from 'ethers'
function AccountDetails() {
	const isOnline = true
	const { data: accountData } = useQuestbookAccount()
	const { webwallet, setWebwallet } = useContext(WebwalletContext)!
	const { isDisconnected } = useConnect()
	const { disconnect } = useDisconnect()
	const { connected, setConnected } = useContext(ApiClientsContext)!
	const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext)!
	const { nonce, setNonce } = useContext(NonceContext)!
	const router = useRouter()

	const formatAddress = (address: string) => `${address.substring(0, 4)}......${address.substring(address.length - 4)}`

	const buttonRef = React.useRef<HTMLButtonElement>(null)
	console.log("GITHUB TOKEN", isLoggedIn, nonce);
	return (
		<Menu>
			{!isLoggedIn && <Button
				px={2.5}
				borderRadius="2px"
				marginLeft="12px"
				onClick={() => {
					if(!webwallet) {
						setWebwallet(Wallet.createRandom())
					}
					
					window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`
				}}
				>
				GitHub Login
			</Button>}
			{isLoggedIn && <Button
				px={2.5}
				borderRadius="2px"
				marginLeft="12px"
				onClick={() => {
					setIsLoggedIn(false);
					setNonce(undefined);
				}}
				>
				GitHub Logout
			</Button>}

			<MenuButton
				ref={buttonRef}
				as={Button}
				variant="solid"
				px={2.5}
				py={2}
				ml={3}
				borderRadius="2px"
				rightIcon={
					!(connected && isDisconnected) && (
						<Image
							mr={2}
							src="/ui_icons/arrow-drop-down-line.svg"
							alt="options" />
					)
				}
				w={connected && isDisconnected ? buttonRef.current?.offsetWidth : 'auto'}
			>
				{
					connected && isDisconnected ? (
						<Loader />
					) : (
						<Text
							color="#122224"
							fontWeight="500"
							fontSize="14px"
							lineHeight="20px"
						>
							{formatAddress(accountData?.address ?? '')}
						</Text>
					)
				}
			</MenuButton>
			{
				!(connected && isDisconnected) && (
					<MenuList>
						<MenuItem
							onClick={
								() => {
									setConnected(false)
									disconnect()
									router.replace('/')
								}
							}
							icon={<Image src="/ui_icons/logout.svg" />}
						>
            Logout
						</MenuItem>
					</MenuList>
				)
			}
		</Menu>
	)
}

export default AccountDetails
