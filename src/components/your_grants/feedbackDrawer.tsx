import React, { useContext, useEffect } from 'react'
// import useSetFeedbacks from 'src/hooks/useSetFeedbacks';
import StarRatings from 'react-star-ratings'
import {
	Box, Button, Divider, Drawer, DrawerContent, DrawerOverlay, Flex, Image,
	Text, } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
// import { useAccount } from 'wagmi'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useSubmitPublicKey from 'src/hooks/useSubmitPublicKey'
import useSubmitReview from 'src/hooks/useSubmitReview'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import MultiLineInput from '../ui/forms/multiLineInput'
import Loader from '../ui/loader'

function FeedbackDrawer({
	feedbackDrawerOpen,
	setFeedbackDrawerOpen,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	feedbacks,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setFeedbacks,
	feedbackEditAllowed,
	rubrics,
	grantAddress,
	chainId,
	workspaceId,
	applicationId,
	isPrivate,
}: {
  feedbackDrawerOpen: boolean;
  setFeedbackDrawerOpen: (feedbackDrawerOpen: boolean) => void;
  feedbacks: any[];
  setFeedbacks: (feedbacks: any[]) => void;
  feedbackEditAllowed: boolean;
  grantAddress: string;
  chainId: SupportedChainId | undefined;
  workspaceId: string;
  rubrics: any[];
  applicationId: string;
  isPrivate: boolean;
}) {
	const [editedFeedbackData, setEditedFeedbackData] = React.useState<any>()
	const [feedbackData, setFeedbackData] = React.useState<any[]>()
	const [isApproved, setIsApproved] = React.useState<boolean>(false)

	const [pk, setPk] = React.useState<string>('*')
	const { data: accountData } = useQuestbookAccount()
	const { workspace } = useContext(ApiClientsContext)!

	const {
		RenderModal,
		setHiddenModalOpen: setHiddenPkModalOpen,
		transactionData,
		publicKey: newPublicKey,
	} = useSubmitPublicKey()

	useEffect(() => {
		if(transactionData && newPublicKey && newPublicKey.publicKey) {
			console.log(newPublicKey)
			setPk(newPublicKey.publicKey)
			const formattedFeedbackData = feedbackData?.map((feedback: any) => ({
				rubric: feedback.rubric,
				rating: feedback.rating,
				comment: feedback.comment,
			}))
			setEditedFeedbackData({ isApproved, items: formattedFeedbackData })
		}

	}, [transactionData, newPublicKey])

	useEffect(() => {
		/// console.log(pk);
		if(!accountData?.address) {
			return
		}

		if(!workspace) {
			return
		}

		const k = workspace?.members?.find(
			(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
		)?.publicKey?.toString()
		// console.log(k);
		if(k && k.length > 0) {
			setPk(k)
		} else {
			setPk('')
		}

	}, [workspace, accountData])

	useEffect(() => {
		const newFeedbackData = [] as any[]
		if(rubrics?.length > 0) {
			rubrics.forEach((rubric) => {
				newFeedbackData.push({
					rating: 0,
					comment: '',
					isError: false,
					rubric,
				})
			})
		}

		setFeedbackData(newFeedbackData)
	}, [rubrics])
	const handleOnSubmit = () => {
		console.log(feedbackData)

		let error = false
		const newFeedbackData = [] as any[]
		feedbackData?.forEach((feedback) => {
			const newFeedbackDataObject = { ...feedback }
			if(feedback.rating === 0) {
				error = true
				newFeedbackDataObject.isError = true
			}

			newFeedbackData.push(newFeedbackDataObject)
		})
		if(error) {
			setFeedbackData(newFeedbackData)
			return
		}

		if(isPrivate && (!pk || pk === '*')) {
			setHiddenPkModalOpen(true)
			return
		}

		const formattedFeedbackData = feedbackData?.map((feedback: any) => ({
			rubric: feedback.rubric,
			rating: feedback.rating,
			comment: feedback.comment,
		}))
		setEditedFeedbackData({ isApproved, items: formattedFeedbackData })
	}

	const [
		data,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		transactionLink,
		loading,
	] = useSubmitReview(
		editedFeedbackData,
		isPrivate,
		chainId,
		workspaceId,
		grantAddress,
		applicationId,
	)

	const { setRefresh } = useCustomToast(transactionLink)

	useEffect(() => {
		if(data) {
			setFeedbackDrawerOpen(false)
			setRefresh(true)
		}
	}, [data, setFeedbackDrawerOpen])

	return (
		<>
			<Drawer
				isOpen={feedbackDrawerOpen}
				placement="right"
				onClose={() => setFeedbackDrawerOpen(false)}
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
								onClick={() => setFeedbackDrawerOpen(false)}
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
								onClick={() => setIsApproved(true)}
								variant={!isApproved ? 'outline' : 'solid'}
								h={12}
								minW="130px"
								colorScheme="brandGreen"
								borderRadius="6px"
							>
								<Image
									h="16px"
									w="16px"
									src={!isApproved ? '/ui_icons/like_up_green.svg' : '/ui_icons/like_up.svg'} />
								<Box mr="6px" />
								<Text color={!isApproved ? '#39C696' : '#FFFFFF'}>
For
								</Text>
							</Button>

							<Box ml={4} />

							<Button
								onClick={() => setIsApproved(false)}
								variant={isApproved ? 'outline' : 'solid'}
								h={12}
								minW="130px"
								colorScheme="brandRed"
								borderRadius="6px"
							>
								<Image
									h="16px"
									w="16px"
									src={isApproved ? '/ui_icons/like_down_red.svg' : '/ui_icons/like_down.svg'} />
								<Box mr="6px" />
								<Text color={isApproved ? '#EE7979' : '#FFFFFF'}>
Against
								</Text>
							</Button>
						</Flex>
						{
							feedbackData?.map((feedback, index) => (
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
												changeRating={
													(r) => {
														console.log(r)
														const newFeedbackData = [...feedbackData]
														newFeedbackData[index].rating = r
														newFeedbackData[index].isError = false
														setFeedbackData(newFeedbackData)
													}
												}
												rating={feedback.rating}
												name="rating"
												starHoverColor="#88BDEE"
												starDimension="18px"
												starSpacing="4px"
											/>
										</Box>

										{
											feedback.isError ? (
												<Text
													fontSize="14px"
													color="#EE7979"
													fontWeight="700"
													lineHeight="20px"
												>
                      Star Rating is Mandatory Field
												</Text>
											) : null
										}

										<MultiLineInput
											value={feedback.comment}
											onChange={
												(e) => {
													const newFeedbackData = [...feedbackData]
													newFeedbackData[index].comment = e.target.value
													setFeedbackData(newFeedbackData)
												}
											}
											placeholder="Feedback"
											isError={false}
											errorText="Star Rating is Mandatory Field"
											disabled={!feedbackEditAllowed}
										/>
									</Flex>
									<Divider mt={4} />
								</>
							))
						}

						<Box mt={12}>
							<Button
								mt="auto"
								variant="primary"
								onClick={handleOnSubmit}>
								{
									!loading ? 'Save' : (
										<Loader />
									)
								}
							</Button>
						</Box>
					</Flex>
				</DrawerContent>
			</Drawer>

			<RenderModal />
		</>
	)
}

export default FeedbackDrawer
