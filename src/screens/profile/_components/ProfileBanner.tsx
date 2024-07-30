import { useContext } from 'react'
import { FaExternalLinkAlt, FaGithub, FaTelegram, FaTwitter } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { EditIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Flex, HStack, Image, Text } from '@chakra-ui/react'
import { getAvatar } from 'src/libraries/utils'
import { titleCase } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { WebwalletContext } from 'src/pages/_app'
import RoleTag from 'src/screens/dashboard/_components/RoleTag'
import { timeAgo } from 'src/screens/profile/_utils/formatters'
import { ProfileContext } from 'src/screens/profile/Context'
import { generateProof } from 'src/screens/profile/hooks/generateProof'


function ProfileBanner({
	imageURL,
	name,
	github,
	twitter,
	telegram,
	bio
}: {
	imageURL: string
	name: string
	github: string
	twitter: string
	telegram: string
	bio: string
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

		const VerifySocial = (provider: string) => {
			if(scwAddress && scwAddress !== builder?.address || !scwAddress) {
				return null
			}

			return (
				<Flex
					cursor='pointer'
					gap='5px'
					flexWrap={['wrap', 'nowrap']}
					onClick={

						async() => {
							if(provider && scwAddress) {
								setIsQrModalOpen(true)
								const proof = await generateProof(provider, scwAddress)
								if(proof.error) {
									setIsQrModalOpen(false)
									return
								}

								setQrCode(proof.requestUrl)
								setProviderName(provider)
								setIsQrModalOpen(true)
							}
						}

					}
					alignItems='center'
				>
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
					<Text
						color='#7E7E8F'
						fontSize='16px'
						fontStyle='normal'
						fontWeight='500'
						lineHeight='130%'
					>
						Link your
						{' '}
						{titleCase(provider)}
					</Text>
					<FaExternalLinkAlt
						color='#7E7E8F'
						fontSize='12px'
					/>
				</Flex>
			)
		}

		return (
			<Flex
				flexDirection='column'
				justifyContent='center'>
				<Image
					src='/v2/images/profile-bg.png'
					width='100%'
					height='150px'
					mixBlendMode='hard-light'
					objectFit='cover'
					bgBlendMode='hard-light'
					bgColor='green.800'
				/>

				<Flex
					alignItems='center'
					flexDirection={['column', 'row']}
					mt={[5, 2]}
					p={4}
					borderRadius='md'
					top={['100px', '-100px']}
				>
					<Avatar
				  boxSize={[16, 32]}
				  mt={-20}
				  name='avatar'
				  border='4px solid white'
				  src={imageURL === '' ? getAvatar(false, name) : getUrlForIPFSHash(imageURL)}
				  bg='pink.400'
					/>
					<Box
						ml={4}
						w='100%'>
						<Flex alignItems='center'>
							<Text
								fontSize='2xl'
								fontWeight='bold'>
								{name}
							</Text>
							<RoleTag
								role='builder'
								isBuilder={true}
							/>
						</Flex>
						{
							scwAddress && scwAddress === builder?.address && !isMobile && (
								<Flex
									float='right'
									direction='column'
									alignItems='center'
								>
									<Button
										variant='solid'
										borderRadius='3xl'
										leftIcon={<EditIcon />}
										onClick={() => setBuildersProfileModal(true)}
									>
										Edit
									</Button>
									<Text
										fontSize='smaller'
										color='gray.600'
									>
										Last updated
										{' '}
										<br />
										{' '}
										{builder?.updatedAt && timeAgo(builder?.updatedAt)}
									</Text>
								</Flex>
							)
						}
						<HStack
							spacing={2}
							flexWrap={['wrap', 'nowrap']}
							gap={4}
							mt={4}>
							{github ? social('github', github) : VerifySocial('github')}
							{twitter ? social('twitter', twitter) : VerifySocial('twitter')}
							{telegram && social('telegram', telegram)}
						</HStack>
						<Text
							mt={4}
							w={['100%', '60%']}
							color='gray.600'>
							{bio}
						</Text>
					</Box>
				</Flex>


			</Flex>
		)
	}

	const { setIsQrModalOpen, setQrCode, setProviderName, builder } = useContext(ProfileContext)!
	const { scwAddress, setBuildersProfileModal } = useContext(WebwalletContext)!
	const isMobile = useMediaQuery({ query: '(max-width:600px)' })

	return buildComponent()
}

export default ProfileBanner