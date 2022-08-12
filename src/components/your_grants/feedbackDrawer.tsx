import React, { useContext, useEffect, useState } from 'react'
import {
	Box,
	Button,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Image,
	Slider,
	SliderFilledTrack, SliderMark,
	SliderThumb,
	SliderTrack,
	Text,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import useSubmitPublicKey from 'src/hooks/useSubmitPublicKey'
import useSubmitReview from 'src/hooks/useSubmitReview'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { useAccount } from 'wagmi'
import NetworkTransactionModal from '../../v2/components/NetworkTransactionModal'
import MultiLineInput from '../ui/forms/multiLineInput'
import Loader from '../ui/loader'

function FeedbackDrawer({
	feedbackDrawerOpen,
	setFeedbackDrawerOpen,
	rubrics,
	grantAddress,
	chainId,
	workspaceId,
	applicationId,
	isPrivate,
}: {
  feedbackDrawerOpen: boolean;
  setFeedbackDrawerOpen: (feedbackDrawerOpen: boolean) => void;
  grantAddress: string;
  chainId: SupportedChainId | undefined;
  workspaceId: string;
  rubrics: any[];
  applicationId: string;
  isPrivate: boolean;
}) {
	const [editedFeedbackData, setEditedFeedbackData] = React.useState<any>()
	const [feedbackData, setFeedbackData] = React.useState<any[]>()
	const [currentStep, setCurrentStep] = useState<number>()

	const [pk, setPk] = React.useState<string>('*')
	const { data: accountData } = useAccount()
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
			setEditedFeedbackData({ items: formattedFeedbackData })
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
					rubric,
				})
			})
		}

		setFeedbackData(newFeedbackData)
	}, [rubrics])
	const handleOnSubmit = () => {
		console.log(feedbackData)

		const newFeedbackData = [] as any[]
		feedbackData?.forEach((feedback) => {
			const newFeedbackDataObject = { ...feedback }
			newFeedbackData.push(newFeedbackDataObject)
		})

		if(isPrivate && (!pk || pk === '*')) {
			setHiddenPkModalOpen(true)
			return
		}

		const formattedFeedbackData = feedbackData?.map((feedback: any) => ({
			rubric: feedback.rubric,
			rating: feedback.rating,
			comment: feedback.comment,
		}))
		setEditedFeedbackData({ items: formattedFeedbackData })
	}

	const [
		data,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		transactionLink,
		loading,
	] = useSubmitReview(
		editedFeedbackData,
		setCurrentStep,
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
				placement='right'
				onClose={() => setFeedbackDrawerOpen(false)}
				size='lg'
			>
				<DrawerOverlay />
				<DrawerContent>

					<Flex
						bg={'#f5f5fa'}
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
										bg={'white'}
										borderRadius={'10px'}
										padding={'30px'}
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
															paddingTop={'10px'}
															value={i}>
															{i}
														</SliderMark>
													),
												)
											}
											<SliderTrack>
												<Box />
												<SliderFilledTrack bg={'#785EF0'} />
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

			<RenderModal />
			<NetworkTransactionModal
				isOpen={currentStep !== undefined}
				subtitle='Submitting review'
				description={<></>}
				currentStepIndex={currentStep || 0}
				steps={
					[
						'Uploading data to IPFS',
						'Sign transaction',
						'Waiting for transaction to complete',
						'Waiting for transaction indexing',
						'Review pushed on-chain',
					]
				} />
		</>
	)
}

export default FeedbackDrawer
