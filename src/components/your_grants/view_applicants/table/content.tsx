import React, { ReactElement } from 'react'
import {
	Box,
	Button,
	Flex,
	Heading,
	Image,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
	Tooltip,
} from '@chakra-ui/react'
import CopyIcon from 'src/components/ui/copy_icon'
import {
	AssignedToReview, GrantApproved, GrantComplete, PendingReview, Rejected, ResubmissionRequested,
	ReviewDone,
} from '../states'
import { TableFilters } from './TableFilters'

function Content({
	filter,
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
  onViewApplicationFormClick?: (data?: any) => void;
  // onAcceptApplicationClick?: () => void;
  // onRejectApplicationClick?: () => void;
  onManageApplicationClick?: (data?: any) => void;
  data: any[];
  isReviewer : boolean;
  reviewerData:any [];
  actorId: string;
}) {
	const tableHeadersFlex = [0.231, 0.20, 0.15, 0.13, 0.16, 0.25, 0.116]
	const tableHeadersFlexReviewer = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116]
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

	const statusEdit = (item:any) => {
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
		<Flex
			mt="10px"
			direction="column"
			w="100%"
			border="1px solid #D0D3D3"
			borderRadius={4}
			align="stretch"
		>
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
									align="center">
									<Tooltip label={item?.applicant_address}>
										<Text
											ml="19px"
											mr="-19px"
											variant="tableBody"
										>
											{'     '}
											{`${item.applicant_address.substring(0, 4)}...${item.applicant_address.substring(item.applicant_address.length - 4)}`}
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
												if((item.status === 2 || item.status === 4) && onManageApplicationClick) {
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
														onViewApplicationFormClick({ applicationId: item.applicationId })
													} else if(item.status === 9) {
														onViewApplicationFormClick({ applicationId: item.applicationId })
													}
												}
											}
										}
									>
                  View
									</Button>
									{/* <Actions
                status={item.status}
                onViewApplicationFormClick={() => {
                  if (item.status === 0 && onManageApplicationClick) {
                    onManageApplicationClick({
                      applicationId: item.applicationId,
                    });
                    return;
                  }
                  if (onViewApplicationFormClick) {
                    if (item.status === 1) {
                      onViewApplicationFormClick({
                        rejectionComment: 'rejectionComment',
                        applicationId: item.applicationId,
                      });
                    } else if (item.status === 2) {
                      onViewApplicationFormClick({
                        resubmissionComment: 'resubmissionComment',
                        applicationId: item.applicationId,
                      });
                    } else {
                      onViewApplicationFormClick({ applicationId: item.applicationId });
                    }
                  }
                }}
                onAcceptApplicationClick={onAcceptApplicationClick}
                onRejectApplicationClick={onRejectApplicationClick}
              /> */}
								</Flex>
							</Flex>
						))
				) : (data
					.filter((item) => (filter === -1 ? true : filter === item.status))
					.map((item, index) => (
						<Flex
							key={index}
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
								flex={tableHeadersFlex[0]}
								align="center">
								<Tooltip label={item?.applicant_address}>
									<Text
										ml="19px"
										mr="-19px"
										variant="tableBody"
									>
										{'     '}
										{`${item.applicant_address.substring(0, 4)}...${item.applicant_address.substring(item.applicant_address.length - 4)}`}
									</Text>
								</Tooltip>
								<Box mr={8} />
								<CopyIcon text={item?.applicant_address} />
							</Flex>

							<Text
								flex={tableHeadersFlex[1]}
								color="#122224"
								variant="tableBody"
							>
								{item.project_name}
							</Text>
							<Flex
								flex={tableHeadersFlex[2]}
								direction="row"
								justifyContent="left"
								alignItems="left"
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
									letterSpacing={0.2}
								>
									{item.amount_paid}
									{' '}
                /
									{' '}
									{item.funding_asked.amount}
									{' '}
									{item.funding_asked.symbol}
								</Text>
							</Flex>
							<Flex
								justifyContent="center"
								flex={tableHeadersFlex[3]}>

								<Popover
									closeOnBlur
									isLazy
									placement="right"
								>

									<PopoverTrigger>

										<Text
											color="#717A7C"
											variant="tableBody"
											textAlign="center"
											textDecoration="underline"
											textDecorationColor="#717A7C"
										>
											{item.reviewers.length}

										</Text>

									</PopoverTrigger>
									<PopoverContent
										height="140px"
										width="inherit"
										right="-3px"
										top="70px">
										<Heading
											margin="10px"
											line-height="16px"
											color="#717A7C"
											fontFamily="DM Sans"
											size="sm">
REVIEWERS
										</Heading>
										<PopoverBody
											overflowX="hidden"
											overflowY="scroll"
											scrollBehavior="smooth">
											{
												item.reviewers.map((reviewer: { email: string }) => (
													<Flex
														key={reviewer.email}
														direction="column">
														<Text
															mt="2"
														>
															{reviewer.email}
														</Text>
													</Flex>
												))
											}
										</PopoverBody>

									</PopoverContent>
								</Popover>

							</Flex>

							<Flex
								justifyContent="center"
								flex={tableHeadersFlex[4]}>
								{statusEdit(item) ? getStatus(statusEdit(item)) : getStatus(item.status)}
							</Flex>

							<Flex
								justifyContent="center"
								color="#717A7C"
								flex={tableHeadersFlex[5]}>
								{item.status === 0 ? item.sent_on : item.updated_on}
							</Flex>
							<Flex
								display="flex"
								flexDirection="column"
								alignItems="center"
								flex={tableHeadersFlex[6]}
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
											if((item.status === 2 || item.status === 4) && onManageApplicationClick) {
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
													onViewApplicationFormClick({ applicationId: item.applicationId })
												}
											}
										}
									}
								>
                View
								</Button>
								{/* <Actions
                status={item.status}
                onViewApplicationFormClick={() => {
                  if (item.status === 0 && onManageApplicationClick) {
                    onManageApplicationClick({
                      applicationId: item.applicationId,
                    });
                    return;
                  }
                  if (onViewApplicationFormClick) {
                    if (item.status === 1) {
                      onViewApplicationFormClick({
                        rejectionComment: 'rejectionComment',
                        applicationId: item.applicationId,
                      });
                    } else if (item.status === 2) {
                      onViewApplicationFormClick({
                        resubmissionComment: 'resubmissionComment',
                        applicationId: item.applicationId,
                      });
                    } else {
                      onViewApplicationFormClick({ applicationId: item.applicationId });
                    }
                  }
                }}
                onAcceptApplicationClick={onAcceptApplicationClick}
                onRejectApplicationClick={onRejectApplicationClick}
              /> */}
							</Flex>
						</Flex>
					)))
			}
		</Flex>
	)
}

Content.defaultProps = {
	onViewApplicationFormClick: () => {},
	// onAcceptApplicationClick: () => {},
	// onRejectApplicationClick: () => {},
	onManageApplicationClick: () => {},
}
export default Content
