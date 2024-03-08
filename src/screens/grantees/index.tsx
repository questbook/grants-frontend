import { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Box, Container, Flex, Link, Skeleton, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import SearchField from 'src/libraries/ui/SearchField'
import { ApiClientsContext, SignInContext, SignInTitleContext } from 'src/pages/_app' //TODO - move to /libraries/zero-wallet/context
import RFPGrid from 'src/screens/grantees/_components/rfpGrid'
import { GranteeContext, GranteeProvider } from 'src/screens/grantees/Context'
import HeroBanner from 'src/screens/grantees/HeroBanner'

function Grantee() {
	const { inviteInfo } = useContext(ApiClientsContext)!
	const { setSignInTitle } = useContext(SignInTitleContext)!
	const buildComponent = () => {
		return normalView
	}


	// const GranteeRef = useRef<HTMLDivElement>(null)

	const { sectionGrants, recentProposals, isLoading } = useContext(GranteeContext)!
	const { setSignIn } = useContext(SignInContext)!


	const [filterGrantName, setFilterGrantName] = useState('')


	const isMobile = useMediaQuery({ query: '(max-width:600px)' })

	const normalView = useMemo(() => {
		const calculateLoadingHeight = () => {
			// if scw is done loading and there's still no webwallet
			// it means no loading section should be displayed (need to sign in)
			 if(sectionGrants?.length) {
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
					<HeroBanner />
					{
						!isLoading ? (
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
									Explore funded grants
								</Text>
								<SearchField
									bg='white'
									border='1px solid #E1DED9'
									w='100%'
									// inputGroupProps={{ ml: 4 }}
									mb={6}
									placeholder='Search for funded grants by entering their protocol names or program names'
									value={filterGrantName}
									onKeyDown={
										(e) => {
											if(e.key === 'Enter' && filterGrantName !== undefined) {
												setFilterGrantName(filterGrantName)
											}
										}
									}
									onChange={
										(e) => {
											setFilterGrantName(e.target.value)
										}
									}
								/>

								<Flex
									w='100%'
									my={4}
									justify='space-between'>
									<Flex
										direction='column'
										w='100%'
									>
										<Box
											display={sectionGrants?.length ? '' : 'none'}
										>
											{
												(sectionGrants && sectionGrants?.length > 0) ? sectionGrants.map((section, index) => {
													logger.info('section', { section, sectionGrants })
													const sectionName = Object.keys(section)[0]
													//@ts-ignore
													const proposals = recentProposals?.filter((p) => p.sectionName === sectionName && p.name[0].values[0].value.toLowerCase().includes(filterGrantName.toLowerCase()))
													if(proposals?.length === 0) {
														return null
													}

													return (
														<Box
															my={6}
															key={index}
														>
															<Flex
																gap={3}
																alignItems='center'
																mb={4}
															>
																<Text
																	color='#07070C'
																	fontWeight='700'
																	fontSize='24px'
																	lineHeight='31.2px'
																	variant='subheading'
																>
																	{sectionName}
																</Text>
															</Flex>

															<RFPGrid
																proposals={proposals ?? []}
															/>
														</Box>
													)
												}) : null
											}
										</Box>
									</Flex>
								</Flex>
								<Flex
									flexDirection='column'
									w='100%'
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
										href='questbook.app/privacypolicy.html'>
										Privacy Policy
									</Link>
								</Flex>

							</Container>
						)
							: 											(
								<Skeleton
									width='100%'
									h={calculateLoadingHeight()}
									startColor='gray.300'
									endColor='gray.400'
								/>
							)
					}

				</Flex>
			</>
		)
	}, [sectionGrants, filterGrantName, isMobile])

	useEffect(() => {
		if(!inviteInfo) {
			setSignInTitle('default')
			return
		}

		setTimeout(() => {
			setSignInTitle(inviteInfo?.role === 0 ? 'admin' : 'reviewer')
			setSignIn(true)
		}, 2000)

	}, [inviteInfo])


	return (
		<>
			{buildComponent()}
		</>
	)
}

Grantee.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
		>
			<GranteeProvider>
				{page}
			</GranteeProvider>
		</NavbarLayout>
	)
}

export default Grantee