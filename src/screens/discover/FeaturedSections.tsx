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
			borderRadius='8px'
			border='1px solid #EFEEEB'
			background='#FFF'
			padding={['8px 24px', '14px 20px']}
			cursor='pointer'
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
				src={getUrlForIPFSHash(logoIpfsHash)}
				alt={title}
				width='20px'
				height='20px'
			/>
			<Text
				fontSize='16px'
				fontWeight='700'
				lineHeight='normal'
				color='#07070C'

			>
				{title}
			</Text>
		</Flex>
	)

	const buildComponent = () => {
		return (
			<Container
				bg='white'
				className='domainGrid'
				minWidth='100%'
				p={4}
				w='100%'>
				<Text
					color='#07070C'
					fontSize='32px'
					lineHeight='41.6px'
					variant='heading3'
					fontWeight='700'
					mt={8}
					mb={8}
				>
					Featured Grants
				</Text>

				<Flex
					gap='24px'
					overflowX='auto'
					p={0}
					justifyContent='flex-start'>

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
				</Flex>
			</Container>
		)
	}

	return buildComponent()
}

export default FeaturedSections