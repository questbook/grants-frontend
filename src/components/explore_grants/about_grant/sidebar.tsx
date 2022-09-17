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

import { useTranslation } from 'react-i18next'

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
	const { t } = useTranslation()
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
					{t('/explore_grants/about_grant.proposal_format')}
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
							{t('/explore_grants/about_grant.submit_proposal')}
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
							{t('/explore_grants/about_grant.already_submitted')}
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
							{t('/explore_grants/about_grant.already_submitted_desc')}
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
			</FloatingSidebar>
		</Box>
	)
}

export default Sidebar
