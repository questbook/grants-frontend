import React, { ReactElement, useEffect } from 'react'
import {
	Box,
	Container,
	Flex,
	Image,
	Link,
	Text,
	ToastId,
	useToast,
	VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ModalContent from 'src/components/connect_wallet/modalContent'
import WalletSelectButton from 'src/components/connect_wallet/walletSelectButton'
import Modal from 'src/components/ui/modal'
import SecondaryDropdown from 'src/components/ui/secondaryDropdown'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { CHAIN_INFO } from 'src/constants/chains'
import {
	ALL_SUPPORTED_CHAIN_IDS,
	SupportedChainId,
} from 'src/constants/chains'
import strings from 'src/constants/strings.json'
import WALLETS from 'src/constants/wallets.json'
import NavbarLayout from 'src/layout/navbarLayout'
import { useConnect } from 'wagmi'

function ConnectWallet() {
	const [isModalOpen, setIsModalOpen] = React.useState(false)
	const [
		selectedNetworkId,
		setSelectedNetworkId,
	] = React.useState<SupportedChainId>(ALL_SUPPORTED_CHAIN_IDS[0])
	const router = useRouter()

	const { data: connectData, isConnecting, isConnected, isReconnecting, isError, connect, connectors } = useConnect()

	const wallets = CHAIN_INFO[selectedNetworkId].wallets
		.map(w => WALLETS[w as keyof typeof WALLETS])
		.filter(Boolean)

	useEffect(() => {
		// console.log('Connect wallet', activeChain)
		if((!isConnecting || !isReconnecting) && connectData && isConnected) {
			if(router.query.flow === 'getting_started/dao') {
				router.replace('/signup/')
			} else if(router.query.flow === 'getting_started/developer') {
				router.push({ pathname: '/' })
			} else if(router.query.flow === '/') {
				router.replace({
					pathname: '/explore_grants/about_grant',
					query: {
						grantId: router.query.grantId,
						chainId: router.query.chainId,
					},
				})
			} else {
				router.push({ pathname: '/' })
			}
		}
	}, [isConnecting, isReconnecting, connectData, router])

	const toast = useToast()
	const toastRef = React.useRef<ToastId>()

	useEffect(() => {
		if(isError) {
			toastRef.current = toast({
				position: 'top',
				render: () => ErrorToast({
					content: 'Please check your Metamask extension in the browser',
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
		}
	}, [toast, isError])

	return (
		<Container
			maxW='100%'
			display='flex'
			px='70px'
			flexDirection='column'
			alignItems='center'
		>
			<Text
				mt='46px'
				variant='heading'>
				{strings.connect_wallet.heading}
			</Text>
			<Text
				mt={7}
				textAlign='center'>
				{strings.connect_wallet.subheading_1}
				{' '}
				{/* <Tooltip label={strings.connect_wallet.tooltip_label} /> */}
				{strings.connect_wallet.subheading_2}
			</Text>

			<Flex
				alignItems='baseline'
				mt={7}>
				<Text
					fontWeight='400'
					color='#3E4969'
					mr={4}>
					{strings.connect_wallet.dropdown_label}
				</Text>
				<SecondaryDropdown
					listItemsMinWidth='280px'
					listItems={
						ALL_SUPPORTED_CHAIN_IDS.map((chainId) => ({
							id: chainId,
							label: CHAIN_INFO[chainId].name,
							icon: CHAIN_INFO[chainId].icon,
						}))
					}
					// value={rewardCurrency}
					onChange={
						(id: SupportedChainId) => {
							setSelectedNetworkId(id)
						}
					}
				/>
				{/* <Box mr={3} />
        <Tooltip
          h="14px"
          w="14px"
          label={strings.connect_wallet.tooltip_label}
        /> */}
			</Flex>

			<Box mt={7} />

			<VStack
				spacing={5}
				width='100%'
				maxW='496px'
				flexDirection='column'
				mt={7}
			>
				{
					wallets.map(({ name, icon, id }) => (
						<WalletSelectButton
							key={id}
							name={name}
							icon={icon}
							onClick={
								() => {
									const connector = connectors.find((x) => x.id === id)
									if(connector) {
										connect(connector)
									}
								}
							}
						/>
					))
				}
			</VStack>

			{
				router.query.flow === 'getting_started/dao' && (
					<Text
						variant='footer'
						mt='24px'>
						<Image
							display='inline-block'
							src='/ui_icons/protip.svg'
							alt='pro tip'
							mb='-2px'
						/>
						{' '}
						<Text
							variant='footer'
							fontWeight='700'
							display='inline-block'>
							Pro Tip:
							{' '}
						</Text>
						{' '}
						{strings.connect_wallet.protip}
					</Text>
				)
			}

			<Text
				variant='footer'
				my='36px'>
				{strings.connect_wallet.footer}
				{' '}
				<Link
					isExternal
					href='http://socionity.com/privacy.html'>
					Terms of Service
				</Link>
			</Text>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title='Unlock Wallet'
			>
				<ModalContent onClose={() => setIsModalOpen(false)} />
			</Modal>
		</Container>
	)
}

ConnectWallet.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ConnectWallet
