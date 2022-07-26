import React, { useContext, useEffect, useState } from 'react'
import StarRatings from 'react-star-ratings'
import {
	Box,
	Button,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Image,
	Text,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import Loader from 'src/components/ui/loader'
// import { useAccount } from 'wagmi'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useSubmitReview from 'src/hooks/useSubmitReview'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import useEncryption from 'src/hooks/utils/useEncryption'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import FeedbackDrawer from '../feedbackDrawer'

function ReviewerSidebar({
	applicationData,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	isAdmin,
}: {
  showHiddenData: () => void;
  isAdmin: boolean;
  onAcceptApplicationClick: () => void;
  onRejectApplicationClick: () => void;
  onResubmitApplicationClick: () => void;
  applicationData: any;
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const { data: accountData, nonce } = useQuestbookAccount()

	const [feedbackDrawerOpen, setFeedbackDrawerOpen] = React.useState(false)
	const [feedbacks, setFeedbacks] = React.useState<any[]>([])

	const [yourReview, setYourReview] = useState<any>()

	const [decrpytLoading, setDecrpytLoading] = useState(false)
	const [reviewerDrawerOpen, setReviewerDrawerOpen] = useState(false)
	const [reviewSelected, setReviewSelected] = React.useState<any>()

	const [editedFeedbackData, setEditedFeedbackData] = React.useState<any>()

	const { decryptMessage } = useEncryption()

	console.log(applicationData)

	useEffect(() => {
		if(!applicationData) {
			return
		}

		if(!accountData) {
			return
		}

		const review = applicationData?.reviews.find((r: any) => (
			r.reviewer.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
		))
		setYourReview(review)

	}, [applicationData, accountData])

	const handleSeeFeedbackClick = async() => {
		setDecrpytLoading(true)

		let data = {}
		if(applicationData?.grant.rubric?.isPrivate) {
			const reviewData = yourReview.data.find((d: any) => (
				d.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
			))
			const ipfsData = await getFromIPFS(reviewData.data)

			data = JSON.parse(await decryptMessage(ipfsData) || '{}')
		} else {
			const ipfsData = await getFromIPFS(yourReview.publicReviewDataHash)
			data = JSON.parse(ipfsData || '{}')
		}

		console.log(data)
		setDecrpytLoading(false)
		setReviewSelected(data)
		setReviewerDrawerOpen(true)
	}

	const handleOnResubmit = () => {
		console.log(reviewSelected)

		// let error = false;
		// reviewSelected?.forEach((feedback: any) => {
		//   if (feedback.rating === 0 && feedback.comment === '') {
		//     error = true;
		//   }
		// });
		// if (error) return;
		setEditedFeedbackData(reviewSelected)
	}

	const [
		data,
		transactionLink,
		resubmitLoading,
	] = useSubmitReview(
		editedFeedbackData,
		applicationData?.grant.rubric?.isPrivate,
		chainId,
		applicationData?.grant.workspace.id,
		applicationData?.grant.id,
		applicationData?.id,
	)

	const { setRefresh } = useCustomToast(transactionLink)

	useEffect(() => {
		if(data) {
			setReviewerDrawerOpen(false)
			setReviewSelected(null)
			setFeedbackDrawerOpen(false)
			setRefresh(true)
		}
	}, [data, setFeedbackDrawerOpen])

	// if (yourReview && isAdmin) {
	//   return null;
	// }

	if(yourReview) {
		return (
			<>
				<Flex
					bg="white"
					border="2px solid #D0D3D3"
					borderRadius={8}
					w={340}
					direction="column"
					alignItems="stretch"
					px="28px"
					py="22px"
					mb={8}
				>
					<Flex direction="column">
						<Text fontWeight="700">
Your Review
						</Text>
						<Text
							mt={2}
							color="#717A7C"
							fontSize="12px">
              You have already submitted a review for this application.
							{' '}
						</Text>

						{
							decrpytLoading ? (
								<Button
									onClick={() => {}}
									mt={6}
									variant="primary">
									<Loader />
								</Button>
							) : (
								<Button
									onClick={() => handleSeeFeedbackClick()}
									mt={6}
									variant="primary">
View Feedback
								</Button>
							)
						}

					</Flex>
				</Flex>
				<Drawer
					isOpen={reviewerDrawerOpen}
					placement="right"
					onClose={
						() => {
							setReviewerDrawerOpen(false)
							setReviewSelected(null)
						}
					}
					size="lg"
				>
					<DrawerOverlay />
					<DrawerContent>

						<Flex
							direction="column"
							overflow="scroll"
							p={8}>
							<Flex
								mb={8}
								alignItems="center">
								<Image
									src="/ui_icons/back_arrow.svg"
									cursor="pointer"
									mr="12px"
									h="16px"
									w="16px"
									onClick={
										() => {
											setReviewerDrawerOpen(false)
											setReviewSelected(null)
										}
									}
								/>
								<Text
									color="#122224"
									fontWeight="bold"
									fontSize="16px"
									lineHeight="20px"
								>
                  Application Feedback
								</Text>
							</Flex>
							<Text
								mt="18px"
								color="#122224"
								fontWeight="bold"
								fontSize="16px"
								lineHeight="20px"
							>
                Overall Recommendation
							</Text>
							<Flex
								pt="12px"
								pb="18px">
								<Button
									onClick={() => {}}
									variant={!reviewSelected?.isApproved ? 'outline' : 'solid'}
									h={12}
									minW="130px"
									colorScheme="brandGreen"
									borderRadius="6px"
								>
									<Image
										h="16px"
										w="16px"
										src={!reviewSelected?.isApproved ? '/ui_icons/like_up_green.svg' : '/ui_icons/like_up.svg'} />
									<Box mr="6px" />
									<Text color={!reviewSelected?.isApproved ? '#39C696' : '#FFFFFF'}>
For
									</Text>
								</Button>

								<Box ml={4} />

								<Button
									onClick={() => {}}
									variant={reviewSelected?.isApproved ? 'outline' : 'solid'}
									h={12}
									minW="130px"
									colorScheme="brandRed"
									borderRadius="6px"
								>
									<Image
										h="16px"
										w="16px"
										src={reviewSelected?.isApproved ? '/ui_icons/like_down_red.svg' : '/ui_icons/like_down.svg'} />
									<Box mr="6px" />
									<Text color={reviewSelected?.isApproved ? '#EE7979' : '#FFFFFF'}>
Against
									</Text>
								</Button>
							</Flex>
							{
								reviewSelected?.items?.map((feedback: any) => (
									<>
										<Flex
											mt={4}
											gap="2"
											direction="column"
										>
											<Text
												color="#122224"
												fontWeight="bold"
												fontSize="16px"
												lineHeight="12px"
											>
												{feedback.rubric.title}
											</Text>
											<Text
												color="#69657B"
												fontWeight="400"
												fontSize="12px"
												lineHeight="12px"
												mt="6px"
											>
												{feedback.rubric.details}
											</Text>

											<Box mt="2px">
												<StarRatings
													numberOfStars={feedback.rubric.maximumPoints}
													starRatedColor="#88BDEE"
													rating={feedback.rating}
													name="rating"
													starHoverColor="#88BDEE"
													starDimension="18px"
													starSpacing="4px"
												/>
											</Box>

											<MultiLineInput
												value={feedback.comment}
												onChange={() => {}}
												placeholder="Feedback"
												isError={false}
												errorText="Required"
												disabled
											/>
										</Flex>
										<Divider mt={4} />
									</>
								))
							}

							<Flex
								direction="row"
								mt={12}
								alignItems="center">
								<Button
									mt="auto"
									variant="primary"
									onClick={handleOnResubmit}>
									{resubmitLoading ? <Loader /> : 'Resubmit Feedback'}
								</Button>
								<Text
									fontSize="12px"
									color="#717A7C"
									ml={4}>
                  If in case the DAO admin is not able to view your review,
                  you can resubmit it without editing it.
                  Please consult with the DAO admin before resubmitting
								</Text>
							</Flex>
						</Flex>

					</DrawerContent>
				</Drawer>
			</>
		)
	}

	return (
		<>
			<Flex
				bg="white"
				border="2px solid #D0D3D3"
				borderRadius={8}
				w={340}
				direction="column"
				alignItems="stretch"
				px="28px"
				py="22px"
				mb={8}
			>
				<Flex direction="column">
					<Text fontWeight="700">
Assigned to review (you)
					</Text>
					<Text
						mt={2}
						color="#717A7C"
						fontSize="12px">
            Review the application and provide
            your comment.
						{' '}
					</Text>

					<Button
						onClick={() => setFeedbackDrawerOpen(true)}
						mt={6}
						variant="primary">
Review Application
					</Button>
				</Flex>
			</Flex>

			<FeedbackDrawer
				feedbackDrawerOpen={feedbackDrawerOpen}
				setFeedbackDrawerOpen={setFeedbackDrawerOpen}
				grantAddress={applicationData?.grant.id}
				chainId={chainId}
				workspaceId={applicationData?.grant.workspace.id}
				feedbacks={feedbacks}
				setFeedbacks={setFeedbacks}
				rubrics={applicationData?.grant.rubric?.items}
				feedbackEditAllowed
				applicationId={applicationData?.id}
				isPrivate={applicationData?.grant.rubric?.isPrivate}
			/>
		</>
	)
}

export default ReviewerSidebar
