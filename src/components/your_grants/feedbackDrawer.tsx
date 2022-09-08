import { useEffect, useState } from 'react'
import {
	Box,
	Button,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	HStack,
	Image,
	Slider,
	SliderFilledTrack, SliderMark,
	SliderThumb,
	SliderTrack, Spacer,
	Text,
} from '@chakra-ui/react'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import Loader from 'src/components/ui/loader'
import { SupportedChainId } from 'src/constants/chains'
import { RubricItem } from 'src/generated/graphql'
import useSubmitReview from 'src/hooks/useSubmitReview'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { sumArray } from 'src/utils/generics'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

export interface FeedbackType {
	rubric: RubricItem
	rating: number
	comment: string
}

function FeedbackDrawer({
	feedbackDrawerOpen,
	setFeedbackDrawerOpen,
	rubrics,
	grantTitle,
	grantAddress,
	chainId,
	workspaceId,
	applicationId,
	isPrivate,
}: {
	feedbackDrawerOpen: boolean
	setFeedbackDrawerOpen: (feedbackDrawerOpen: boolean) => void
	grantTitle: string
	grantAddress: string
	chainId: SupportedChainId | undefined
	workspaceId: string
	rubrics: RubricItem[]
	applicationId: string
	isPrivate: boolean
}) {
	const [feedbackData, setFeedbackData] = useState<FeedbackType[]>()
	const [editedFeedbackData, setEditedFeedbackData] = useState<{ items?: Array<FeedbackType> }>()
	const [currentStep, setCurrentStep] = useState<number>()

	useEffect(() => {
		const newFeedbackData = Array<FeedbackType>()
		if(rubrics?.length > 0) {
			rubrics.forEach((rubric) => {
				newFeedbackData.push({
					rating: 0,
					comment: '',
					rubric,
				})
			})
		}

		setFeedbackData(newFeedbackData)
	}, [rubrics])

	const handleOnSubmit = () => {
		const newFeedbackData = []
		feedbackData?.forEach((feedback) => {
			newFeedbackData.push(feedback)
		})

		const formattedFeedbackData = feedbackData?.map((feedback) => ({
			rubric: feedback.rubric,
			rating: feedback.rating,
			comment: feedback.comment,
		}))
		setEditedFeedbackData({ items: formattedFeedbackData })
	}

	const [transactionHash, setTransactionHash] = useState<string>()

	const [
		data,
		transactionLink,
		loading,
		isBiconomyInitialised
	] = useSubmitReview(
		editedFeedbackData!,
		setCurrentStep,
		setTransactionHash,
		isPrivate,
		chainId,
		workspaceId,
		grantAddress,
		applicationId,
	)

	const { setRefresh } = useCustomToast(transactionLink as string)

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
				placement='right'
				onClose={() => setFeedbackDrawerOpen(false)}
				size='lg'
			>
				<DrawerOverlay />
				<DrawerContent>

					<Flex
						bg='#f5f5fa'
						direction='column'
						overflow='scroll'
						p={8}>
						<Flex
							mb={8}
							alignItems='center'>
							<Image
								src='/ui_icons/back_arrow.svg'
								cursor='pointer'
								mr='12px'
								h='16px'
								w='16px'
								onClick={() => setFeedbackDrawerOpen(false)}
							/>
							<Text
								color='#122224'
								fontWeight='bold'
								fontSize='16px'
								lineHeight='20px'
							>
								Application Feedback
							</Text>
						</Flex>
						{
							feedbackData?.map((feedback, index) => (
								<>
									<Flex
										bg='white'
										borderRadius='10px'
										padding='30px'
										mt={4}
										gap='2'
										direction='column'
									>
										<Text
											color='#122224'
											fontWeight='bold'
											fontSize='16px'
											lineHeight='12px'
										>
											{feedback.rubric.title}
										</Text>
										<Text
											color='#69657B'
											fontWeight='400'
											fontSize='12px'
											lineHeight='12px'
											mt='6px'
										>
											{feedback.rubric.details}
										</Text>
										<Slider
											min={0}
											defaultValue={0}
											step={1}
											max={feedback.rubric.maximumPoints - 1}
											onChangeEnd={
												(r) => {
													const newFeedbackData = [...feedbackData]
													newFeedbackData[index].rating = r
													setFeedbackData(newFeedbackData)
												}
											}
										>
											{
												Array.from({ length: feedback.rubric.maximumPoints },
													(_, i) => (
														<SliderMark
															key={i}
															paddingTop='10px'
															value={i}>
															{i}
														</SliderMark>
													),
												)
											}
											<SliderTrack>
												<Box />
												<SliderFilledTrack bg='#785EF0' />
											</SliderTrack>
											<SliderThumb
												style={{ border: '3px solid #785EF0' }} />
										</Slider>
										<Box h={5} />
										<MultiLineInput
											value={feedback.comment}
											onChange={
												(e) => {
													const newFeedbackData = [...feedbackData]
													newFeedbackData[index].comment = e.target.value
													setFeedbackData(newFeedbackData)
												}
											}
											placeholder='Comments'
											isError={false}
										/>
									</Flex>
									<Divider mt={4} />
								</>
							))
						}
						<Box mt={12}>
							<Button
								disabled={!isBiconomyInitialised}
								mt='auto'
								variant='primary'
								onClick={handleOnSubmit}>
								{
									!loading ? 'Confirm' : (
										<Loader />
									)
								}
							</Button>
						</Box>
					</Flex>
				</DrawerContent>
			</Drawer>

			<NetworkTransactionModal
				isOpen={currentStep !== undefined}
				subtitle='Submitting review'
				description={
					<HStack w='100%'>
						<Text
							fontWeight='500'
							fontSize='17px'
						>
							{grantTitle}
						</Text>
						<Spacer />
						<Text>
							{feedbackData && sumArray(feedbackData!.map(e => e.rating))}
						</Text>
					</HStack>
				}
				currentStepIndex={currentStep || 0}
				steps={
					[
						'Uploading data to IPFS',
						'Sign transaction',
						'Waiting for transaction to complete',
						'Waiting for transaction indexing',
						'Review pushed on-chain',
					]
				}
				transactionHash={transactionHash}
				onClose={
					() => {
						setCurrentStep(undefined)
					}
				} />
		</>
	)
}

export default FeedbackDrawer
