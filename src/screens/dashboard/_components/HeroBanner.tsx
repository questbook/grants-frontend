import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Box, Button, Flex, Grid, Image, Text } from '@chakra-ui/react'
import config from 'src/constants/config.json'
import { WorkspaceMember } from 'src/generated/graphql'
import { ProjectDetails, Telegram, Twitter } from 'src/generated/icons'
import { getAvatar } from 'src/libraries/utils'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import RoleTag from 'src/screens/dashboard/_components/RoleTag'
// import { useRouter } from 'next/router'


function HeroBannerBox({
	title,
	programDetails,
	reviewers,
	proposalCount,
	proposalCountAccepted,
	paidOut,
	allocated,
	safeBalances,
	grantTicketSize,
	logoURL,
}: {
	title: string
	programDetails: string
	reviewers: WorkspaceMember[]
	proposalCount: number
	proposalCountAccepted: number
	paidOut: string
    allocated: string
    safeBalances: string
	grantTicketSize: string
    logoURL: string
}) {

	const UserCard = ({ image, title, twitter, telegram, accessLevel }: {
		image: string
		title: string
		twitter?: string
		telegram?: string
		accessLevel?: 'admin' | 'reviewer' | 'community' | 'builder'
	}) => (
		<Flex
			mt={2}
			overflowX='hidden'
		>
			<Flex
				w='100%'
			>
				<Image
					borderRadius='3xl'
					bgColor='white'
					src={image ? getUrlForIPFSHash(image) : getAvatar(false, image ?? title) }
					boxSize='16px' />
				<Flex>
					<Text
						ml={2}
						fontSize={['12px', '16px']}
						variant='metadata'
						textColor='white'
						whiteSpace='nowrap'
					>
						{title}
					</Text>
					<RoleTag
						role={accessLevel ?? 'admin'}
						isBuilder={false}
					/>
				</Flex>
			</Flex>
			<Flex
				gap={2}>
				{
					telegram && (
						<Telegram
							_hover={
								{
									color: 'blue.500',
									cursor: 'pointer',
								}
							}
							onClick={() => window.open(`https://t.me/${telegram}`)}
						/>
					)
				}
				{
					twitter && (
						<Twitter
							_hover={
								{
									color: 'blue.500',
									cursor: 'pointer',
								}
							}
							onClick={() => window.open(`https://twitter.com/${twitter}`)}
						/>
					)
				}
			</Flex>

		</Flex>
	)

	const TitleCards = ({ data, title }: {
		data: string | number
		title: string
	}) => (
		<Flex
			flexDirection='column'
			gap={1}
		>
			<Text
				fontWeight='500'
				fontSize='16px'
				lineHeight='20px'
				color='white'>
				{data}
			</Text>
			<Text
				fontWeight='400'
				fontSize='12px'
				lineHeight='20px'
				textTransform='uppercase'
				color='#C1BDB7'
			>
				{title}
			</Text>
		</Flex>
	)

	const buildComponent = () => (
		<Flex
			direction={isMobile ? 'column' : 'row'}
			w='100%'
			alignItems='stretch'
			alignContent='stretch'
			justifyContent='flex-start'
		>
			{
				!isMobile && (
					<Flex
						bgColor='black.100'
						pl={10}
						justifyContent='center'>
						<Image
							bgColor='transparent'
							borderRadius='8px'
							mt={10}
							justifyContent='center'
							h='24'
							w='48'
							src={logoURL === config.defaultDAOImageHash ? getAvatar(true, logoURL) : getUrlForIPFSHash(logoURL!)} />
					</Flex>
				)
			}

			<Flex
				bgColor='black.100'
				padding={[10]}
				flexDirection='column'
				textColor='white'
				width={isMobile ? '100%' : '80%'}
			>
				{
					isMobile && (

						<Image
							justifyContent='center'
							h='12'
							mb={4}
							w='12'
							style={{ mixBlendMode: 'difference' }}
							src={logoURL === config.defaultDAOImageHash ? getAvatar(true, logoURL) : getUrlForIPFSHash(logoURL!)} />

					)
				}
				<Flex
					gap={2}
			 direction={isMobile ? 'column' : 'row'}
			 w='100%'
				>
					<Text
						fontWeight='500'
						fontSize='18px'
						lineHeight='20px'
						mt={isMobile ? 0 : 2}
						color='white'>
						{title}
					</Text>
					<Button
				 borderRadius='3xl'
				 bgColor='#323639'
				 size='sm'
				 textColor='white'
				 fontSize='14px'
				 w={isMobile ? '50%' : ''}
				 _hover={{ bgColor: 'blue.600' }}
				 onClick={() => window.open(programDetails, '_blank')}
				 rightIcon={<ProjectDetails />}
				 >
						Program Details
					</Button>
				</Flex>
				<Flex
					w={isMobile ? '100%' : '80%'}
					pt={2}
				>
					<Text
						fontWeight='400'
						fontSize='12px'
						lineHeight='16px'
						color='white'>
						{`This domain is focused on grants related to the ${title} Ecosystem`}
					</Text>

				</Flex>
				<Flex
					pt={2}
					gap={2}>
					<Text
						fontWeight='500'
						fontSize='14px'
						lineHeight='20px'
						color='#C1BDB7'>
						Grant Ticket Size:
					</Text>
					<Text
						fontWeight='500'
						fontSize='14px'
						lineHeight='20px'
						color='white'>
						{grantTicketSize}
					</Text>
				</Flex>
			</Flex>
			<Flex
				mt={isMobile ? -8 : 0}
				bgColor='black.100'
				padding={4}
				w='100%'
				flexDirection={isMobile ? 'column' : 'row'}
				textColor='white'
			>
				<Box
					borderTop='1px solid #53514F'
					borderLeft='1px solid #53514F'
					borderBottom='1px solid #53514F'
					borderRight={isMobile ? '1px solid #53514F' : 'none'}
					p={5}
					w='100%'
				>

					<Text
						fontWeight='500'
						fontSize='18px'
						lineHeight='24px'
						color='#C1BDB7'>
						Grant Stats
					</Text>

					<Grid
						mt={5}
						gap='8px'
						templateColumns={isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'}
						flexWrap='wrap'
						justifyContent='flex-start'>
						<TitleCards
							data={safeBalances ?? 0}
							title='left in multisig' />
						<TitleCards
							data={proposalCount ?? 0}
							title='Proposals' />
						<TitleCards
							data={proposalCountAccepted ?? 0}
							title='Accepted' />
						<TitleCards
							data={paidOut ?? 0}
							title='Paid Out' />
						<TitleCards
							data={allocated ?? 0}
							title='Funds Allocated' />

					</Grid>
				</Box>
				<Box
					border='1px solid #53514F'
					w={isMobile ? '100%' : '70%'}
				>
					<Box
						borderBottom='1px solid #53514F'
						p={2}
					>
						<Text
							fontWeight='500'
							fontSize='18px'
							lineHeight='24px'
							color='white'>
							Reviewers (
							{reviewers?.length}
							)
						</Text>
					</Box>

					<Flex
						p={2}
						gap='8px'
						flexDirection='column'
						textOverflow='ellipsis'
						overflowWrap='break-word'

						justifyContent='flex-start'>
						{
							reviewers?.slice(0, expandReviewers).map((reviewer, i) => (
								<UserCard
									key={i}
									image={reviewer?.profilePictureIpfsHash as string}
									title={reviewer?.fullName ?? reviewer?.actorId?.slice(0, 6) + '...' + reviewer?.actorId?.slice(-4)}
									twitter=''
									accessLevel={reviewer?.accessLevel === 'reviewer' ? 'reviewer' : 'admin'}
								/>
							))
						}
						{
							reviewers.length > 4 && (expandReviewers < reviewers?.length) && (
								<Button
									onClick={() => setExpandReviewers(expandReviewers + 4)}
									bgColor='transparent'
									textColor='white'
									_hover={{ bgColor: 'transparent' }}
								>
									{' '}
									Show More
								</Button>
							)
						}

					</Flex>
				</Box>
			</Flex>
			{/* {
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
			} */}


		</Flex>
	)
	const [expandReviewers, setExpandReviewers] = useState(4)
	const isMobile = useMediaQuery({ query:'(max-width:600px)' })
	return buildComponent()
}

export default HeroBannerBox