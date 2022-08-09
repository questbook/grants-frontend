import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

function DaoStatBoard({
	totalApplicants,
	uniqueApplicants,
	repeatApplicants,
	winnerApplicants,
	tat,
}: {
  totalApplicants: number;
  uniqueApplicants: number;
  repeatApplicants: number;
  winnerApplicants: number;
	tat: number;
}) {
	return (
		<>
			{
				totalApplicants <= 0 ? (
					<>
						<Flex
							mt="5"
							width="1040px"
							height="84px"
							background="#FFFFFF"
							boxShadow="0px 0px 8px rgba(18, 34, 36, 0.15)"
							borderRadius="8px"
							display="flex"
						>
							<Flex
								margin="5"
								display="flex"
								gap="60px">
								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px"
											color="#AAAAAA"
										>
                    --
										</Text>
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  Total Applicants
									</Text>
								</Flex>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px"
											color="#AAAAAA"
										>
                    --
										</Text>
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  Unique Applicants
									</Text>
								</Flex>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px"
											color="#AAAAAA"
										>
                    --
										</Text>
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  Repeats Applicants
									</Text>
								</Flex>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px"
											color="#AAAAAA"
										>
                    --
										</Text>
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  Grant winners
									</Text>
								</Flex>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px"
											color="#AAAAAA"
										>
                    --
										</Text>
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  TAT for disburdal
									</Text>
								</Flex>
							</Flex>
						</Flex>
					</>
				) : (
					<>
						<Flex
							mt="5"
							width="1040px"
							height="84px"
							background="#FFFFFF"
							boxShadow="0px 0px 8px rgba(18, 34, 36, 0.15)"
							borderRadius="8px"
							display="flex"
						>
							<Flex
								margin="5"
								display="flex"
								gap="60px">
								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px">
											{totalApplicants}
										</Text>
										{/* <Text
											fontWeight="400"
											fontSize="14px"
											lineHeight="24px"
											color="#00AD84"
											ml="10px"
										>
                    +40%
										</Text> */}
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  Total Applicants
									</Text>
								</Flex>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px">
											{uniqueApplicants}
										</Text>
										{/* <Text
											fontWeight="400"
											fontSize="14px"
											lineHeight="24px"
											color="#EE7979"
											ml="10px"
										>
                    -4%
										</Text> */}
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  Unique Applicants
									</Text>
								</Flex>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px">
											{repeatApplicants}
										</Text>
										{/* <Text
											fontWeight="400"
											fontSize="14px"
											lineHeight="24px"
											color="#00AD84"
											ml="10px"
										>
                    +7%
										</Text> */}
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  Repeats Applicants
									</Text>
								</Flex>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px">
											{winnerApplicants}
										</Text>
										{/* <Text
											fontWeight="400"
											fontSize="14px"
											lineHeight="24px"
											color="#00AD84"
											ml="10px"
										>
                    +7%
										</Text> */}
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  Grant winners
									</Text>
								</Flex>

								<Flex
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
								>
									<Flex>
										<Text
											fontWeight={700}
											fontSize="20px"
											lineHeight="24px">
											{Math.floor(tat) === NaN ? 0 : Math.floor(tat)}
											{' '}
minutes
										</Text>
										{/* <Text
											fontWeight="400"
											fontSize="14px"
											lineHeight="24px"
											color="#00AD84"
											ml="10px"
										>
                    +7%
										</Text> */}
									</Flex>

									<Text
										fontSize="16px"
										color="#AAAAAA"
										fontWeight="400"
										lineHeight="24px"
									>
                  TAT for disburdal
									</Text>
								</Flex>
							</Flex>
						</Flex>
					</>
				)
			}
		</>
	)
}

export default DaoStatBoard
