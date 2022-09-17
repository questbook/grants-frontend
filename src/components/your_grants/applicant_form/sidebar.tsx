import React, { useContext, useEffect, useState } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Flex,
	Heading,
	Image,
	Text,
	Tooltip,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import CopyIcon from 'src/components/ui/copy_icon'
import MailTo from 'src/components/your_grants/mail_to/mailTo'
import { CHAIN_INFO } from 'src/constants/chains'
import {
	getFieldString,
	getFormattedFullDateFromUnixTimestamp, getRewardAmount,
	truncateStringFromMiddle,
} from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ViewScoreDrawer from 'src/v2/payouts/ViewScoreDrawer/ViewScoreDrawer'

function Sidebar({
	onAcceptApplicationClick,
	onRejectApplicationClick,
	onResubmitApplicationClick,
	applicationData,
	isBiconomyInitialised,
}: {
  onAcceptApplicationClick: () => void
  onRejectApplicationClick: () => void
  onResubmitApplicationClick: () => void
  applicationData: any
  isBiconomyInitialised: boolean
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	const applicantEmail = getFieldString(applicationData, 'applicantEmail')
	const applicantAddress = getFieldString(applicationData, 'applicantAddress')

	// console.log('Applicant address: ', applicantAddress)

	// const [rubricDrawerOpen, setRubricDrawerOpen] = useState(false)
	// const [maximumPoints, setMaximumPoints] = React.useState(5)
	// const [rubricEditAllowed] = useState(true)
	// const [rubrics, setRubrics] = useState<any[]>([
	// 	{
	// 		name: '',
	// 		nameError: false,
	// 		description: '',
	// 		descriptionError: false,
	// 	},
	// ])

	// useEffect(() => {
	// 	if(!applicationData) {
	// 		return
	// 	}

	// 	const initialRubrics = applicationData?.grant.rubric
	// 	const newRubrics = [] as any[]
	// 	// console.log('initialRubrics', initialRubrics)
	// 	// console.log('application Data ', applicationData)
	// 	initialRubrics?.items.forEach((initalRubric: any) => {
	// 		newRubrics.push({
	// 			name: initalRubric.title,
	// 			nameError: false,
	// 			description: initalRubric.details,
	// 			descriptionError: false,
	// 		})
	// 	})
	// 	if(newRubrics.length === 0) {
	// 		return
	// 	}

	// 	setRubrics(newRubrics)
	// 	if(initialRubrics?.items[0].maximumPoints) {
	// 		setMaximumPoints(initialRubrics.items[0].maximumPoints)
	// 	}
	// }, [applicationData])

	const [reviews, setReviews] = useState<any>()
	const [selectedReview, setSelectedReview] = useState<any>()
	const [selectedReviewer, setSelectedReviewer] = useState<any>()
	const [scoreDrawerOpen, setScoreDrawerOpen] = useState(false)

	const getReview = async(hash: string) => {
		if(hash === '') {
			return {}
		}

		const d = await getFromIPFS(hash)
		try {
			const data = JSON.parse(d)
			return data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			// console.log('incorrect review', e)
			return {}
		}
	}

	const getReviews = async(reviews: any[]) => {
		const reviewsDataMap = {} as any
		const reviewsData = await Promise.all(reviews?.map(async(review) => {
			const data = await getReview(review?.publicReviewDataHash)
			return data
		}))

		reviewsData.forEach((review, i) => {
			const reviewerIdSplit = reviews[i]?.reviewer?.id.split('.')
			const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]
			reviewsDataMap[reviewerId] = {
				items: review?.items,
				createdAtS: reviews[i]?.createdAtS,
			}
		})

		// console.log('reviewsData', reviewsData)
		// console.log('reviewsData', reviewsDataMap)
		setReviews(reviewsDataMap)
	}

	useEffect(() => {
		// console.log('appl side', applicationData)
		if(applicationData?.reviews?.length) {
			getReviews(applicationData.reviews)
		}
	}, [applicationData])

	const totalScore = (items?: any[]) => {
		// console.log(items)
		let s = 0
		items?.forEach((item) => {
			s += item?.rating ?? 0
		})

		return s
	}

	let icon
	let label
	let decimals
	if(applicationData?.grant.reward.token) {
		icon = applicationData.grant.reward.token.iconHash
		label = applicationData.grant.reward.token.label
		decimals = applicationData.grant.reward.token.decimal
	} else {
		icon = getAssetInfo(applicationData?.grant?.reward?.asset, chainId)?.icon
		label = getAssetInfo(applicationData?.grant?.reward?.asset, chainId)?.label
		decimals = CHAIN_INFO[
			getSupportedChainIdFromSupportedNetwork(
				applicationData?.grant.workspace.supportedNetworks[0],
			)
		]?.supportedCurrencies[
			applicationData?.grant.reward.asset.toLowerCase()
		]?.decimals
	}

	return (
		<>
			<Flex
				bg='white'
				border='2px solid #D0D3D3'
				borderRadius={8}
				w={340}
				direction='column'
				alignItems='stretch'
				px='28px'
				py='22px'
			>
				<Heading
					fontSize='16px'
					fontWeight='400'
					color='#414E50'
					lineHeight='26px'
					fontStyle='normal'
				>
					Application Details
				</Heading>
				<Flex
					direction='row'
					justify='start'
					w='full'
					mt={6}
					align='center'>
					<Tooltip label={applicantAddress}>
						<Heading
							variant='applicationHeading'
							color='brand.500'>
							{truncateStringFromMiddle(applicantAddress)}
						</Heading>
					</Tooltip>
					<Box mr={4} />
					<CopyIcon text={applicantAddress} />
				</Flex>
				<Box my={2} />
				<Flex
					direction='row'
					justify='space-between'
					w='full'
					align='center'>
					<Text
						variant='applicationText'
						lineHeight='32px'>
						Name
					</Text>
					<Heading
						variant='applicationHeading'
						lineHeight='32px'>
						{getFieldString(applicationData, 'applicantName')}
					</Heading>
				</Flex>
				<Flex
					direction='row'
					justify='space-between'
					w='full'
					align='center'>
					<Text
						variant='applicationText'
						lineHeight='32px'>
						Email
					</Text>
					<Heading
						variant='applicationHeading'
						lineHeight='32px'>
						{
							applicantEmail && (
								<>
									{applicantEmail}
									<MailTo applicantEmail={applicantEmail} />
								</>
							)
						}
					</Heading>
				</Flex>
				<Flex
					direction='row'
					justify='space-between'
					w='full'
					align='center'>
					<Text
						variant='applicationText'
						lineHeight='32px'>
						Sent On
					</Text>
					<Heading
						variant='applicationHeading'
						lineHeight='32px'>
						{getFormattedFullDateFromUnixTimestamp(applicationData?.createdAtS)}
					</Heading>
				</Flex>
				<Flex>
					<Image
						h='45px'
						w='45px'
						my={10}
						src={icon}
					/>
					<Box w={5} />
					<Flex
						direction='column'
						w='full'
						align='start'
						mt={4}>
						<Box
							// variant="dashed"
							border='1px dashed #A0A7A7'
							h={0}
							w='100%'
							m={0}
						/>
						<Text
							fontSize='10px'
							mt={6}
							lineHeight='12px'>
							FUNDING REQUESTED
						</Text>
						<Text
							fontSize='20px'
							lineHeight='40px'
							fontWeight='500'
							fontStyle='normal'
							color='#122224'
						>
							{applicationData && getRewardAmount(decimals, applicationData)}
							{' '}
							{label}
						</Text>
						<Box
							// variant="dashed"
							border='1px dashed #A0A7A7'
							h={0}
							w='100%'
							mt='17px'
							mb={0}
						/>
					</Flex>
				</Flex>

				<Button
					disabled={!isBiconomyInitialised}
					onClick={() => onAcceptApplicationClick()}
					variant='primary'
					mt={7}
					display={applicationData?.state === 'submitted' ? '' : 'none'}
				>
					Approve Application
				</Button>
				<Button
					onClick={() => onAcceptApplicationClick()}
					variant='primary'
					mt={7}
					disabled={applicationData?.state === 'resubmit' || !isBiconomyInitialised}
					display={applicationData?.state === 'resubmit' ? '' : 'none'}
				>
					Accept Application
				</Button>
				<Text
					mt={7}
					fontSize='sm'
					lineHeight='4'
					align='center'
					color='#717A7C'
					display={applicationData?.state === 'resubmit' ? '' : 'none'}
				>
					This application has been asked for resubmission. The applicant has been
					notified to resubmit.
				</Text>
				<Button
					disabled={!isBiconomyInitialised}
					onClick={() => onResubmitApplicationClick()}
					variant='resubmit'
					mt={4}
					display={applicationData?.state === 'submitted' ? '' : 'none'}
				>
					Ask to Resubmit
				</Button>
				<Button
					disabled={!isBiconomyInitialised}
					onClick={() => onRejectApplicationClick()}
					variant='reject'
					mt={4}
					display={applicationData?.state === 'submitted' ? '' : 'none'}
				>
					Reject Application
				</Button>
			</Flex>

			<Box mt={6} />

			{/* <RubricSidebar
				total={
					applicationData
						?.reviewers.length || 0
				}
				reviews={applicationData?.reviews}
				rubric={applicationData?.grant.rubric}
			/> */}

			{/* <Flex
				bg="white"
				border="2px solid #D0D3D3"
				borderRadius={8}
				w={340}
				direction="column"
				alignItems="stretch"
				px="23px"
				py="17px"
			>
				<Flex direction="column">
Score
				</Flex>
			</Flex> */}


			<Flex
				bg='white'
				border='2px solid #D0D3D3'
				borderRadius={8}
				w={340}
				direction='column'
				alignItems='stretch'
				px='28px'
				py='22px'
			>
				<Flex direction='column'>
					<Text fontWeight='700'>
						Score
					</Text>
					{/* <Text mt={2}>
Assign reviewers for application
					</Text>
					<Button
						mt={4}
						onClick={() => setReviewDrawerOpen(true)}>
						<Text fontWeight="700">
Assign Reviewers
						</Text>
					</Button> */}
				</Flex>

				<Flex direction='column'>
					<Text
						mb='14px'
						fontWeight='700' />
					{
						applicationData
							?.reviewers
							?.map((r: any) => ({
								name: r.fullName,
								email: r.email,
								address: r.id.split('.')[1],
								id: r.id,
							})).map((reviewer: any) => {
								const reviewerIdSplit = reviewer?.id.split('.')
								const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]

								return (
									<Flex
										key={reviewer.email}
										w='100%'
										h='64px'
										align='center'
										mt={2}
										py={3}
										cursor='pointer'
										onClick={
											() => {
												setSelectedReview(reviews[reviewerId])
												setSelectedReviewer(reviewer)
												setScoreDrawerOpen(true)
											}
										}
									>
										<Image src='/ui_icons/reviewer_account.svg' />
										<Flex
											direction='column'
											ml={4}
											justifyContent='center'>
											<Text
												fontWeight='700'
												color='#122224'
												fontSize='14px'
												lineHeight='16px'
											>
												{reviewer?.name}
											</Text>
											<Text
												mt={1}
												color='#717A7C'
												fontSize='12px'
												lineHeight='16px'>
												{totalScore(reviews ? reviews[reviewerId]?.items : [])}
											</Text>
										</Flex>


										<ChevronRightIcon
											ml='auto'
											h='40px'
											w='40px'
											mr='-16px'
											p={0}
										/>
									</Flex>
								)
							})
					}
				</Flex>
			</Flex>

			<ViewScoreDrawer
				isOpen={scoreDrawerOpen}
				onClose={
					() => {
						setSelectedReview(undefined)
						setSelectedReviewer(undefined)
						setScoreDrawerOpen(false)
					}
				}
				score={selectedReview}
				reviewer={selectedReviewer}
			/>

			{/* <ReviewDrawer
				reviewDrawerOpen={reviewDrawerOpen}
				setReviewDrawerOpen={setReviewDrawerOpen}
				grantAddress={applicationData?.grant.id}
				chainId={chainId}
				workspaceId={applicationData?.grant.workspace.id}
				initialReviewers={applicationData?.reviewers}
				reviews={applicationData?.reviews}
				applicationId={applicationData?.id}
				onClose={() => setReviewDrawerOpen(false)}
			/> */}

			{/* <Flex
				bg="white"
				border="2px solid #D0D3D3"
				borderRadius={8}
				w={340}
				direction="column"
				alignItems="stretch"
				px="28px"
				py="22px"
				mt={8}
			>
				<Flex direction="column">
					<Flex
						mb={
							applicationData?.grant?.rubric && applicationData
								?.grant
								?.rubric
								.items.length > 0 ? '14px' : '0'
						}
						alignItems="center"
					>
						<Text
							mr="auto"
							fontWeight="700">
Evaluation Rubric
						</Text>
						<Text
							color="#8850EA"
							fontWeight="700"
							cursor="pointer"
							fontSize="12px"
							onClick={() => setRubricDrawerOpen(true)}
						>
							{
								applicationData?.grant?.rubric && applicationData
									?.grant
									?.rubric
									.items.length > 0 ? 'Edit' : 'Add'
							}
						</Text>
					</Flex>
					{
						applicationData?.grant?.rubric && applicationData
							?.grant
							?.rubric
							.items.map((r: any) => ({
								title: r.title,
								description: r.details,
							})).map((rubric: any) => (
								<>
									<Text
										mt={2}
										fontWeight="700"
										color="#122224"
										fontSize="14px">
										{rubric.title}
									</Text>
									<Text
										color="#717A7C"
										fontSize="12px">
										{rubric.description}
									</Text>
								</>
							))
					}
				</Flex>
			</Flex> */}

			{/* <Box mb={8} />

			<RubricDrawer
				rubricDrawerOpen={rubricDrawerOpen}
				setRubricDrawerOpen={setRubricDrawerOpen}
				rubricEditAllowed={rubricEditAllowed}
				rubrics={rubrics}
				setRubrics={setRubrics}
				maximumPoints={maximumPoints}
				setMaximumPoints={setMaximumPoints}
				chainId={getSupportedChainIdFromWorkspace(workspace) || defaultChainId}
				grantAddress={applicationData?.grant.id}
				workspaceId={workspace?.id || ''}
				initialIsPrivate={applicationData?.grant.rubric?.isPrivate || false}
			/> */}
		</>
	)
}

export default Sidebar
