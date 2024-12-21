import Marquee from 'react-fast-marquee'
import { Container, Flex, Image, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { SectionGrants } from 'src/screens/discover/_utils/types'

function FeaturedSections(sections: {
    sections: SectionGrants
}) {
	logger.info(sections.sections, 'test sections')

	const Card = ({ key, title, logoIpfsHash }: {
		key: number
		title: string
		logoIpfsHash: string
	}) => (
		<Flex
			key={key}
			flexDirection='row'
			justifyContent='center'
			alignItems='center'
			gap='16px'
			border='1px solid rgba(239, 238, 235, 0.5)'
			borderRadius='6px'
			background='rgba(255, 255, 255, 0.95)'
			backdropFilter='blur(8px)'
			padding={['12px 24px', '14px 28px']}
			cursor='pointer'
			mx={3}
			transition='all 0.2s ease-in-out'
			_hover={
				{
					transform: 'translateY(-1px)',
					boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
					border: '1px solid rgba(239, 238, 235, 0.9)'
				}
			}
			onClick={
				() => {
					const element = document.getElementById(title)
					if(element) {
						element.scrollIntoView({ behavior: 'smooth' })
					}
				}
			}
		>
			<Image
				src={logoIpfsHash ? getUrlForIPFSHash(logoIpfsHash) : `https://api.dicebear.com/7.x/identicon/svg?seed=${title}&backgroundColor=ffffff&radius=8`}
				alt={title}
				width='40px'
				height='40px'
				objectFit='cover'
				borderRadius='5px'
				transition='all 0.2s ease-in-out'
				fallback={
					<Image
						src={`https://api.dicebear.com/7.x/identicon/svg?seed=${title}&backgroundColor=ffffff&radius=8`}
						alt={title}
						width='40px'
						height='40px'
						borderRadius='5px'
					/>
				}
			/>
			<Text
				fontSize='16px'
				fontWeight='600'
				lineHeight='normal'
				color='#07070C'
				width='100%'
			>
				{title}
			</Text>
		</Flex>
	)

	return (
		<Container
			bg='white'
			className='domainGrid'
			minWidth='100%'
			p={6}
			w='100%'
			position='relative'
		>
			<Text
				color='#07070C'
				fontSize={['28px', '32px']}
				lineHeight={['36px', '41.6px']}
				variant='heading3'
				fontWeight='700'
				mb={8}
			>
				Featured Grants
			</Text>

			<Marquee
				gradient={true}
				gradientColor='rgba(255, 255, 255, 0.5)'
				gradientWidth={50}
				speed={25}
				pauseOnHover={true}
			>
				{
					sections.sections.map((section, index) => {
						const sectionName = Object.keys(section)[0]
						const sectionLogo = section[sectionName].sectionLogoIpfsHash
						return (
							<Card
								key={index}
								title={sectionName}
								logoIpfsHash={sectionLogo}
							/>
						)
					})
				}
			</Marquee>
		</Container>
	)
}

export default FeaturedSections