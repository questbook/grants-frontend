import React, { useContext } from 'react'
import {
	Avatar,
	Box,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { CHAIN_INFO, SHOW_TEST_NETS } from 'src/constants/chains'
import useChainId from 'src/hooks/utils/useChainId'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

function AccountDetails() {
	const isOnline = true
	const { data: accountData } = useAccount()
	const { isDisconnected } = useConnect()
	const { disconnect } = useDisconnect()
	const { connected, setConnected } = useContext(ApiClientsContext)!
	const router = useRouter()

	const formatAddress = (address: string) => `${address.substring(0, 4)}......${address.substring(address.length - 4)}`
	const chainId = useChainId()

	const buttonRef = React.useRef<HTMLButtonElement>(null)

	return (

		<Box
			display='flex'
			paddingLeft={'40px'}
			paddingRight={'40px'}
			paddingTop={'16px'}>
			<img
				src='/images/new_logo.svg' />
			<div style={{ marginLeft: 'auto', padding: 10, display:'flex', flexDirection:'row' }}>
				<div>
					<Box
						as='button'
						borderRadius='sm'
						bg='#F0F0F7'
						paddingLeft={'8px'}
						paddingRight={'8px'}
						paddingTop={'6px'}
						paddingBottom={'6px'}
						display="flex"
						flexDirection={'row'}
						alignItems={'center'}>
						<img src='/new_icons/online.svg' />
						<Text
							fontWeight={'500'}
							marginLeft={'10px'}>
							{chainId ? ((CHAIN_INFO[chainId].isTestNetwork && !SHOW_TEST_NETS) ? 'Unsupported Network' : CHAIN_INFO[chainId].name) : 'Unsupported Network'}
						</Text>
					</Box>
				</div>

				<Menu>
					<MenuButton>

						<div>
							<Box
								as='button'
								borderRadius='sm'
								bg='#F0F0F7'
								marginLeft={10}
								paddingLeft={'8px'}
								paddingRight={'8px'}
								paddingTop={'6px'}
								paddingBottom={'6px'}
								display={'flex'}
								flexDirection='row'
								alignItems={'center'}>

								{
									chainId ? (
										(CHAIN_INFO[chainId].isTestNetwork && !SHOW_TEST_NETS) ? null : (
											<Avatar
												size={'xs'}
												src={CHAIN_INFO[chainId].icon} />
										)) : null
								}
								<Text
									fontWeight={'500'}
									marginLeft='10px'>
									{formatAddress(accountData?.address ?? '')}
								</Text>
								<img
									src='/new_icons/chevron_down.svg'
									style={{ marginLeft: 10 }} />
							</Box>
						</div>
					</MenuButton>
					{
						!(connected && isDisconnected) && (
							<MenuList>
								<MenuItem isDisabled>
	  Signed in with
									{' '}
									{accountData?.connector?.name}
								</MenuItem>
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
			</div>
		</Box>

	// <Menu>
	// 	<MenuButton
	  	// ref={buttonRef}
	// 		as={Button}
	// 		h={12}
	// 		variant="solid"
	// 		size="xl"
	// 		px={2}
	// 		py={1}
	// 		borderRadius={8}
	// 		rightIcon={
	// 			!(connected && isDisconnected) && (
	// 				<Image
	// 					mr={2}
	// 					src="/ui_icons/dropdown_arrow.svg"
	// 					alt="options" />
	// 			)
	// 		}
	// 		w={connected && isDisconnected ? buttonRef.current?.offsetWidth : 'auto'}
	// 	>
	// 		{
	// 			connected && isDisconnected ? (
	// 				<Loader />
	// 			) : (
	// 				<Flex
	// 					direction="row"
	// 					align="center"
	// 					justify="center">
	// 					{
	// 						chainId ? (
	// 							(CHAIN_INFO[chainId].isTestNetwork && !SHOW_TEST_NETS) ? null : (
	// 								<Image
	// 									h={8}
	// 									w={8}
	// 									src={CHAIN_INFO[chainId].icon}
	// 									alt="current network"
	// 								/>
	// 							)
	// 						) : null
	// 					}
	// 					<VStack
	// 						spacing={0}
	// 						ml={3}
	// 						mr={5}
	// 						mt={1}
	// 						alignItems="flex-start">
	// 						<Flex
	// 							mb="-6px"
	// 							alignItems="center">
	// 							<Image
	// 								mt="-3px"
	// 								mr={1}
	// 								src="/ui_icons/online.svg"
	// 								visibility={isOnline ? 'visible' : 'hidden'}
	// 								alt="wallet connected"
	// 							/>
	// 							<Text
	// 								fontSize="9px"
	// 								lineHeight="14px"
	// 								fontWeight="500"
	// 								color="#122224"
	// 							>
	// 								{chainId ? ((CHAIN_INFO[chainId].isTestNetwork && !SHOW_TEST_NETS) ? 'Unsupported Network' : CHAIN_INFO[chainId].name) : 'Unsupported Network'}
	// 							</Text>
	// 						</Flex>

	// 						<Flex>
	// 							<Text
	// 								color="#122224"
	// 								fontWeight="700"
	// 								fontSize="16px"
	// 								lineHeight="24px"
	// 							>
	// 								{formatAddress(accountData?.address ?? '')}
	// 							</Text>
	// 						</Flex>
	// 					</VStack>
	// 				</Flex>
	// 			)
	// 		}
	// 	</MenuButton>

	// </Menu>
	)
}

export default AccountDetails
