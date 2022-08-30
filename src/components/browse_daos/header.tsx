import { useContext, useState } from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import NavBar from 'src/v2/components/NavBar'
import { useConnect } from 'wagmi'

function BrowseDaoHeader() {
	const { connected } = useContext(ApiClientsContext)!
	const [getStartedClicked, setGetStartedClicked] = useState(false)
	const { isDisconnected } = useConnect()
	return (
		<Box
			background='white'
			height={{ base: isDisconnected ? '316px' : '80px', md: '80px' }}
			width='100%'
			position='relative'>
			{/* {
				isDisconnected && (
					<Image
						src={'/images/browse_dao.png'}
						height={'100%'}
						width={'100%'}
						objectFit={'cover'}
						mixBlendMode={'color-dodge'}

					/>
				)
			} */}
			<Box

				position='absolute'
				width='100%'
				height='100%'
				top={0}
			>
				<NavBar
					onGetStartedClick={false}
					onGetStartedBtnClicked={getStartedClicked}
					setGetStartedClicked={setGetStartedClicked} />
				{
					isDisconnected && (
						<Flex
							display={{ base: 'flex', md: 'none' }}
							direction='column'
							alignItems='center'
							position='absolute'
							width='100%'
							// mx={{ base:'20px', sm:'0px' }}
							// my={{ base:'-10px', sm:'0px' }}
							bottom={0}>
							<Text
								textAlign='center'
								color='black'
								fontWeight='500'
								fontSize={{ base: '25px', sm: '30px', lg: '40px' }}
								pt='100px'
								pl='20px'>
								Your entire grant program on-chain
							</Text>
							<Text
								width='440px'
								color='black'
								fontWeight='400'
								fontSize='16px'
								align='center'
								mb='24px'
								px='20px'>
								Grow your ecosystem by providing incentives to builders through grants.
							</Text>
							<Button
								px='24px'
								py='8px'
								borderRadius='4px'
								height='40px'
								background='black'
								color='white'
								mb='44px'
								fontSize='16px'
								fontWeight='500'
								onClick={
									() => {
										setGetStartedClicked(true)
									}
								}>
								Get started
							</Button>
						</Flex>
					)
				}
			</Box>
		</Box>
	)
}

export default BrowseDaoHeader