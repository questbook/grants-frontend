import { useContext } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { DiscoverContext } from 'src/screens/discover/Context'


function HeroBanner() {
	const buildComponent = () => (
		<Flex
			direction='row'
			bg='#1F1F33'
			w='100%'
			alignItems='stretch'
			alignContent='stretch'
			textAlign='left'
		>
			<Flex
				direction='row'
				w='100%'
				alignItems='stretch'
				alignContent='stretch'
				textAlign='left'
			>
				<Flex
					padding={[10, 24]}
					w='700px'
					flexDirection='column'
					flexGrow={1}
				>
					<Text
						fontWeight='700'
						fontSize='32px'
						lineHeight='normal'
						color='#F8FFF2'
					>
						Get your profile referred to grant managers
					</Text>

					<Text
						mt={2}
						fontSize='18px'
						lineHeight='normal'
						fontWeight='400'
						color='#D8DED6'>
						Fill in a couple of details and we&apos;ll recommend you to grant managers. Receive relevant grant opportunities delivered to you as a bonus!

					</Text>

					<Flex>
						<Button
							variant='solid'
							bgColor='#77AC06'
							_hover={{ bgColor: '#77AC06' }}
							color='white'
							borderRadius='8px'
							shadow='0px 1px 2px 0px rgba(22, 22, 22, 0.12)'
							mt={8}
							fontSize='18px'
							fontWeight='600'
							onClick={() => setBuildersModal(true)}>
							Connect with us
						</Button>
					</Flex>

				</Flex>
				{
					!isMobile && (
						<Flex
							flexShrink={0}
							justifyContent='center'
							height='420px'
						>
							<Image
								mt={10}
								h='-webkit-fit-content'
								w='100%'
								src='/v2/images/banner.png' />
						</Flex>
					)
				}
				{/* {
					!isMobile && (
						<Flex
							position='absolute'
							bottom='0'
							left='0'
							justifyContent='center'
						>
							<BannerVector
								w='100%'
								h='auto'
							/>
						</Flex>
					)
				}
				{
					!isMobile && (
						<Flex
							position='absolute'
							top='0'
							right='0'
							justifyContent='center'
						>
							<BannerVector2
								w='100%'
								h='auto'
							/>
						</Flex>
					)
				} */}
			</Flex>
		</Flex>
	)
	const { setBuildersModal } = useContext(DiscoverContext)!
	const isMobile = useMediaQuery({ query:'(max-width:800px)' })

	return buildComponent()
}

export default HeroBanner