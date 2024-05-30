import { FaGithub, FaTelegram, FaTwitter } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { getAvatar } from 'src/libraries/utils'
import { titleCase } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'


function ProfileBanner({
	imageURL,
	name,
	github,
	twitter,
	telegram
}: {
	imageURL: string
	name: string
	github: string
	twitter: string
	telegram: string
}) {


	const buildComponent = () => {

		const LinkFormatter = ({ link, type }: {
			link: string
			type: string
		}) => {
			if(link?.startsWith('https')) {
			  return link
			}

			if(link?.startsWith('@')) {
			  switch (type) {
				case 'twitter':
				  return `https://twitter.com/${link.substring(1)}`
				case 'telegram':
				  return `https://t.me/${link.substring(1)}`
				case 'github':
				  return `https://github.com/${link.substring(1)}`
				default:
				  return link
			  }
			} else {
				switch (type) {
				case 'twitter':
					return `https://x.com/${link}`
				case 'telegram':
					return `https://t.me/${link}`
				case 'github':
					return `http://github.com/${link}`
				default:
					return link
				}
		  }
		}


		const social = (provider: string, link: string) => {
			return (
				<Flex
					cursor='pointer'
					gap='5px'
					onClick={() => window.open(LinkFormatter({ link, type: provider }), '_blank')}
					alignItems='center'
				>
					<Text
						color='#7E7E8F'
						fontSize='16px'
						fontStyle='normal'
						fontWeight='500'
						lineHeight='130%'
					>
						{titleCase(provider)}
					</Text>
					{
						provider === 'github' ? (
							<FaGithub
								color='#7E7E8F'
							/>
						) : provider === 'twitter' ? (
							<FaTwitter
								color='#7E7E8F'
							/>
						) : (
							<FaTelegram
								color='#7E7E8F'
							/>
						)
					}
				</Flex>
			)
		}

		return (
			<Flex
				bgColor='#F7F5F2'
				padding='32px 48px'
				gap='20px'
				flexDirection='column'
				alignContent='center'
				alignItems='center'
				borderRadius='0px 0px 48px 48px'
				justifyContent='center'>
				<Box
					maxWidth={isMobile ? '100%' : '70%'}
					width='100%'
					gap='12px'
				>

					<Image
						borderWidth='1px'
						borderColor='black.100'
						borderRadius='10.143px'
						rounded='full'
						mb={4}
						src={imageURL === '' ? getAvatar(false, name) : getUrlForIPFSHash(imageURL)}
						boxSize='120px' />
					<Text
						color='#07070C'
						fontSize='42px'
						fontStyle='normal'
						fontWeight='700'
						lineHeight='130%'
					>
						{name}
					</Text>
					<Flex
						mt='12px'
						gap='20px'>
						{github && social('github', github)}
						{twitter && social('twitter', twitter)}
						{telegram && social('telegram', telegram)}
					</Flex>
				</Box>
			</Flex>
		)
	}

	const isMobile = useMediaQuery({ query: '(max-width:600px)' })
	return buildComponent()
}

export default ProfileBanner