import { useContext, useEffect, useState } from 'react'
import {
	Box,
	Button, Divider,
	Flex,
	Text, useToast,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { Fragment } from 'preact'
import useEncryption from 'src/hooks/utils/useEncryption'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useAccount } from 'wagmi'
import { GetApplicationDetailsQuery } from '../../../generated/graphql'
import FeedbackDrawer, { FeedbackType } from '../feedbackDrawer'

type ReviewType = Exclude<Exclude<GetApplicationDetailsQuery['grantApplication'], null>, undefined>['reviews'][0];

function ReviewerSidebar({
	applicationData,
}: {
  showHiddenData: () => void;
  onAcceptApplicationClick: () => void;
  onRejectApplicationClick: () => void;
  onResubmitApplicationClick: () => void;
  applicationData: GetApplicationDetailsQuery['grantApplication'];
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const { data: accountData } = useAccount()
	const [feedbackDrawerOpen, setFeedbackDrawerOpen] = useState(false)
	const [yourReview, setYourReview] = useState<ReviewType>()
	const [reviewSelected, setReviewSelected] = useState<{ items: FeedbackType[] }>()
	const { decryptMessage } = useEncryption()

	const toast = useToast()

	useEffect(() => {
		if(!applicationData) {
			return
		}

		if(!accountData) {
			return
		}

		const review = applicationData?.reviews.find((r) => (
			r.reviewer?.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
		))
		setYourReview(review)
		if(review) {
			loadReview(review)
		}

	}, [applicationData, accountData])

	const loadReview = async(yourReview: ReviewType) => {
		if(!yourReview) {
			return
		}

		let data: typeof reviewSelected

		if(applicationData?.grant.rubric?.isPrivate) {
			const reviewData = yourReview.data.find((d) => (
				d.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
			))
			const ipfsData = await getFromIPFS(reviewData!.data)

			data = JSON.parse(await decryptMessage(ipfsData) || '{}')
		} else {
			const ipfsData = await getFromIPFS(yourReview!.publicReviewDataHash!)
			data = JSON.parse(ipfsData || '{}')
		}

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
					reviewSelected?.items?.map((feedback, index: number) => (
						<Fragment key={index}>
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
						</Fragment>
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
					grantTitle={applicationData!.grant.title}
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
