import React, { useContext } from 'react'
import {
	Box,
	Button,
	Flex,
	Grid,
	IconButton,
	Image,
	Link,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react'
import { utils } from 'ethers'
import router from 'next/router'
import { CHAIN_INFO } from 'src/constants/chainInfo'
import { DefaultSupportedChainId } from 'src/constants/chains'
import { useGetDaoGrantsQuery, useGetFundSentforReviewsQuery } from 'src/generated/graphql'
// TOOLS AND UTILS
import {
	getFormattedDateFromUnixTimestampWithYear,
	trimAddress,
} from 'src/utils/formattingUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
// CONTEXT AND CONSTANTS
import { ApiClientsContext } from '../../../pages/_app'
// UI COMPONENTS
import CopyIcon from '../ui/copy_icon'
import Modal from '../ui/modal'
import PayoutModalContent from './payoutModalContent'

function Payouts() {
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!
	const [workspaceChainId, setWorkspaceChainId] = React.useState<number>()
	const [applications, setApplications] = React.useState<any>([])
	const [outstandingReviews, setOutstandingReviews] = React.useState<any>([])
	const [reviewers, setReviewers] = React.useState<any>([])
	const [reviewPayoutsDone, setReviewPayoutsDone] = React.useState<any>([])

	React.useEffect(() => {
		setWorkspaceChainId(getSupportedChainIdFromWorkspace(workspace))
	}, [workspace])

	const { data: grantsData } = useGetDaoGrantsQuery({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? DefaultSupportedChainId
      ].client,
		variables: {
			workspaceId: workspace?.id ?? '',
		},
	})

	const { data: reviewsData } = useGetFundSentforReviewsQuery({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? DefaultSupportedChainId
      ].client,
	})

	const payModal = useDisclosure()
	const [payMode, setPayMode] = React.useState<number>(-1)
	const [selectedData, setSelectedData] = React.useState<any>()
	const [paymentOutside, setPaymentOutside] = React.useState<boolean>(false)

	const [tabIndex, setTabIndex] = React.useState<number>(0)

	const payOptions = ['Pay from connected wallet', 'Pay from another wallet']

	const tableHeaders = [
		'Member Email',
		'Member Address',
		'Last Review On',
		'Outstanding Payout',
		'Actions',
	]
	const historyTableHeaders = [
		'Member Address',
		'Paid from',
		'Amount',
		'Paid on',
		'Actions',
	]

	const handleEmptyEmail = (email?: string) => {
		if(email) {
			return email
		}

		return '-'
	}

	React.useEffect(() => {
		if(!workspace) {
			router.push('/')
		}
	})

	React.useEffect(() => {
		if(applications.length === 0 && grantsData) {
      grantsData!.grants.forEach(
      	(grant: any) => grant.applications.forEach((app: any) => app.reviewers.length !== 0
          && setApplications((array: any) => [...array, app])),
      )
		}

		if(applications.length !== 0 && reviewers.length === 0) {
			const revs: any = []
			applications.forEach(
				(app: any) => app.reviewers.length !== 0
            && app.reviewers.forEach((reviewer: any) => {
            	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
            	!reviewers.includes(reviewer.actorId)
            && revs.push(reviewer)
            }),
			)

			setReviewers(new Set(revs))
		}

		if(reviewers.length !== 0 && outstandingReviews.length === 0) {
			reviewers.forEach((reviewer: any) => reviewer.outstandingReviewIds.length !== 0
			// eslint-disable-next-line max-len
        && reviewer.outstandingReviewIds.forEach((id: any) => setOutstandingReviews((array: any) => [...array, id])))
		}
	}, [grantsData, applications, reviewers, outstandingReviews])

	React.useEffect(() => {
		if(reviewPayoutsDone.length === 0 && reviewsData) {
      reviewsData!.fundsTransfers.forEach(
      	(review: any) => setReviewPayoutsDone((array: any) => [...array, review]),
      )
		}
	})

	React.useEffect(() => {
		if(payMode === -1) {
			setPaymentOutside(false)
		}
	}, [payMode])

	return (
		<Flex
			direction="column"
			align="start"
			w="100%">
			<Flex
				direction="row"
				w="full"
				justify="space-between">
				<Text
					fontStyle="normal"
					fontWeight="bold"
					fontSize="18px"
					lineHeight="26px"
				>
          Manage Payouts
				</Text>
			</Flex>
			<Flex
				w="100%"
				mt={8}
				alignItems="flex-start"
				direction="column">
				<Tabs
					index={tabIndex}
					variant="soft-rounded"
					align="start"
					w="100%">
					<TabList>
						<Tab
							borderColor="#AAAAAA"
							color="#AAAAAA"
							_focus={
								{
									boxShadow: 'none',
									border: '1px solid',
									borderColor: '#8850EA',
								}
							}
							_active={
								{
									boxShadow: 'none',
									border: '1px solid',
									borderColor: '#8850EA',
								}
							}
							onClick={() => setTabIndex(0)}
						>
              Outstanding
							{' '}
							{
								outstandingReviews.length === 0
									? '(0)'
									: `(${new Set(outstandingReviews).size})`
							}
						</Tab>
						<Tab
							borderColor="#AAAAAA"
							color="#AAAAAA"
							_focus={
								{
									boxShadow: 'none',
									border: '1px solid',
									borderColor: '#8850EA',
								}
							}
							_active={
								{
									boxShadow: 'none',
									border: '1px solid',
									borderColor: '#8850EA',
								}
							}
							onClick={() => setTabIndex(1)}
						>
              History
						</Tab>
					</TabList>

					<TabPanels>
						<TabPanel>
							<Grid
								gridAutoFlow="column"
								gridTemplateColumns="repeat(5, 1fr)"
								w="100%"
								justifyItems="center"
								alignContent="center"
								py={4}
								px={5}
							>
								{' '}
								{
									tableHeaders.map((header) => (
										<Text
											key={header}
											w="fit-content"
											variant="tableHeader">
											{header}
										</Text>
									))
								}
							</Grid>
							<Flex
								direction="column"
								w="100%"
								border="1px solid #D0D3D3"
								borderRadius={4}
							>
								{
									outstandingReviews.length === 0
										? (
											<Flex
												p={2}
												alignItems="center"
												justifyContent="center">
												<Text>
There are no outstanding reviews to pay for
												</Text>
											</Flex>
										)
									// eslint-disable-next-line max-len
										: [...reviewers].map((reviewer: any, index: any) => reviewer.outstandingReviewIds.length !== 0
                          && (
                          	<Flex>
                          		<Grid
                          			gridAutoFlow="column"
                          			gridTemplateColumns="repeat(5, 1fr)"
                          			w="100%"
                          			justifyItems="center"
                          			alignContent="center"
                          			bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
                          			py={4}
                          			px={5}
                          		>
                          			<Text
                          				minW="fit-content"
                          				variant="tableBody"
                          				justifySelf="left"
                          				alignSelf="center"
                          			>
                          				{' '}
                          				{
                          					reviewer.email && reviewer.email.length > 16 ? (
                          					<Tooltip label={reviewer.email}>
                          						<Flex
                          							alignSelf="center"
                          							alignItems="center"
                          						>
                          							<Text
                          								alignSelf="center"
                          								textAlign="center"
                          								variant="tableBody"
                          							>
                          								{trimAddress(reviewer.email, 12)}
                          							</Text>
                          							<Box mr="7px" />
                          						</Flex>
                          					</Tooltip>
                          				) : (
                          					handleEmptyEmail(reviewer.email)
                          				)
                          				}
                          			</Text>
                          			<Tooltip label={reviewer.actorId}>
                          				<Flex alignItems="center">
                          					<Text
                          						textAlign="center"
                          						variant="tableBody"
                          					>
                          						{trimAddress(reviewer.actorId, 4)}
                          					</Text>
                          					<Box mr="7px" />
                          					<CopyIcon
                          						h="0.75rem"
                          						text={reviewer.actorId}
                          					/>
                          				</Flex>
                          			</Tooltip>
                          			<Text
                          				minW="fit-content"
                          				variant="tableBody"
                          				alignSelf="center"
                          			>
                          				{
                          					getFormattedDateFromUnixTimestampWithYear(
                          					reviewer.lastReviewSubmittedAt,
                          				)
                          				}
                          			</Text>
                          			<Text
                          				alignSelf="center"
                          				variant="tableBody">
                          				{reviewer.outstandingReviewIds.length}
                          			</Text>
                          			<Flex
                          				direction="row"
                          				gap="0.5rem">
                          				<Button
                          					variant="outline"
                          					color="brand.500"
                          					fontWeight="500"
                          					fontSize="14px"
                          					lineHeight="14px"
                          					textAlign="center"
                          					borderRadius={8}
                          					borderColor="brand.500"
                          					height="2rem"
                          					onClick={
                          						() => {
                          						payModal.onOpen()
                          							setPayMode(2)
                          							setSelectedData(reviewer)
                          						}
                          					}
                          				>
                                  Mark as done
                          				</Button>
                          				<Button
                          					variant="primary"
                          					fontWeight="500"
                          					fontSize="14px"
                          					lineHeight="14px"
                          					textAlign="center"
                          					height="2rem"
                          					px={3}
                          					onClick={
                          						() => {
                          						payModal.onOpen()
                          							setPayMode(-1)
                          							setSelectedData(reviewer)
                          						}
                          					}
                          				>
                                  Pay now
                          				</Button>
                          			</Flex>
                          		</Grid>

                          		<Modal
                          			isOpen={payModal.isOpen}
                          			onClose={payModal.onClose}
                          			title={
                          				`${
                          				// eslint-disable-next-line no-nested-ternary
                          				payMode === -1
                          					? 'Pay From'
                          				// eslint-disable-next-line no-nested-ternary
                          					: payMode === 0
                                                || (payMode === 1 && !paymentOutside)
                          						? 'Pay Reviewer'
                          					// eslint-disable-next-line no-nested-ternary
                          						: payMode === 2
                          							? 'Fill Payment Details'
                          						// eslint-disable-next-line no-nested-ternary
                          							: paymentOutside
                                                && payMode === 1
                                                && 'Pay from external wallet'
                          			}`
                          			}
                          			leftIcon={
                          				payMode !== -1 && (
                          					<IconButton
                          						mr="1rem"
                          						ml="-1rem"
                          						aria-label="Back"
                          						variant="ghost"
                          						_hover={{}}
                          						_active={{}}
                          						icon={<Image src="/ui_icons/black/chevron_left.svg" />}
                          						onClick={
                          							() => {
                          							setPayMode(-1)
                          								setPaymentOutside(false)
                          							}
                          						}
                          						_focus={{ boxShadow: 'none' }}
                          					/>
                          				)
                          			}
                          		>
                          			<Flex
                          				direction="column"
                          				pb="1rem"
                          				mx="2rem">
                          				{
                          					payMode === -1 && (
                          						<Text pt="1rem">
													Select a wallet to process this transaction
                          						</Text>
                          					)
                          				}
                          				{
                          					payMode === -1
                          					? payOptions.map((option, ind) => (
                          						<Button
												  	key={option}
                          							border="1px solid"
                          							borderColor="#6A4CFF"
                          							borderRadius="0.5rem"
                          							bgColor="rgba(149, 128, 255, 0.1)"
                          							onClick={
                          									() => {
                          								setPayMode(ind)
                          									}
                          								}
                          							p="1.5rem"
                          							h="4.5rem"
                          							mt="2rem"
                          						>
                          							<Flex
                          								w="100%"
                          								justify="space-between"
                          								align="center"
                          							>
                          								<Flex>
                          									<Text
                          										variant="tableBody"
                          										color="#8850EA"
                          									>
                          										{option}
                          										{' '}
                          									</Text>
                          									<Tooltip
                          										label={
                          												`${
                          											ind === 0
                          												? 'The reward will go through our smart contract directly into the reviewer wallet'
                          												: 'You will have to send the reviewer rewards separately'
                          										}`
                          											}
                          										fontSize="md"
                          									>
                          										<Image
                          											ml={2}
                          											display="inline-block"
                          											alt="another_wallet"
                          											src="/ui_icons/info_brand_light.svg"
                          											color="#8850EA"
                          										/>
                          									</Tooltip>
                          								</Flex>
                          								<IconButton
                          									aria-label="right_chevron"
                          									variant="ghost"
                          									_hover={{}}
                          									_active={{}}
                          									w="13px"
                          									h="6px"
                          									icon={<Image src="/ui_icons/brand/chevron_right.svg" />}
                          									onClick={
                          											() => {
                          										setPayMode(ind)
                          											}
                          										}
                          								/>
                          							</Flex>
                          						</Button>
                          					))
                          					: null
                          				}
                          			</Flex>

                          			<PayoutModalContent
                          				workspaceId={workspace!.id}
                          				applications={applications}
                          				reviewIds={selectedData?.outstandingReviewIds}
                          				payMode={payMode}
                          				setPayMode={setPayMode}
                          				reviewerAddress={selectedData?.actorId}
                          				reviews={selectedData?.outstandingReviewIds.length}
                          				onClose={payModal.onClose}
                          				paymentOutside={paymentOutside}
                          				setPaymentOutside={setPaymentOutside}
                          				setTabIndex={setTabIndex}
                          			/>
                          		</Modal>
                          	</Flex>
                          ))
								}
							</Flex>
						</TabPanel>
						<TabPanel>
							<Grid
								gridAutoFlow="column"
								gridTemplateColumns="repeat(4, 1fr)"
								w="100%"
								justifyItems="center"
								alignContent="center"
								py={4}
								px={5}
							>
								{' '}
								{
									historyTableHeaders.map((header) => (
										<Text
											key={header}
											w="fit-content"
											variant="tableHeader">
											{header}
										</Text>
									))
								}
							</Grid>
							<Flex
								direction="column"
								w="100%"
								border="1px solid #D0D3D3"
								borderRadius={4}
							>
								{
									reviewPayoutsDone.length === 0
										? (
											<Flex
												p={2}
												alignItems="center"
												justifyContent="center">
												<Text>
There is no payout history to show
												</Text>
											</Flex>
										)
										: reviewPayoutsDone.map((data: any, index: number) => (
											<Flex key={data.id}>
												<Grid
													gridAutoFlow="column"
													gridTemplateColumns="repeat(4, 1fr)"
													w="100%"
													justifyItems="center"
													alignContent="center"
													bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
													py={4}
													px={5}
												>
													<Tooltip label={data.to}>
														<Flex alignItems="center">
															<Text
																textAlign="center"
																variant="tableBody">
																{trimAddress(data.to, 4)}
															</Text>
															<Box mr="7px" />
															<CopyIcon
																h="0.75rem"
																text={data.to} />
														</Flex>
													</Tooltip>

													<Tooltip label={data.sender}>
														<Flex alignItems="center">
															<Text
																textAlign="center"
																variant="tableBody">
																{trimAddress(data.sender, 4)}
															</Text>
															<Box mr="7px" />
														</Flex>
													</Tooltip>

													<Text variant="tableBody">
														{utils.formatUnits(data.amount).slice(0, -2)}
														{' '}
														{
															getAssetInfo(
																data.asset,
																getSupportedChainIdFromWorkspace(workspace),
															).label
														}
													</Text>
													<Text variant="tableBody">
														{getFormattedDateFromUnixTimestampWithYear(data.createdAtS)}
													</Text>

													<Flex direction="row">
														<Link
															href={
																workspaceChainId ?
																	`${CHAIN_INFO[workspaceChainId]
																		.explorer.transactionHash}${data.id.substr(
																		0,
																		data.id.indexOf('.'),
																	)}`
																	: ''
															}
															isExternal
														>
                            View
															{' '}
															<Image
																display="inline-block"
																h="10px"
																w="10px"
																src="/ui_icons/link.svg"
															/>
														</Link>
													</Flex>
												</Grid>
											</Flex>
										))
								}
							</Flex>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Flex>
		</Flex>
	)
}

export default Payouts
