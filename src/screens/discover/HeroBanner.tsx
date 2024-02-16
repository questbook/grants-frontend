import { useMediaQuery } from 'react-responsive'
import { Carousel } from 'react-responsive-carousel'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ArrowRight } from 'src/generated/icons'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader


function HeroBanner() {
	const buildComponent = () => (
		<Carousel
			autoPlay={true}
			interval={5000}
			swipeable={true}
			showArrows={!isMobile}
			showStatus={false}
			infiniteLoop={true}
			stopOnHover={true}
			emulateTouch={true}
			showThumbs={false}
			thumbWidth={0}
		>
			<Flex
				direction='row'
				w='100%'
				alignItems='stretch'
				alignContent='stretch'
				textAlign='left'
				h='460px'>
				<Flex
					bgColor='black.100'
					padding={[10, 24]}
					flexDirection='column'
					textColor='white'
					width='600px'>
					<Text
						fontWeight='500'
						fontSize='35px'
						lineHeight='48px'
						color='white'>
						Get a grant to build on
						{' '}
						top of
						{' '}
						<Text
							fontWeight='500'
							fontSize='35px'
							lineHeight='48px'
							color='#0A84FF'
							as='span'>
							{' '}
							Reclaim Protocol
							{' '}
						</Text>
					</Text>

					<Text
						mt={2}
						fontSize='16px'
						lineHeight='24px'
						fontWeight='400'
						color='white'>
						Use Reclaim to retrieve any user&apos;s data to your app
					</Text>

					<Flex>
						<Button
							variant='primaryLarge'
							bgColor='#0A84FF'
							mt={8}
							rightIcon={<ArrowRight color='white' />}
							onClick={() => window.open('https://calendly.com/madhavanmalolan/call', '_blank')}>
							Book a Call
						</Button>
					</Flex>

				</Flex>
				{
					!isMobile && (
						<Flex
							bgColor='#045afd'
							flexGrow={1}
							justifyContent='center'>
							<Image
								src='/v2/images/reclaim_bg.svg' />
						</Flex>
					)
				}
			</Flex>
			<Flex
				direction='row'
				w='100%'
				alignItems='stretch'
				alignContent='stretch'
				textAlign='left'
				h='460px'>
				<Flex
					bgColor='black.100'
					padding={[10, 24]}
					flexDirection='column'
					textColor='white'
					width='600px'>
					<Text
						fontWeight='500'
						fontSize='40px'
						lineHeight='48px'
						color='white'>
						Home for
						<Text
							fontWeight='500'
							fontSize='40px'
							lineHeight='48px'
							color='#B6F72B'
							as='span'>
							{' '}
							high quality
							{' '}
						</Text>
						{' '}
						builders
					</Text>

					<Text
						mt={2}
						fontSize='16px'
						lineHeight='24px'
						fontWeight='400'
						color='white'>
						Invite proposals from builders. Review and fund proposals with milestones - on chain.
					</Text>

					<Flex>
						<Button
							variant='primaryLarge'
							mt={8}
							rightIcon={<ArrowRight color='white' />}
							onClick={
								() => router.push({
									pathname: '/request_proposal',
								})
							}>
							Start a grant program
						</Button>
					</Flex>

				</Flex>
				{
					!isMobile && (
						<Flex
							bgColor='#B6F72B'
							flexGrow={1}
							justifyContent='center'>
							<Image
								mt={10}
								src='/Browser Mock.svg' />
						</Flex>
					)
				}
			</Flex>
		</Carousel>
	)
	const isMobile = useMediaQuery({ query:'(max-width:600px)' })
	const router = useRouter()

	return buildComponent()
}

export default HeroBanner