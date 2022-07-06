import React, { useState } from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import Link from 'next/link'
import NewNavbar from 'src/components/navbar/newNavbar'


function ContributionType() {

	const [contributionType, setContributionType] = useState('grant')

	return (
		<div style={{ height: '100vh', backgroundColor: '#F5F5F5' }}>
			<NewNavbar />
			<Container paddingTop={10}>
				<Box>
					<Text
						fontWeight={'700'}
						fontSize={'24px'}>
                        What would you like to post?
					</Text>
					<Box
						display={'flex'}
						flexDirection={'row'}
						paddingTop={10}>
						<Box
							as='button'
							w={'20em'}
							h={'14em'}
							bg='white'
							borderWidth={contributionType === 'grant' ? 2 : 0}
							borderColor={contributionType === 'grant' ? '#0065FF' : ''}
							display='flex'
							justifyContent={'center'}
							alignItems='center'
							flexDirection={'column'}
							borderRadius={'md'}
							position={'relative'}
							onClick={
								() => {
									setContributionType('grant')
								}
							}>
							{
								contributionType === 'grant' ? (
									<img
										src='/new_icons/checked_checkbox.svg'
										style={{ position: 'absolute', top: 20, right: 20 }} />
								) : (
									<img
										src='/new_icons/unchecked_checkbox.svg'
										style={{ position: 'absolute', top: 20, right: 20 }} />
								)
							}
							<img
								src='/images/explorer.png'
								width={'80px'}
								style={{ marginBottom: 20 }} />
							<Box>
								<Text
									textAlign={'center'}
									fontWeight={'700'}
									marginBottom={'10px'}>
                                Grant
								</Text>
								<Text
									textAlign={'center'}
									fontSize={'14px'}
									paddingLeft={'10px'}
									paddingRight={'10px'}>
                                Fund concepts, long term projects with many milestone based projects.
								</Text>
							</Box>
						</Box>
						<Box
							as='button'
							w={'20em'}
							h={'14em'}
							bg='white'
							borderWidth={contributionType === 'bounty' ? 2 : 0}
							borderColor={contributionType === 'bounty' ? '#0065FF' : ''}
							display='flex'
							justifyContent={'center'}
							alignItems='center'
							flexDirection={'column'}
							marginLeft={'24px'}
							borderRadius={'md'}
							position={'relative'}
							onClick={
								() => {
									setContributionType('bounty')
								}
							}>
							{
								contributionType === 'bounty' ? (
									<img
										src='/new_icons/checked_checkbox.svg'
										style={{ position: 'absolute', top: 20, right: 20 }} />
								) : (
									<img
										src='/new_icons/unchecked_checkbox.svg'
										style={{ position: 'absolute', top: 20, right: 20 }} />
								)
							}
							<Text
								bg={' #F3D950'}
								position={'absolute'}
								top={'20px'}
								fontSize={'11px'}
								fontWeight={'700'}
								paddingLeft={'4px'}
								paddingRight={'4px'}
								borderRadius={'sm'}
								left={'16px'}>
                                LAUNCHING SOON
							</Text>

							<img
								src='/images/explorer.png'
								width={'80px'}
								style={{ marginBottom: 20 }} />
							<Box>
								<Text
									textAlign={'center'}
									fontWeight={'700'}
									marginBottom={'10px'}>
                                Bounty
								</Text>
								<Text
									textAlign={'center'}
									fontSize={'14px'}
									paddingLeft={'10px'}
									paddingRight={'10px'}>
                                Specific tasks to be done, short term & single milestone projects
								</Text>
							</Box>
						</Box>
					</Box>
				</Box>
			</Container>
			<div style={{ position: 'absolute', bottom: 0, paddingBottom: 36, paddingLeft: 40, paddingRight:40, width: '100%' }}>
				<Box
					display={'flex'}
					flexDirection='row'
					alignItems={'center'}>
					{
						contributionType === 'bounty' ? (
							<Text
								fontSize={'12px'}
								color={'#7D7DA0'}
								marginLeft={'auto'}>
						You will be redirected to a survey to understand your bounty needs & use cases better.
							</Text>
						) : null
					}
					<Box
						as='button'
						borderRadius='sm'
						borderWidth={1}
						borderColor='#1F1F33'
						color={'#1F1F33'}
						paddingLeft={'12px'}
						paddingRight={'12px'}
						paddingTop={'6px'}
						paddingBottom={'6px'}
						marginLeft={contributionType === 'bounty' ? '16px' : 'auto'}
					>
						<Text fontWeight={'500'}>
                                Back
						</Text>
					</Box>
					<Link
						href={
							contributionType === 'bounty' ?
								'https://airtable.com/shrOZjffuc12E6mu7' : '/your_grants/create_new_grant'
						}>
						<Box
							as='button'
							borderRadius='sm'
							bg='#1F1F33'
							marginLeft={10}
							color='white'
							display={'flex'}
							flexDirection={'row'}
							alignItems={'center'}
							paddingLeft={'12px'}
							paddingRight={'12px'}
							paddingTop={'6px'}
							paddingBottom={'6px'}>
							<Text fontWeight={'500'}>
                                    Continue
							</Text>
							<img
								src='/new_icons/arrow_right.svg'
								style={{ marginLeft: '10px' }} />
						</Box>
					</Link>
				</Box>
			</div>


		</div>
	)
}

export default ContributionType