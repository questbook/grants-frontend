import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function NavbarHeader({ currentState }:{currentState:number}) {
	const router = useRouter()
	const pageUrl = router.pathname

	const headerDetails = [
		['Describe', 'Describe your grant'],
		[
			'Details',
			'Explain the grant in detail'
		],
		[
			'Applicant',
			'Applicant details'
		],
		[
			'Evaluation',
			'Applicant Evaluation'
		],
		[
			'Reward',
			'Reward Details'
		],
	]

	return (
		<Box>
			{
				pageUrl.includes('contribution_type') ? (
					<Text
						fontSize='5xl'
						color={'#B6F72B'}
						fontWeight={'700'}
						position={'absolute'}
						bottom={0}>
                        Let&apos;s scale contributors
					</Text>
				) : null
			}
			{
				pageUrl.includes('review_new_grant') ? (
					<Text
						fontSize='5xl'
						color={'#B6F72B'}
						fontWeight={'700'}
						position={'absolute'}
						bottom={0}>
                        Review your grant
					</Text>
				) : null
			}
			{
				pageUrl.includes('create_new_grant') ? (
					<Box

						position={'absolute'}
						left={0}
						bottom={0}>
						<Box
							display={'flex'}
							flexDirection={'row'} >
							{
								headerDetails.map(([title, description], index) => (
									<Box key={index}>
										<Box
											marginLeft={index !== 0 ? '20px' : 0}
											width={'106px'}
										>
											<Box
												bg={currentState === index ? '#4C9AFF' : 'white'}
												w='100%'
												p={'2px'}
												borderRadius={'100px'}
												marginBottom='10px' />
											<Box
												display={'flex'}
												flexDirection='row'>
												{
													currentState === index ? (
														<img
															src='/new_icons/active_state.svg'
															style={{ marginRight: '10px' }} />
													) : (
														<img
															src='/new_icons/inactive_state.svg'
															style={{ marginRight: '10px' }}
															width='15.5px' />
													)
												}

												<Text color={currentState === index ? '#4C9AFF' : 'white'}>
													{title}
												</Text>
											</Box>

										</Box>

									</Box>
								))
							}
						</Box>
						{
							headerDetails.map(([title, description], index) => (
								<Box key={index}>
									{
										index === currentState ? (
											<Text
												fontSize='5xl'
												color={'#B6F72B'}
												fontWeight={'700'}
											>
												{description}
											</Text>
										) : null
									}
								</Box>
							))
						}
					</Box>
				) : null
			}
		</Box>
	)
}

export default NavbarHeader