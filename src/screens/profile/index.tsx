import { ReactElement, useContext, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Container, Flex, Grid, GridItem, Link, Skeleton, Text } from '@chakra-ui/react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { WebwalletContext } from 'src/pages/_app'
import GrantStats from 'src/screens/profile/_components/GrantStats'
import ProfileBanner from 'src/screens/profile/_components/ProfileBanner'
import ProfileModal from 'src/screens/profile/_components/ProfileModal'
import RFPCard from 'src/screens/profile/_components/RFPCard'
import { ProfileContext, ProfileProvider } from 'src/screens/profile/Context'

function Profile() {
	const buildComponent = () => {
		return normalView
	}


	const { isLoading, proposals, builder } = useContext(ProfileContext)!
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

		return (
			<>
				<Flex
					bg='white'
					direction='column'
					w='100%'
				>
					<ProfileModal />
					<ProfileBanner
						name={builder?.username ?? scwAddress?.slice(0, 6) + '...' + scwAddress?.slice(-4)}
						imageURL={builder?.imageURL || ''}
						github={builder?.github || ''}
						twitter={builder?.twitter || ''}
						telegram={builder?.telegram || ''}
					/>
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
	}, [proposals, builder, isLoading, isMobile])


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