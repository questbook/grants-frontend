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
import { ApiClientsContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

function AccountDetails() {
	const isOnline = true
	const { data: accountData } = useAccount()
	const { isDisconnected } = useConnect()
	const { disconnect } = useDisconnect()
	const { connected, setConnected } = useContext(ApiClientsContext)!
	const router = useRouter()

	const formatAddress = (address: string) => `${address.substring(0, 4)}......${address.substring(address.length - 4)}`

	const buttonRef = React.useRef<HTMLButtonElement>(null)

	return (
		<Menu>
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
