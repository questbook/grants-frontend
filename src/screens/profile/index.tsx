import { ReactElement, useContext, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Box, Button, Container, Divider, Flex, Grid, GridItem, Image, Link, Skeleton, Text } from '@chakra-ui/react'
import BackButton from 'src/libraries/ui/BackButton'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { titleCase } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { WebwalletContext } from 'src/pages/_app'
import GrantStats from 'src/screens/profile/_components/GrantStats'
import ProfileBanner from 'src/screens/profile/_components/ProfileBanner'
import ProfileModal from 'src/screens/profile/_components/ProfileModal'
import ProofQrModal from 'src/screens/profile/_components/ProofQrModal'
import ProposalCard from 'src/screens/profile/_components/ProposalCard'
import StateButton from 'src/screens/profile/_components/stateButton'
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
				<Box
					border='1px solid #E7E4DD'
					p={4}>
					<Flex
						gap={4}
						alignItems='center'
					>
						<Flex
						>
							<Image
								bgColor='white'
								src={image ? getUrlForIPFSHash(image) : ''}
								boxSize='24'
								w='auto'
								alt={name}
							/>
						</Flex>
						<Flex

							direction='column'
							gap={4}>

							<Flex
								gap={4}>
								<Text
									color='black'
									fontWeight='500'
									fontSize='lg'
									lineHeight='130%'
									w='80%'

								>
									{name?.charAt(0).toUpperCase() + name?.slice(1)}
									{' '}
									Contribution Badge


								</Text>
								{
									value && (
										<StateButton
											title={value}
											state='approved'
											icon={false}
										/>

									)
								}
							</Flex>
							{
								scwAddress === builder?.address && (
									<Button
										variant='unstyled'
										w='fit-content'
										onClick={
											async() => {
												if(scwAddress) {
													const proof = await generateProof(name, scwAddress)
													if(proof.error) {
														return
													}

													setQrCode(proof.requestUrl)
													setProviderName(name)
													setIsQrModalOpen(true)
												}
											}
										}>
										<StateButton
											title={!value ? 'Link ' + titleCase(name) : 'Re-Verify'}
											state={!value ? 'approved' : 'resubmit'}
											icon={!!value}
										/>
									</Button>
								)
							}
						</Flex>


					</Flex>
				</Box>
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
			<Flex
				width='100vw'
				direction='column'
				justifyContent='flex-start'
				px={8}
				py={4}
				gap={2}
			>
				<BackButton alignSelf='flex-start' />
				<Flex
					bg='white'
					h='max-content'
					p={8}
					direction='column'
					gap={4.5}
					border='1px solid #E7E4DD'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				>
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
							bio={builder?.bio || ''}
						/>
						{
							(!isLoading && builder && builder?.username) && (
								<Container
									bg='white'
									className='domainGrid'
									minWidth='100%'
									p={4}
									w='100%'>

									<Text
										variant='heading1'
										fontWeight='500'
										fontSize='lg'
									>
										Badges Earned
									</Text>
									<Divider my={2} />
									<Grid
										mt={5}
										w='100%'
										gap='25px'
										templateColumns={{ md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
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


									</Grid>
									{
										scwAddress !== builder?.address &&
										supportedProviders.every(provider => !providerInfo(provider.name))
										&& (
											<Text
												fontSize='lg'
												fontWeight='500'
												align='center'
												mt={12}
												color='black'
											>
												No Badges Found
											</Text>
										)
									}
								</Container>
							)
						}
						{
							!isLoading && proposals && proposals?.length > 0 ? (
								<Container
									bg='white'
									className='domainGrid'
									minWidth='100%'
									p={4}
									w='100%'>
									<GrantStats
								  totalProposals={proposals?.length || 0}
								  totalProposalsAccepted={proposals?.filter(proposal => proposal?.state === 'approved').length || 0}
								  fundsPaidOut={proposals?.reduce((acc, proposal) => acc + proposal?.milestones.reduce((acc, milestone) => acc + parseFloat(milestone.amountPaid), 0), 0) || 0}
								  fundsAllocated={proposals?.reduce((acc, proposal) => acc + proposal?.milestones.reduce((acc, milestone) => acc + parseFloat(milestone.amount), 0), 0) || 0}
								  milestones={proposals?.reduce((acc, proposal) => acc + proposal?.milestones.length, 0) || 0}
								  milestonesCompleted={proposals?.reduce((acc, proposal) => acc + proposal?.milestones.filter(milestone => parseFloat(milestone.amountPaid) > 0).length, 0) || 0}
									/>
									<Text
										variant='heading1'
										fontWeight='500'
										mt={5}
										fontSize='lg'
									>
										Grants Applied
									</Text>
									<Divider my={2} />


									<Grid
										mt={5}

										w='100%'
										templateColumns={{ md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
										gap={8}
								 >
										{
											proposals?.length && proposals
												.map((proposal, index: number) => {
													return (
														<GridItem
														 key={index}>
															<ProposalCard
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
											fontSize='lg'
											fontWeight='500'
											align='center'
											mt={12}
											color='black'>
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
				</Flex>
			</Flex>
		)
	}, [proposals, builder, isLoading, isMobile, isQrModalOpen, scwAddress])


	return buildComponent()
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