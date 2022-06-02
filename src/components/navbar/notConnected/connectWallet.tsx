import React from 'react'
import {
	Button, Image, Text,
	VStack, } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function ConnectWallet() {
	const router = useRouter()

	/* this button style is not required anywhere in design */
	return (
		<Button
			mr={6}
			px={3}
			py={2}
			borderRadius={8}
			height={12}
			transition="all 1s"
			background="linear-gradient(180deg, #717A7C 0%, #414E50 100%)"
			_hover={
				{
					background: 'linear-gradient(180deg, #6F797B 0%, #78969A 100%)',
				}
			}
			_active={
				{
					background: 'linear-gradient(180deg, #515D60 0%, #374749 100%)',
				}
			}
			_disabled={
				{
					background: '#D0D3D3',
				}
			}
			onClick={
				() => {
					console.log('Push Connect wallet')
			 router.push('/connect_wallet')
				}
			}
		>
			<Image
				h="30px"
				w="30px"
				src="/ui_icons/user_account.svg"
				alt="account_circle"
			/>
			<VStack
				spacing={0}
				ml={3}
				mr={1}
				alignItems="flex-start">
				<Text
					fontSize="9px"
					color="white"
					fontWeight="500">
          Sign in to your account
				</Text>
				<Text
					color="white"
					fontSize="16px"
					fontWeight="700">
          Connect Wallet
				</Text>
			</VStack>
		</Button>
	)
}

export default ConnectWallet
