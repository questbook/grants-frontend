import React from 'react'
import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'

interface Props {
	numberOfApplicants: number;
	totalDisbursed: number;
	numberOfReviews: number;
}

function GrantStatsBox({ numberOfApplicants, totalDisbursed, numberOfReviews }: Props) {

	return (
		<Flex
			direction="column"
			mb="10"
			maxW='100%'
		>
			<Box
				box-sizing="border-box"
				border="1px solid #D2D2E3"
				borderRadius="4px"
				maxW='100%'
			>
				<Flex maxW='100%'>
					<Box
						flex="1"
						border="1px solid #D2D2E3"
						h="152px"
					>
						<VStack
							align="left"
							spacing={4}
							mt={5}
							ml={5}
						>
							<Image
								src="/ui_icons/applicants_total.svg"
								h="24.5px"
								w="19px" />

							<Text variant="ApplicantsStatsMajor">
								{numberOfApplicants}
							</Text>

							<Text variant="ApplicantsStatsMinor">
								Total Applicants
							</Text>
						</VStack>
					</Box>
					<Box
						flex="1"
						border="1px solid #D2D2E3"
						h="152px">
						<VStack
							align="left"
							spacing={4}
							mt={5}
							ml={5}>
							<Image
								src="/ui_icons/review.svg"
								h="24.5px"
								w="19px" />

							<Text variant="ApplicantsStatsMajor">
								{numberOfReviews}
							</Text>
							<Text variant="ApplicantsStatsMinor">
								Reviews
							</Text>
						</VStack>
					</Box>
					<Box
						flex="1"
						border="1px solid #D2D2E3"
						h="152px">
						<VStack
							align="left"
							spacing={4}
							mt={5}
							ml={5}
						>
							<Image
								src="/ui_icons/dollar_icon.svg"
								h="24.5px"
								w="19px" />

							<Text variant="ApplicantsStatsMajor">
								${totalDisbursed}
							</Text>

							<Text variant="ApplicantsStatsMinor">
								Disbursed
							</Text>
						</VStack>
					</Box>
				</Flex>
			</Box>
		</Flex>
	)
}

export default GrantStatsBox
