import React, { useContext, useEffect, useState } from 'react'
import {
	Box,
	Button, Divider,
	Flex,
	Text, useToast,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import useEncryption from 'src/hooks/utils/useEncryption'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useAccount } from 'wagmi'
import { GetApplicationDetailsQuery } from '../../../generated/graphql'
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
  applicationData: GetApplicationDetailsQuery['grantApplication'];
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const { data: accountData } = useAccount()
	const [feedbackDrawerOpen, setFeedbackDrawerOpen] = React.useState(false)
	const [yourReview, setYourReview] = useState<any>()
	const [reviewSelected, setReviewSelected] = React.useState<any>()
	const { decryptMessage } = useEncryption()

	const toast = useToast()

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
		if(review) {
			loadReview(review)
		}

	}, [applicationData, accountData])

	const loadReview = async(yourReview: any) => {
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
		setReviewSelected(data)
	}

	if(yourReview) {
		return (
			<Flex
				bg='white'
				border='2px solid #D0D3D3'
				borderRadius={8}
				w={340}
				direction='column'
				alignItems='stretch'
				px='28px'
				py='22px'
				mb={8}
			>
				<Text
					fontSize={20}
					fontWeight={'500'}>
          Scoring Rubric
				</Text>
				<Box h={2} />
				<Divider />
				<Box h={2} />
				{
					reviewSelected?.items?.map((feedback: any) => (
						<>
							<Flex
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
								<Box h={1} />
								<Text
									color='#122224'
									fontSize='16px'
									lineHeight='12px'
								>
									{feedback.rating}
								</Text>
								{
									feedback.comment && (
										<>
											<Box h={1} />
											<Text
												color='#122224'
												fontSize='16px'
												lineHeight='12px'
											>
												{`Comments: ${feedback.comment}`}
											</Text>
											<Box h={2} />
										</>
									)
								}
							</Flex>
						</>
					))
				}
			</Flex>
		)
	} else {
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
					mb={8}
				>
					<Flex direction='column'>
						<Text fontWeight='700'>
              Assigned to review (you)
						</Text>
						<Text
							mt={2}
							color='#717A7C'
							fontSize='12px'>
              Review the application and provide
              your comment.
						</Text>
						<Button
							onClick={
								() => {
									if(applicationData?.grant.rubric?.items && applicationData?.grant.rubric?.items?.length === 0) {
										toast({
											title: 'Evaluation Rubric not present!',
											description: 'Evaluation Rubric required for review, contact grant administrator!',
											status: 'warning',
											isClosable: true,
										})
									} else {
										setFeedbackDrawerOpen(true)
									}
								}
							}
							mt={6}
							variant='primary'>
              Review Application
						</Button>
					</Flex>
				</Flex>

				<FeedbackDrawer
					feedbackDrawerOpen={feedbackDrawerOpen}
					setFeedbackDrawerOpen={setFeedbackDrawerOpen}
					grantAddress={applicationData!.grant.id}
					chainId={chainId}
					workspaceId={applicationData!.grant.workspace.id}
					rubrics={applicationData!.grant.rubric!.items}
					applicationId={applicationData!.id}
					isPrivate={applicationData!.grant.rubric!.isPrivate}
				/>
			</>
		)
	}

}

export default ReviewerSidebar
