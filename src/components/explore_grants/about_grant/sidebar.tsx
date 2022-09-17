import React from 'react'
import {
	Badge,
	Box, Button, HStack, Text,
	Tooltip,
	VStack, } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import FloatingSidebar from 'src/components/ui/sidebar/floatingSidebar2'
import { SupportedChainId } from 'src/constants/chains'
import type { GetGrantDetailsQuery } from 'src/generated/graphql'
import { getFieldLabelFromFieldTitle } from 'src/utils/formattingUtils'

type GrantRequiredFields = GetGrantDetailsQuery['grants'][number]['fields']

interface Props {
  grantRequiredFields: GrantRequiredFields
  grantID: string
  chainId: SupportedChainId | undefined
  acceptingApplications: boolean
  alreadyApplied: boolean
}

function Sidebar({
	grantRequiredFields,
	grantID,
	chainId,
	acceptingApplications,
	alreadyApplied,
}: Props) {
	const router = useRouter()
	return (
		<Box
			my='41px'
			display={{ base: 'none', md: 'flex' }}>
			<FloatingSidebar>
				<Text
					variant='heading'
					fontSize='18px'
					lineHeight='26px'
					mt={3}>
					Requisite for Application
				</Text>
				<VStack
					alignItems='stretch'
					mt={10}
					p={0}
					spacing={4}>
					{
						grantRequiredFields?.map(({ id, title, isPii }) => {
							const formattedTitle = getFieldLabelFromFieldTitle(title)
							return (
								<HStack key={id}>
									<Text
										fontWeight='400'
										fontSize='16px'
										lineHeight='20px'>
										{formattedTitle}
									</Text>
									<Box w={0.5} />
									{
										isPii && (
											<Tooltip label='Only you & the grant managers can see this data'>
												<Badge
													fontSize='x-small'
													bg='v2LightGrey'>
													Private
												</Badge>
											</Tooltip>
										)
									}
								</HStack>
							)
						})
					}
				</VStack>
				{
					acceptingApplications && !alreadyApplied && (
						<Button
							onClick={
								() => router.push({
									pathname: '/explore_grants/apply',
									query: {
										account: true,
										grantId: grantID,
										chainId,
									},
								})
							}
							mt={10}
							variant='primary'
						>
							Apply for Grant
						</Button>
					)
				}
				{
					acceptingApplications && alreadyApplied && (
						<Button
							mt={10}
							variant='primary'
							isDisabled={true}
						>
							Already applied!
						</Button>
					)
				}
				{
					acceptingApplications && alreadyApplied && (
						<Text
							mt={2}
							color='#717A7C'
							textAlign='center'
							fontWeight='400'
							fontSize='12px'
							lineHeight='16px'
							mb={3}
						>
							You’ve already applied. View details
							{' '}
							<a href='../../your_applications'>
								<u>
									<b>
										here
									</b>
								</u>
							</a>
							{' '}
							.

						</Text>
					)
				}
				{
					acceptingApplications && !alreadyApplied && (
						<Text
							mt={2}
							color='#717A7C'
							textAlign='center'
							fontWeight='400'
							fontSize='12px'
							lineHeight='16px'
							mb={3}
						>
							Before applying, please ensure you read the grant details, and understand every details
							around it.
						</Text>
					)
				}
			</FloatingSidebar>
		</Box>
	)
}

export default Sidebar
