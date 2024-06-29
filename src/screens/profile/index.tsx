import { ReactElement, useContext, useMemo } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { Container, Flex, Grid, GridItem, Image, Link, Skeleton, Text } from '@chakra-ui/react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { WebwalletContext } from 'src/pages/_app'
import GrantStats from 'src/screens/profile/_components/GrantStats'
import ProfileBanner from 'src/screens/profile/_components/ProfileBanner'
import ProfileModal from 'src/screens/profile/_components/ProfileModal'
import ProofQrModal from 'src/screens/profile/_components/ProofQrModal'
import RFPCard from 'src/screens/profile/_components/RFPCard'
import { supportedProviders } from 'src/screens/profile/_utils/constant'
import { ProfileContext, ProfileProvider } from 'src/screens/profile/Context'
import { generateProof } from 'src/screens/profile/hooks/generateProof'

function Profile() {
	const buildComponent = () => {
		return normalView
	}


	const { isLoading, proposals, builder, isQrModalOpen, setIsQrModalOpen, qrCode, setQrCode, setProviderName } = useContext(ProfileContext)!
	const { scwAddress } = useContext(WebwalletContext)!

	const isMobile = useMediaQuery({ query: '(max-width:600px)' })

	const normalView = useMemo(() => {
		const calculateLoadingHeight = () => {
			// if scw is done loading and there's still no webwallet
			// it means no loading section should be displayed (need to sign in)
			if(proposals?.length) {
				return '70px'
				// if we're loading the scw or the webwallet but no section grants
				// we show a big loading section
			} else {
				return '500px'
			}
		}

		const DaoBadges = ({
			image,
			name,
			value
		}: {
			image: string
			name: string
			value: string
		}) => {
			if(!value && (scwAddress !== builder?.address || (isMobile && scwAddress === builder?.address))) {
				return null
			}


			return (
				<Flex
					direction='row'
					align='center'
					gap={2}
					cursor={!value ? 'pointer' : ''}
					onClick={
						async() => {
							if(!value && scwAddress) {
								const proof = await generateProof(name, scwAddress)
								if(proof.error) {
									return
								}

								setQrCode(proof.requestUrl)
								setProviderName(name)
								setIsQrModalOpen(true)
							}
						}
					}
				>
					<Image
						borderRadius='3xl'
						bgColor='white'
						src={image ? getUrlForIPFSHash(image) : ''}
						boxSize='16px'
						alt={name}
					/>
					<Text
						color='black'
						fontSize='16px'
						fontWeight='700'
						lineHeight='20.8px'
					>
						{value ? `${value} badges` : 'Prove via Reclaim'}
					</Text>
					{
						!value && (
							<FaExternalLinkAlt
								color='black'
								fontSize='16px'
							/>
						)
					}
				</Flex>
			)
		}

		const providerInfo = (provider: string) => {
			switch (provider) {
			case 'compound':
				return builder?.compound?.extractedParameters?.badge_count || ''
			case 'arbitrum':
				return builder?.arbitrum?.extractedParameters?.badge_count || ''
			case 'axelar':
				return builder?.axelar?.extractedParameters?.badge_count || ''
			case 'polygon':
				return builder?.polygon?.extractedParameters?.badge_count || ''
			case 'ens':
				return builder?.ens?.extractedParameters?.badge_count || ''
			case 'github':
				return builder?.github?.extractedParameters?.username || ''
			case 'twitter':
				return builder?.twitter?.extractedParameters?.username || ''
			default:
				return ''
			}
		}


		return (
			<>
				<Flex
					bg='white'
					direction='column'
					w='100%'
				>
					<ProfileModal />
					<ProofQrModal
						isOpen={isQrModalOpen}
						onClose={() => setIsQrModalOpen(false)}
						proofQr={qrCode}
					/>
					<ProfileBanner
						name={builder?.username ?? scwAddress?.slice(0, 6) + '...' + scwAddress?.slice(-4)}
						imageURL={builder?.imageURL || ''}
						github={builder?.github?.extractedParameters?.username || ''}
						twitter={builder?.twitter?.extractedParameters?.username || ''}
						telegram={builder?.telegram || ''}
					/>
					{
						(!isLoading && builder && builder?.username) && (
							<Container
								bg='white'
								className='domainGrid'
								minWidth='70%'
								p={4}
								w='100%'>
								<Text
									color='#07070C'
									fontSize='32px'
									mt={5}
									mb={5}
									fontStyle='normal'
									fontWeight='700'
									lineHeight='130%'>
									Contributions
								</Text>
								<Flex
									mt={5}
									w='100%'
									gap='38px'
									flexWrap='wrap'
								>
									{
										supportedProviders.map(provider => {
											return (
												<DaoBadges
													name={provider.name}
													image={provider.icon}
												    value={providerInfo(provider.name) || ''}

													key={provider.name}
												/>
											)
										})
									}

								</Flex>
							</Container>
						)
					}
					{
						!isLoading && proposals && proposals?.length > 0 ? (
							<Container
								bg='white'
								className='domainGrid'
								minWidth='70%'
								p={4}
								w='100%'>
								<Text
									color='#07070C'
									fontSize='32px'
									mt={5}
									mb={5}
									fontStyle='normal'
									fontWeight='700'
									lineHeight='130%'>
									Grants
								</Text>
								<GrantStats
								  totalProposals={proposals?.length || 0}
								  totalProposalsAccepted={proposals?.filter(proposal => proposal?.state === 'approved').length || 0}
								  fundsPaidOut={proposals?.reduce((acc, proposal) => acc + proposal?.milestones.reduce((acc, milestone) => acc + parseFloat(milestone.amountPaid), 0), 0) || 0}
								  fundsAllocated={proposals?.reduce((acc, proposal) => acc + proposal?.milestones.reduce((acc, milestone) => acc + parseFloat(milestone.amount), 0), 0) || 0}
								  milestones={proposals?.reduce((acc, proposal) => acc + proposal?.milestones.length, 0) || 0}
								  milestonesCompleted={proposals?.reduce((acc, proposal) => acc + proposal?.milestones.filter(milestone => parseFloat(milestone.amountPaid) > 0).length, 0) || 0}
								/>

								<Grid
									mt={5}

									w='100%'
									templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
									gap={8}
								 >
									{
										proposals?.length && proposals
											.map((proposal, index: number) => {
												return (
													<GridItem
														 key={index}>
														<RFPCard
															key={index}
															proposal={proposal}
														/>

													</GridItem>
												)
											})
									}
								</Grid>


							</Container>
						)
							: !isLoading && proposals && proposals?.length === 0 ? (
								<Flex
									bg='white'
									flexDirection='column'
									w='100%'
									mt={32}
									align='center'
									justify='center'>
									<Text
										color='black'
										fontSize='24px'
										fontWeight='700'
										lineHeight='31.2px'>
										No Proposals Found
									</Text>
								</Flex>
							) :

								(
									<Skeleton
										width='100%'
										h={calculateLoadingHeight()}
										startColor='gray.300'
										endColor='gray.400'
									/>
								)
					}

					<Flex
						bg='white'
						flexDirection='column'
						w='100%'
						mt={32}
						align='center'
						justify='center'>
						<Link
							textAlign='center'
							isExternal
							variant='body'
							color='accent.azure'
							href='https://questbook.app/termsofservice.html'>
							Questbook - Terms of Service
						</Link>
						<Link
							textAlign='center'
							isExternal
							variant='body'
							color='accent.azure'
							href='https://questbook.app/privacypolicy.html'>
							Privacy Policy
						</Link>
					</Flex>


				</Flex>
			</>
		)
	}, [proposals, builder, isLoading, isMobile, isQrModalOpen, scwAddress])


	return (
		<div style={{ width: '100%', background: 'white' }}>
			{buildComponent()}
		</div>
	)
}

Profile.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
		>
			<ProfileProvider>
				{page}
			</ProfileProvider>
		</NavbarLayout>
	)
}

export default Profile