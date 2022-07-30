import { Container, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { CHAIN_INFO, SHOW_TEST_NETS } from 'src/constants/chains'
import useChainId from 'src/hooks/utils/useChainId'
import { useConnect } from 'wagmi'
import AccountDetails from './AccountDetails'
import ConnectWallet from './ConnectWallet'

interface Props {
  onGetStartedClick: boolean;
  onGetStartedBtnClicked: boolean;
  setGetStartedClicked: (value:boolean)=>void;
}

function NavBar({ onGetStartedClick, onGetStartedBtnClicked, setGetStartedClicked }: Props) {
	// const { connected } = useContext(ApiClientsContext)!
	const { isDisconnected } = useConnect()
	const router = useRouter()
	console.log(router.pathname)
	const chainId = useChainId()

	return (
		<Container
			zIndex={1}
			variant={'header-container'}
			display='flex'
			maxW="100vw"
			bg={ 'white'}
			ps={'42px'}
			pe={'15px'}
			py={'16px'}
			minWidth={{ base:'-webkit-fill-available' }}
		>
			<Image
				onClick={
					() => router.push({
						pathname: '/',
					})
				}
				display={{ base:'none', lg:'inherit' }}
				mr="auto"
				src={isDisconnected ? '/ui_icons/qb.svg' : '/ui_icons/qb.svg'}
				alt="Questbook"
				cursor="pointer"
			/>
			<Image
				onClick={
					() => router.push({
						pathname: '/',
					})
				}
				display={{ base:'inherit', lg:'none' }}
				mr="auto"
				src={isDisconnected ? '/ui_icons/questbookMobile.svg' : '/ui_icons/qb.svg'}
				alt="Questbook"
				cursor="pointer"
			/>
			{
				!isDisconnected && (
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
			}
			{!isDisconnected && <AccountDetails />}
			{/* {!connected && <GetStarted onGetStartedClick={onGetStartedClick} />} */}
			{
				isDisconnected && (
					<ConnectWallet
						onGetStartedBtnClicked={onGetStartedBtnClicked}
						setGetStartedClicked={setGetStartedClicked} />
				)
			}
		</Container>
	)
}

export default NavBar
