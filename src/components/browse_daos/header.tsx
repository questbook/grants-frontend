import { useContext, useState } from 'react'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import NavBar from 'src/v2/components/NavBar'
import { useConnect } from 'wagmi'

function BrowseDaoHeader() {
	const { connected } = useContext(ApiClientsContext)!
	const [getStartedClicked, setGetStartedClicked] = useState(false)
	const { isDisconnected } = useConnect()
	return (
		<Box
			background={isDisconnected ? '#1F1F33' : 'white'}
			height={isDisconnected ? '316px' : '80px'}
			width={'100%'}
			position={'relative'}>
			{
				isDisconnected && (
					<Image
						src={'/images/browse_dao.png'}
						height={'100%'}
						width={'100%'}
						objectFit={'cover'}
						mixBlendMode={'color-dodge'}

					/>
				)
			}
			<Box
				position={'absolute'}
				width={'100%'}
				height={'100%'}
				top={0}
				background={isDisconnected ? 'linear-gradient(0deg, rgba(31, 31, 51, 0.25), rgba(31, 31, 51, 0.25)), linear-gradient(107.56deg, rgba(31, 31, 51, 0.225) 0%, rgba(31, 31, 51, 0) 100%)' : ''}
			>
				<NavBar
					onGetStartedClick={false}
					onGetStartedBtnClicked={getStartedClicked}
					setGetStartedClicked={setGetStartedClicked} />
				{
					isDisconnected && (
						<Flex
							direction={'column'}
							alignItems={'center'}
							position={'absolute'}
							width={'100%'}
							bottom={0}>
							<Text
								color={'white'}
								fontWeight={'500'}
								fontSize={'40px'}>
                    Your entire grant program on-chain
							</Text>
							<Text
								width={'440px'}
								color={'white'}
								fontWeight={'400'}
								fontSize={'16px'}
								align={'center'}
								mb={'24px'}>
                    Grow your ecosystem by providing incentives to builders through grants.
							</Text>
							<Button
								px={'24px'}
								py={'8px'}
								borderRadius={'4px'}
								height={'40px'}
								background="white"
								mb={'44px'}
								fontSize={'16px'}
								fontWeight={'500'}
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