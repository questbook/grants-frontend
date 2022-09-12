import { useContext, useEffect, useMemo, useState } from 'react'
import {
	Badge,
	Box,
	Button, Divider,
	Flex,
	HStack,
	Text, useToast,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { Fragment } from 'preact'
import Loader from 'src/components/ui/loader'
import FeedbackDrawer, { FeedbackType } from 'src/components/your_grants/feedbackDrawer'
import { defaultChainId } from 'src/constants/chains'
import { GetApplicationDetailsQuery } from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { useLoadReview } from 'src/utils/reviews'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'

type ReviewerSidebarProps = {
	applicationData: GetApplicationDetailsQuery['grantApplication']
}

function ReviewerSidebar({ applicationData }: ReviewerSidebarProps) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { data: accountData } = useQuestbookAccount()

	const [feedbackDrawerOpen, setFeedbackDrawerOpen] = useState(false)
	const [reviewSelected, setReviewSelected] = useState<{ items: FeedbackType[] }>()
	const [reviewLoadError, setReviewLoadError] = useState<Error>()

	const isPrivate = !!applicationData?.grant.rubric?.isPrivate
	const grantId = applicationData?.grant.id

	const { loadReview } = useLoadReview(grantId, chainId)

	const yourReview = useMemo(() => {
		return applicationData?.reviews.find((r) => (
			r.reviewer?.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
		))
	}, [applicationData])

	const toast = useToast()

	useEffect(() => {
		if(!applicationData) {
			return
		}

		if(!accountData) {
			return
		}

		if(yourReview) {
			loadReview(yourReview, applicationData!.id)
				.then(setReviewSelected)
				.catch(err => {
					// console.error('error in loading review ', err)
					setReviewLoadError(err)
				})
		}

	}, [applicationData, accountData])

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
				<HStack justify='space-between'>
					<Text
						fontSize={20}
						fontWeight='500'>
						Your Score
					</Text>

					{
						isPrivate && (
							<Badge
								fontSize='x-small'
								p='1'
								pr='2'
								pl='2'>
								Private
							</Badge>
						)
					}
				</HStack>
				<Box h={2} />
				<Divider />
				<Box h={2} />
				{
					// loading if review is not there
					// and there's no error
					!reviewSelected && !reviewLoadError && (
						<Loader />
					)
				}
				{
					!!reviewLoadError && (
						<Text color='red'>
							There was an error in loading your review:
							<br />
							<b>
								{reviewLoadError.message}
							</b>
						</Text>
					)
				}
				{
					reviewSelected?.items?.map((feedback, index) => (
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
									{`Score: ${feedback.rating}`}
								</Text>
								{
									feedback.comment && (
										<>
											<Box h={1} />
											<Text
												color='#122224'
												fontSize='16px'
												lineHeight='20px'
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
