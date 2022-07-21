import React from 'react'
import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'

interface Props {
  numberOfApplicants: number;
  totalDisbursed: number;
}

function GrantStatsBox({ numberOfApplicants, totalDisbursed }: Props) {

	return (
		<Flex
			direction="column"
			mb="10px"
		>
			<Box
				box-sizing="border-box"
				border="1px solid #D2D2E3"
				borderRadius="4px"

			>
				<Flex>
					<Box
						flex="1"
						border="1px solid #D2D2E3"
						h="152px">
						<VStack
							align="center"
							spacing={4}>
							<Image
								src="/ui_icons/applicants_total.svg"
								h="24.5px"
								w="19px" />

							<Text>
								{numberOfApplicants}
							</Text>

							<Text>
Total Applicants
							</Text>
						</VStack>
					</Box>
					<Box
						flex="1"
						border="1px solid #D2D2E3"
						h="152px">
						<VStack
							align="center"
							spacing={4}>
							<Image
								src="/ui_icons/review.svg"
								h="24.5px"
								w="19px" />

							<Text>
0
							</Text>
							<Text>
Reviews
							</Text>
						</VStack>
					</Box>
					<Box
						flex="1"
						border="1px solid #D2D2E3"
						h="152px">
						<VStack
							align="center"
							spacing={4}>
							<Image
								src="/ui_icons/dollar_icon.svg"
								h="24.5px"
								w="19px" />

							<Text>
								{totalDisbursed}
							</Text>

							<Text>
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
