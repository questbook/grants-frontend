import { useContext } from 'react'
import { Search2Icon } from '@chakra-ui/icons'
import { Center, Container, Image, Input, InputGroup, InputLeftElement, Spacer } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useIsQBAdmin from 'src/hooks/useIsQBAdmin'
import { DAOSearchContext } from 'src/pages/_app'
import AccountDetails from 'src/v2/components/NavBar/AccountDetails'

type Props = {
	showSearchBar: boolean
}

function NavBar({ showSearchBar }: Props) {
	// const { connected } = useContext(ApiClientsContext)!
	const router = useRouter()
	// const chainId = useChainId()

	const { isQBAdmin } = useIsQBAdmin()

	const { searchString, setSearchString } = useContext(DAOSearchContext)!

	return (
		<Container
			position='sticky'
			top={0}
			left={0}
			right={0}
			zIndex={1}
			variant='header-container'
			maxH='64px'
			display='flex'
			alignItems='center'
			justifyContent='center'
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
				mr='auto'
				src='/ui_icons/qb.svg'
				alt='Questbook'
				cursor='pointer'
			/>
			{
				isQBAdmin && (
					<>
						<Image
							display={{ base: 'none', lg: 'inherit' }}
							ml='10px'
							src='/ui_icons/builders.svg'
							alt='Questbook Builders'
						/>
					</>
				)
			}
			<Spacer />
			{/*			<Image
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
			/>*/}
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
			{
				showSearchBar && (
					<Center>
						<InputGroup mx='20px'>
							<InputLeftElement pointerEvents='none'>
								<Search2Icon color='gray.300' />
							</InputLeftElement>
							<Input
								type='search'
								placeholder='Search'
								size='md'
								defaultValue={searchString}
								width='25vw'
								onChange={(e) => setSearchString(e.target.value)} />
						</InputGroup>
					</Center>
				)
			}
			<Spacer />
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
