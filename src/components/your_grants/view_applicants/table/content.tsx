import React, { ReactElement } from 'react'
import { Box, Button, Flex, Image, Text, Tooltip } from '@chakra-ui/react'
import CopyIcon from 'src/components/ui/copy_icon'
import {
	AssignedToReview,
	GrantApproved,
	GrantComplete,
	PendingReview,
	Rejected,
	ResubmissionRequested,
	ReviewDone,
} from '../states'
import { TableFilters } from './TableFilters'

function Content({
	filter,
	applicationsStatus,
	isEvaluationSet,
	onViewApplicationFormClick,
	// onAcceptApplicationClick,
	// onRejectApplicationClick,
	onManageApplicationClick,
	data,
	isReviewer,
	reviewerData,
	actorId,
}: {
  filter: number;
  applicationsStatus: string;
  isEvaluationSet: boolean;
  onViewApplicationFormClick?: (data?: any) => void;
  // onAcceptApplicationClick?: () => void;
  // onRejectApplicationClick?: () => void;
  onManageApplicationClick?: (data?: any) => void;
  data: any[];
  isReviewer: boolean;
  reviewerData: any[];
  actorId: string;
}) {
	const tableHeadersFlex = [0.231, 0.2, 0.15, 0.13, 0.16, 0.25, 0.116]
	const tableHeadersFlexReviewer = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116]
	const tableHeadersFlexPendingForReview = [0.5, 0.2, 0.15, 0.13]
	const getStatus = (status: number): ReactElement => {
		if(status === TableFilters.submitted) {
			return <PendingReview />
		}

		if(status === TableFilters.resubmit) {
			return <ResubmissionRequested />
		}

		if(status === TableFilters.approved) {
			return <GrantApproved />
		}

		if(status === TableFilters.rejected) {
			return <Rejected />
		}

		if(status === TableFilters.assigned) {
			return <AssignedToReview />
		}

		return <GrantComplete />
	}

	// eslint-disable-next-line consistent-return
	const getStatusReviewer = (status: number) => {
		if(status === 0) {
			return <AssignedToReview />
		}

		if(status === 9) {
			return <ReviewDone />
		}
	}

	const statusEdit = (item: any) => {
		let ans = 0
		// eslint-disable-next-line array-callback-return
		item.reviewers.map((reviewer: any) => {
			if(reviewer.id === actorId && item.status === 0) {
				console.log('matched', reviewer.id)
				ans = 5
			}

			if(item.status !== 0) {
				ans = item.status
			}
		})
		return ans
	}

	return (
	// <Flex
	//   // mt="10px"
	//   direction="column"
	//   w="100%"
	//   border="1px #E0E0EC"
	//   borderRadius={4}
	//   align="stretch"
	// >
		<React.Fragment>
			{
				isReviewer ? (
					reviewerData
						.filter((item) => (filter === -1 ? true : filter === item.status))
						.map((item, index) => (
							<Flex
								key={item.id}
								direction="row"
								w="100%"
								justify="stretch"
								align="center"
								bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
								px={0}
								py={4}
							>
								<Flex
									direction="row"
									flex={tableHeadersFlexReviewer[0]}
									align="center"
								>
									<Tooltip label={item?.applicant_address}>
										<Text
											ml="19px"
											mr="-19px"
											variant="tableBody">
											{'     '}
											{
												`${item.applicant_address.substring(
													0,
													4
												)}...${item.applicant_address.substring(
													item.applicant_address.length - 4
												)}`
											}
										</Text>
									</Tooltip>
									<Box mr={8} />
									<CopyIcon text={item?.applicant_address} />
								</Flex>

								<Text
									flex={tableHeadersFlexReviewer[1]}
									color="#717A7C"
									variant="tableBody"
								>
									{item.sent_on}
								</Text>
								<Text
									textAlign="left"
									flex={tableHeadersFlexReviewer[2]}
									variant="tableBody"
									fontWeight="400"
								>
									{item.project_name}
								</Text>
								<Flex
									flex={tableHeadersFlexReviewer[3]}
									direction="row"
									justifyContent="center"
									alignItems="center"
								>
									<Image
										h={5}
										w={5}
										src={item.funding_asked.icon} />
									<Box mr={3} />
									<Text
										whiteSpace="nowrap"
										color="brand.500"
										fontSize="14px"
										lineHeight="16px"
										fontWeight="700"
										letterSpacing={0.5}
									>
										{item.funding_asked.amount}
										{' '}
										{item.funding_asked.symbol}
									</Text>
								</Flex>
								<Flex
									justifyContent="center"
									flex={tableHeadersFlexReviewer[4]}>
									{getStatusReviewer(item.status)}
								</Flex>
								<Flex
									display="flex"
									flexDirection="column"
									alignItems="center"
									flex={tableHeadersFlexReviewer[5]}
								>
									<Button
										variant="outline"
										color="brand.500"
										fontWeight="500"
										fontSize="14px"
										lineHeight="14px"
										textAlign="center"
										borderRadius={8}
										borderColor="brand.500"
										_focus={{}}
										p={0}
										minW={0}
										w="88px"
										h="32px"
										onClick={
											() => {
												//               if (status === 0) return <PendingReview />;
												// if (status === 1) return <ResubmissionRequested />;
												// if (status === 2) return <GrantApproved />;
												// if (status === 3) return <Rejected />;
												// return <GrantComplete />;
												if(
													(item.status === 2 || item.status === 4) &&
                      onManageApplicationClick
												) {
													onManageApplicationClick({
														applicationId: item.applicationId,
													})
													return
												}

												if(onViewApplicationFormClick) {
													if(item.status === 3) {
														onViewApplicationFormClick({
															rejectionComment: 'rejectionComment',
															applicationId: item.applicationId,
														})
													} else if(item.status === 1) {
														onViewApplicationFormClick({
															resubmissionComment: 'resubmissionComment',
															applicationId: item.applicationId,
														})
													} else if(item.status === 0) {
														onViewApplicationFormClick({
															applicationId: item.applicationId,
														})
													} else if(item.status === 9) {
														onViewApplicationFormClick({
															applicationId: item.applicationId,
														})
													}
												}
											}
										}
									>
                  View
									</Button>
								</Flex>
							</Flex>
						))
				) : !isEvaluationSet ? (
					data
						.filter((item) => (filter === -1 ? true : filter === item.status))
						.map((item, index) => (
							<Flex
								key={item.id}
								direction="row"
								w="100%"
								h="64px"
								justify="stretch"
								align="center"
								bg="#FFFFFF"
								px={0}
							//   py={4}
							>
								<Box
									h="60px"
									flex={tableHeadersFlexPendingForReview[0]}
									alignItems="center"
									border="1px"
									borderColor="#E0E0EC"
								>
									<Box
										h="40px"
										w="40px"
										ml="5">
										<Image
											w="38px"
											h="38px"
											borderRadius="22.1667px"
											src="/ui_icons/generic_dao_member.svg"
										/>
									</Box>
									<Text
										color="#1F1F33"
										fontSize="14px"
										lineHeight="20px"
										fontWeight="500"
										textAlign="left"
									>
										{item.project_name}
									</Text>
								</Box>

			  <Box
									h="60px"
									flex={tableHeadersFlexPendingForReview[1]}
									alignItems="center"
									border="1px"
									borderColor="#E0E0EC"
								>
									<Text
										color="#AFAFCC"
										fontSize="14px"
										lineHeight="20px"
										fontWeight="500"
										textAlign="center"
									>
                Add Status
									</Text>
			  </Box>

			  <Box
									h="60px"
									flex={tableHeadersFlexPendingForReview[2]}
									alignItems="center"
									border="1px"
									borderColor="#E0E0EC"
								>
									<Text
										color="#1F1F33"
										fontSize="14px"
										lineHeight="20px"
										fontWeight="500"
										textAlign="center"
									>
                --
									</Text>
			  </Box>
			  <Box
									h="60px"
									flex={tableHeadersFlexPendingForReview[3]}
									alignItems="center"
									border="1px"
									borderColor="#E0E0EC"
								>
									<Text
										color="#1F1F33"
										fontSize="14px"
										lineHeight="20px"
										fontWeight="500"
										textAlign="center"
									>
                --
									</Text>
			  </Box>
							</Flex>
						))
				) : applicationsStatus === 'Accepted' ? (
					<Flex>
fill
						{' '}
					</Flex>
				) : applicationsStatus === 'Rejected' ? (
					<Flex>
fill
						{' '}
					</Flex>
				) : (
					<Flex>
fill
						{' '}
					</Flex>
				)
			}
		</React.Fragment>
	)
}

Content.defaultProps = {
	onViewApplicationFormClick: () => {},
	// onAcceptApplicationClick: () => {},
	// onRejectApplicationClick: () => {},
	onManageApplicationClick: () => {},
}
export default Content
