import { Container, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import AccountDetails from 'src/v2/components/NavBar/AccountDetails'

function NavBar() {
	// const { connected } = useContext(ApiClientsContext)!
	const router = useRouter()
	// const chainId = useChainId()

	return (
		<Container
			zIndex={1}
			variant='header-container'
			maxH='64px'
			display='flex'
			maxW='100vw'
			bg='white'
			ps='42px'
			pe='15px'
			py='16px'
			minWidth={{ base: '-webkit-fill-available' }}
		>
			<Image
				onClick={
					() => router.push({
						pathname: '/',
					})
				}
				display={{ base: 'none', lg: 'inherit' }}
				mr='auto'
				src='/ui_icons/qb.svg'
				alt='Questbook'
				cursor='pointer'
			/>
			<Image
				onClick={
					() => router.push({
						pathname: '/',
					})
				}
				display={{ base: 'inherit', lg: 'none' }}
				mr='auto'
				src='/ui_icons/qb.svg'
				alt='Questbook'
				cursor='pointer'
			/>
			{/* {
				// @TODO-gasless: FIX HERE
				true && (
					<Flex
						align="center"
						justify="center"
						borderRadius="2px"
						bg="#F0F0F7"
						px={2.5}
						py={2.5}>
						<Image
							src='/ui_icons/ellipse.svg'
							boxSize="8px"
							mr={2}
							display="inline-block" />
						<Text
							fontSize="14px"
							lineHeight="20px"
							fontWeight="500"
							color="#122224">
							{
								chainId
									? CHAIN_INFO[chainId].isTestNetwork && !SHOW_TEST_NETS
										? 'Unsupported Network'
										: CHAIN_INFO[chainId].name
									: 'Unsupported Network'
							}
						</Text>
					</Flex>

				)
			} */}

			{/* @TODO-gasless: FIX HERE */}
			<AccountDetails />

			{/* {!connected && <GetStarted onGetStartedClick={onGetStartedClick} />} */}
			{/* {
				isDisconnected && false && (
					<ConnectWallet
						onGetStartedBtnClicked={onGetStartedBtnClicked}
						setGetStartedClicked={setGetStartedClicked} />
				)
			} */}
		</Container>
	)
}

export default NavBar
