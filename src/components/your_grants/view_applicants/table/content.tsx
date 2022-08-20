import React, { ReactElement, useState } from 'react'
import {
	Box,
	Button,
	Flex,
	Heading,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	ModalBody,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
	Tooltip,
} from '@chakra-ui/react'
import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { ethers } from 'ethers'
import { MetaTransaction } from 'ethers-multisend'
import CopyIcon from 'src/components/ui/copy_icon'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import Modal from 'src/components/ui/modal'
import useApplicationMilestones from 'src/utils/queryUtil'
import { erc20ABI } from 'wagmi'
import {
	AssignedToReview, GrantApproved, GrantComplete, PendingReview, Rejected, ResubmissionRequested,
	ReviewDone,
} from '../states'
import { TableFilters } from './TableFilters'


const txServiceUrl = 'https://transaction-service.gnosis-safe-staging.celo-networks-dev.org'

const ERC20Interface = new ethers.utils.Interface(erc20ABI)

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
	isReviewer: boolean;
	reviewerData: any[];
	actorId: string;
}) {
	const tableHeadersFlex = [0.231, 0.20, 0.15, 0.13, 0.16, 0.25, 0.116, 0.1]
	const tableHeadersFlexReviewer = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116, 0.1]

	const [isAddToBatchModalOpen, setIsAddToBatchModalOpen] = useState(false)
	const [recipientAddress, setRecipientAddress] = useState('')
	const [fundAmount, setFundAmount] = useState('')
	const [selectedMilestone, setSelectedMilestone] = React.useState(-1)
	const [applicationID, setApplicationID] = useState<any>(data[0].applicationId)
	const [transactions, setTransactions] = useState<MetaTransaction[]>([])
	const [isAddToBatchButtonClicked, setIsAddToBatchButtonClicked] = useState(false)
	const [safeAddress, setSafeAddress] = useState('')
	const {
		data: {
			milestones, rewardAsset, rewardToken, fundingAsk, decimals,
		},
		refetch: refetchMilestones,
	} = useApplicationMilestones(applicationID)

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

	const createMultiTransaction = async(transactions: MetaTransaction[]) => {
		// const safeAddress = '0x7723d6CD277F0670fcB84eA8E9Efe14f1b16acBB'
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send('eth_requestAccounts', [])

		const signer = provider.getSigner()
		const ethAdapter = new EthersAdapter({
			ethers,
			signer,
		})

		const txServiceUrl = 'https://safe-transaction.rinkeby.gnosis.io/'
		const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
		const safeFactory = await SafeFactory.create({ ethAdapter })
		const safeSdk = await Safe.create({ ethAdapter, safeAddress })

		try {
			const safeTransaction = await safeSdk.createTransaction(transactions)

			console.log(safeTransaction)

			const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
			const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
			console.log(signer.getAddress())
			const txhash = await safeService.proposeTransaction({
				safeAddress,
				safeTransactionData: safeTransaction.data,
				safeTxHash,
				senderAddress: await signer.getAddress(),
				senderSignature: senderSignature.data,
				origin
			})

		} catch(e) {
			console.log(e)
		}

	}

	function setToDefaultValues() {
		setFundAmount('')
		setRecipientAddress('')
		setSelectedMilestone(-1)
		// setIsAddToBatchButtonClicked(false)
	}

	const addToBatch = () => {
		const txData = ERC20Interface.encodeFunctionData('transfer', [
			recipientAddress,
			ethers.utils.parseUnits(fundAmount, decimals)
		])

		const tx = {
			to: ethers.utils.getAddress(rewardAsset),
			data: txData,
			value: '0'
		}

		console.log('Encoded Tx', tx)
		if(!transactions) {
			setTransactions([tx])
		} else {
			setTransactions([...transactions, tx])
		}

		setToDefaultValues()
	}

	const executeTransaction = () => {
		createMultiTransaction(transactions)
	}

	return (
		<>
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
								<Button 
								width='max-content'
								mx={2}
									variant='primaryCta'
									onClick={
										() => {
											setIsAddToBatchModalOpen(true)
											setIsAddToBatchButtonClicked(false)
											setApplicationID(item.applicationId)
											console.log('application id', item.applicationId)
										}
									}>
									Add to batch
								</Button>
							</Flex>
						)))
				}

				<Modal
					title='Add Recipient Details'
					isOpen={isAddToBatchModalOpen}
					onClose={() => setIsAddToBatchModalOpen(false)}>
					<ModalBody>
						<Flex
							display='flex'
							flexDirection='column'>
							<Box my={4}>
								<SingleLineInput
									label='Enter recipient address'
									placeholder='0x89dHVf84'
									value={recipientAddress}
									onChange={(e) => setRecipientAddress(e.target.value)} />
							</Box>
							<Heading
								variant="applicationHeading"
								color="#122224">
								Milestone
							</Heading>
							<Menu>
								<MenuButton
									w="100%"
									as={Button}
									color="#122224"
									background="#E8E9E9"
									_disabled={{ color: '#A0A7A7', background: '#F3F4F4' }}
									rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
									textAlign="left"
								>
									<Text
										variant="applicationText"
										color={selectedMilestone === -1 ? '#717A7C' : '#122224'}
									>
										{
											selectedMilestone === -1
												? 'Select a milestone'
												: `Milestone ${selectedMilestone + 1}: ${milestones[selectedMilestone].title
												}`
										}
									</Text>
								</MenuButton>
								<MenuList>
									{
										milestones.map((milestone, index) => (
											<MenuItem
												key={milestone.id}
												onClick={() => setSelectedMilestone(index)}>
												Milestone
												{' '}
												{index + 1}
												{': '}
												{milestone.title}
											</MenuItem>
										))
									}
								</MenuList>
							</Menu>
							<Box my={4}>
								<SingleLineInput
									label='Enter Amount to be disbursed'
									placeholder='1000'
									value={fundAmount}
									onChange={(e) => setFundAmount(e.target.value)} />
							</Box>

							<Button
								my={6}
								variant='primaryCta'
								onClick={
									() => {
										addToBatch()
										setIsAddToBatchButtonClicked(true)
									}
								}>
								{!isAddToBatchButtonClicked ? 'Add to batch' : 'Added'}
							</Button>
						</Flex>
					</ModalBody>
				</Modal>

			</Flex>
			<Box
				mt={6}
				width='50%'>
				<SingleLineInput
					label='Enter your safe address'
					placeholder='0x230fb4c4d462eEF9e6790337Cf57271E519bB697'
					value={safeAddress}
					onChange={
						(e) => {
							const safeAddr = e.target.value
							if(safeAddr.includes(':')) {
								setSafeAddress(safeAddr.split(':')[1])
							} else {
								setSafeAddress(e.target.value)
							}
						}
					} />
			</Box>
			<Button
				mt={6}
				variant='primaryCta'
				height={12}
				onClick={executeTransaction}>
				Execute Transaction
			</Button>
		</>
	)
}

Content.defaultProps = {
	onViewApplicationFormClick: () => { },
	// onAcceptApplicationClick: () => {},
	// onRejectApplicationClick: () => {},
	onManageApplicationClick: () => { },
}
export default Content
