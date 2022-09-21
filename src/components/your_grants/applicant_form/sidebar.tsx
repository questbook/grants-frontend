import React, { useContext, useState } from 'react'
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
import { GetApplicationDetailsQuery } from 'src/generated/graphql'
import { IReviewer, IReviewFeedback } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import {
	formatAddress,
	getFieldString,
	getFormattedFullDateFromUnixTimestamp, getRewardAmount,
	truncateStringFromMiddle,
} from 'src/utils/formattingUtils'
import { useLoadReviews } from 'src/utils/reviews'
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
  applicationData: GetApplicationDetailsQuery['grantApplication']
  isBiconomyInitialised: boolean
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	const applicantEmail = getFieldString(applicationData, 'applicantEmail')
	const applicantAddress = getFieldString(applicationData, 'applicantAddress')

	const [selectedReview, setSelectedReview] = useState<IReviewFeedback>()
	const [selectedReviewer, setSelectedReviewer] = useState<IReviewer>()
	const [scoreDrawerOpen, setScoreDrawerOpen] = useState(false)

	const { reviews } = useLoadReviews(
		applicationData
			? {
				applicationId: applicationData.id,
				reviews: applicationData.reviews,
				grant: applicationData.grant
			} : undefined,
		chainId
	)

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
			applicationData?.grant.reward.asset.toLowerCase() || ''
		]?.decimals
	}

	return (
		<>
			<Flex
				bg='white'
				border='2px solid #D0D3D3'
				borderRadius={8}
				w='100%'
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
						{getFormattedFullDateFromUnixTimestamp(applicationData?.createdAtS || 0)}
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

			<Flex
				bg='white'
				border='2px solid #D0D3D3'
				borderRadius={8}
				w='100%'
				direction='column'
				alignItems='stretch'
				px='28px'
				py='22px'
			>
				<Flex direction='column'>
					<Text fontWeight='700'>
						Score
					</Text>
				</Flex>

				<Flex direction='column'>
					<Text
						mb='14px'
						fontWeight='700' />
					{
						applicationData
							?.reviewers
							?.map((reviewer) => {
								const reviewerIdSplit = reviewer.id.split('.')
								const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]
								const review = reviews?.[reviewerId]

								return (
									<Flex
										key={reviewer.id}
										w='100%'
										h='64px'
										align='center'
										mt={2}
										py={3}
										cursor='pointer'
										pointerEvents={review ? undefined : 'none'}
										onClick={
											() => {
												setSelectedReview(reviews[reviewerId])
												setSelectedReviewer(reviewer)
												setScoreDrawerOpen(true)
											}
										}
									>
										<Image
											src={getAvatar(false, reviewerId)}
											borderRadius='50%'
											boxSize='40px' />
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
												{reviewer.fullName || formatAddress(reviewerId)}
											</Text>
											<Text
												mt={1}
												color='#717A7C'
												fontSize='12px'
												lineHeight='16px'>
												{
													review
														? review.total
														: 'Not Reviewed'
												}
											</Text>
										</Flex>

										{
											!!review && (
												<ChevronRightIcon
													ml='auto'
													h='40px'
													w='40px'
													mr='-16px'
													p={0}
												/>
											)
										}
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
		</>
	)
}

export default Sidebar
