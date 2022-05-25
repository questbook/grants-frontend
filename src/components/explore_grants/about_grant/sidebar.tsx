import React from 'react'
import {
	Box, Button, Text,
	VStack, } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SupportedChainId } from 'src/constants/chains'
import FloatingSidebar from '../../ui/sidebar/floatingSidebar2'
import Tooltip from '../../ui/tooltip'

interface Props {
  grantRequiredFields: any[];
  grantID: string;
  chainId: SupportedChainId | undefined;
  acceptingApplications: boolean;
  alreadyApplied: boolean;
}

function Sidebar({
	grantRequiredFields, grantID, chainId, acceptingApplications, alreadyApplied,
}: Props) {
	const router = useRouter()
	return (
		<Box my="71px">
			<FloatingSidebar>
				<Text
					variant="heading"
					fontSize="18px"
					lineHeight="26px"
					mt={3}>
          Requisite for Application
				</Text>
				<VStack
					alignItems="stretch"
					mt={10}
					p={0}
					spacing={4}>
					{
						grantRequiredFields?.map(({ detail, tooltip }) => {
							if(!detail) {
								return null
							}

							return (
								<Text
									fontWeight="400"
									fontSize="16px"
									lineHeight="20px"
									key={`grant-required-field-${detail}`}
								>
									{detail}
									{
										tooltip?.length ? (
											<Tooltip
												icon="/ui_icons/tooltip_grey.svg"
												label={tooltip} />
										) : null
									}
								</Text>
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
							variant="primary"
						>
          Apply for Grant
						</Button>
					)
				}
				{
					acceptingApplications && alreadyApplied && (
						<Button
							mt={10}
							variant="primary"
						>
          Already applied!
						</Button>
					)
				}
				{
					acceptingApplications && !alreadyApplied && (
						<Text
							mt={2}
							color="#717A7C"
							textAlign="center"
							fontWeight="400"
							fontSize="12px"
							lineHeight="16px"
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
