import { ReactElement, useContext, useEffect, useState } from 'react'
import { Box, Flex, Heading, Image, Link, Spacer, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CopyIcon from 'src/components/ui/copy_icon'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters'
import { defaultChainId } from 'src/constants/chains'
import { GetApplicationDetailsQuery, useGetApplicationDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/pages/_app'
import ActionPanel from 'src/screens/proposal/_components/ActionPanel'
import MilestoneDoneModal from 'src/screens/proposal/_components/milestoneDoneModal'
import MilestoneItem from 'src/screens/proposal/_components/MilestoneItem'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { Proposal as ProposalType } from 'src/screens/proposal/_types'
import { IApplicantData } from 'src/types'
import { formatAmount, getCustomFields, getFieldString, getFieldStrings, getFormattedDateFromUnixTimestampWithYear, getRewardAmountMilestones, truncateStringFromMiddle } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getChainInfo } from 'src/utils/tokenUtils'
import SendFunds from 'src/v2/payouts/SendFunds'

function Proposal() {
	const buildComponent = () => (
		<Flex
			w='100vw'
			pt={6}
			gap={8}
			padding={8}>
			<Flex
				flex={2}
				w='100%'
				h='100%'
				flexDirection='column'
				gap={4}
			>
				<Text variant='proposalHeading'>
					{proposal?.name}
				</Text>
				{/* Proposal info start */}
				<Flex
					bg='white'
					gap={4}
					height='60px'
					alignItems='center'
					padding={5}>
					<Flex
						alignItems='center'
						gap={1} >
						<Image
							boxSize={4}
							src='/ui_icons/user_icon.svg' />
						<Text variant='footer'>
							{proposal?.applicantName}
						</Text>
					</Flex>
					<Spacer />
					<Flex
						alignItems='center'
						gap={1}>
						<Image
							boxSize={4}
							src='/ui_icons/wallet_line.svg' />
						<Text variant='footer'>
							{truncateStringFromMiddle(proposal?.applicantAddress!) }
						</Text>
						<CopyIcon text={proposal?.applicantAddress!} />
					</Flex>
					<Spacer />
					<Flex
						alignItems='center'
						gap={1}>
						<Image
							boxSize={4}
							src='/ui_icons/mail_line.svg' />
						<Text variant='footer'>
							{' '}
							{proposal?.applicantEmail}
							{' '}
						</Text>
						<CopyIcon text={proposal?.applicantEmail!} />
					</Flex>
					<Spacer />
					<Flex
						alignItems='center'
						gap={1}>
						<Image
							boxSize={4}
							src='/ui_icons/calendar_line.svg' />
						<Text variant='footer'>
							{' '}
							{proposal?.createdAt}
							{' '}
						</Text>
					</Flex>
				</Flex>
				{/* Proposal info end */}

				{/* Proposal details start */}
				<Flex
					bg='white'
					gap={4}
					alignItems='start'
					flexDirection='column'
					padding={4}>
					{/* Links */}
					<Box display={proposal?.links?.length ? '' : 'none'}>
						<Heading
							variant='applicationHeading'>
							Links
						</Heading>
						{
							proposal?.links?.map(({ link }) => (
								<Text
									key={link}
									variant='applicationText'
									mt={2}>
									<Link
										href={link}
										isExternal>
										{link}
									</Link>
								</Text>
							))
						}
					</Box>

					{/* Project Details */}
					<Box>
						<Heading variant='applicationHeading'>
							Project Details
						</Heading>
						<Text mt={2}>
							{
								proposal?.details ? (
									<TextViewer
										text={proposal?.details}
									/>
								) : null
							}

						</Text>
					</Box>

					{/* Project Goals */}
					<Box display={proposal?.goals && proposal?.goals !== '' ? '' : 'none'}>
						<Heading variant='applicationHeading'>
							Project Goals
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{proposal?.goals}
						</Text>
					</Box>

					{/* Project Milestones */}
					<Box display={proposal?.milestones?.length ? '' : 'none'}>
						<Heading variant='applicationHeading'>
							Project Milestones
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{' '}
							{
								proposal?.milestones?.map((milestone, index: number) => (
									<Box key={milestone.id}>
										<Heading
											variant='applicationSubtitle'
											mt={3}>
											Milestone
											{' '}
											{index + 1}
										</Heading>
										<Text
											variant='applicationTextHeading'
											mt={1}>
											{milestone?.title}
										</Text>
										<Flex
											direction='row'
											justify='start'
											mt={3}>
											<Image
												boxSize='48px'
												src={proposal?.token?.icon}
											/>
											<Box ml={2} />
											<Flex
												direction='column'
												justify='center'
												align='start'>
												<Heading variant='applicationSubtitle'>
													Funding asked
												</Heading>
												<Text variant='applicationText'>
													{
														milestone?.amount && proposal
                                                        && formatAmount(
                                                        	milestone?.amount,
                                                        	proposal?.token?.decimals,
                                                        )
													}
													{' '}
													{proposal?.token?.label}
												</Text>
											</Flex>
										</Flex>
										<Box mt={4} />
									</Box>
								))
							}
						</Text>
					</Box>

					{/* Funding Breakdown */}
					<Box
						display={proposal?.fundingBreakdown && proposal?.fundingBreakdown !== '' ? '' : 'none'}
					>
						<Heading variant='applicationHeading'>
							Funding Breakdown
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{proposal?.fundingBreakdown}
						</Text>
					</Box>

					{/* Team Member */}
					<Box
						display={proposal?.teamMembers ? '' : 'none'}
						mt={8}>
						<Heading variant='applicationHeading'>
							Team Members -
							{' '}
							{proposal?.teamMembers}
						</Heading>
						{
							proposal?.memberDetails?.map((memberDetail, index: number) => (
								<Box key={index}>
									<Heading
										variant='applicationHeading'
										mt={2}
									>
										#
										{' '}
										{index + 1}
									</Heading>
									<Text
										variant='applicationText'>
										{memberDetail}
									</Text>
								</Box>
							))
						}
					</Box>

					{/* Custom Fields */}
					<Box
						display={proposal?.customFields?.length ? '' : 'none'}
						mt={10}>
						<Heading
							variant='applicationHeading'>
							Additional Info
						</Heading>

						{
							proposal?.customFields.map((customField, index: number) => (
								<Box key={customField.title}>
									<Heading
										variant='applicationHeading'
										mt={3}>
										{index + 1}
										{'. '}
										{customField.title}
									</Heading>
									<Text
										variant='applicationText'
										mt={1}>
										{customField.value}
									</Text>
								</Box>
							))
						}
					</Box>
				</Flex>
				{/* Proposal details end */}
			</Flex>

			<Flex
				flex={1}
				w='100%'
				h='100%'
				direction='column'
			>
				<ActionPanel
					state={proposal?.state!}
					rejectionReason={proposal?.feedbackDao ?? ''}
					rejectionDate={proposal?.updatedAt ?? ''}
					onSendFundClick={
						() => {
							setSendFundData([{
								grantTitle: proposal?.grant?.title,
								grant: proposal?.grant,
								applicationId: proposal?.id!,
								applicantName:proposal?.applicantName,
								applicantEmail: proposal?.applicantEmail,
								applicantAddress: proposal?.applicantAddress,
								sentOn: proposal?.createdAt!,
								updatedOn: proposal?.updatedAt!,
								projectName: proposal?.name,
								fundingAsked: {
									amount: getRewardAmountMilestones(proposal?.token?.decimals!, proposal?.milestones),
									symbol: proposal?.token?.label ?? '',
									icon: proposal?.token?.icon!,
								},
								// status: applicationStatuses.indexOf(applicant?.state),
								status: TableFilters[proposal?.state!],
								milestones: proposal?.milestones!,
								amountPaid: '0',
								reviewers: [],
								reviews: []
							}])
						}
					}
					onAcceptClick={() => {}}
					onRejectClick={() => {}} />

				<Flex
					mt={4}
					bg='white'
					px={5}
					py={4}
					align='center'>
					<Text
						variant='v2_body'
						fontWeight='500'>
						Funding asked
					</Text>
					<Text
						variant='v2_subheading'
						fontWeight='500'
						ml='auto'>
						{getRewardAmountMilestones(proposal?.token?.decimals!, proposal)}
						{' '}
						{proposal?.token?.label}
					</Text>
				</Flex>

				<Flex
					direction='column'
					mt={4}
					bg='white'
					p={6}>
					{
						proposal?.milestones?.map((milestone, index) => {
							const disbursedMilestones = proposal?.grant?.fundTransfers?.filter((fundTransfer) => fundTransfer?.milestone?.id === milestone.id)
							return (
								<MilestoneItem
									key={milestone.id}
									milestone={milestone}
									disbursedMilestones={disbursedMilestones}
									index={index}
									token={proposal?.token} />
							)
						})
					}
				</Flex>
				<MilestoneDoneModal
					isOpen={isMilestoneDoneModalOpen}
					onClose={() => setIsMilestoneDoneModalOpen(false)}
				/>
				<SendFunds
					workspace={workspace!}
					workspaceSafe={workspace?.safe?.address}
					workspaceSafeChainId={workspace?.safe?.chainId ?? ''}
					sendFundsTo={sendFundData}
					rewardAssetAddress={proposal?.token?.address ?? ''}
					grantTitle={proposal?.grant?.title ?? ''} />
			</Flex>
		</Flex>

	)

	const router = useRouter()
	const { workspace } = useContext(ApiClientsContext)!

	const [isMilestoneDoneModalOpen, setIsMilestoneDoneModalOpen] = useState<boolean>(false)
	const [sendFundData, setSendFundData] = useState<IApplicantData[]>([])

	const [proposalId, setProposalId] = useState<string>()
	const [chainId, setChainId] = useState<SupportedChainId>(defaultChainId)

	const [proposal, setProposal] = useState<ProposalType>()

	useEffect(() => {
		logger.info({ chainId }, '(Proposal) Chain ID')
	}, [chainId])

	useEffect(() => {
		logger.info({ proposalId }, '(Proposal) Proposal ID')
	}, [chainId])

	useEffect(() => {
		if(typeof router.query.id === 'string') {
			setProposalId(router.query.id)
		}

		if(typeof router.query.chain === 'string' && router.query.chain in SupportedChainId) {
			setChainId(parseInt(router.query.chain) as SupportedChainId)
		}
	}, [])

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetApplicationDetailsQuery,
		options: {
			variables: {
				applicationID: proposalId ?? '',
			}
		},
		chains: [chainId]
	})

	useEffect(() => {
		fetchMore({ applicationID: proposalId }, true)
	}, [proposalId, chainId])

	useEffect(() => {
		logger.info({ results }, '(Proposal) Results')
	}, [results])

	const fetchData = async(application: Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>) => {
		let projectDetails = getFieldString(application, 'projectDetails')
		if(projectDetails.startsWith('Qm') && projectDetails.length < 64) {
			projectDetails = await getFromIPFS(projectDetails)
		}

		const chainInfo = getChainInfo(application.grant, chainId!)

		const proposal = ({
			id: application.id,
			name: getFieldString(application, 'projectName'),
			applicantName: getFieldString(application, 'applicantName'),
			applicantAddress: getFieldString(application, 'applicantAddress') ?? application.applicantId,
			applicantEmail: getFieldString(application, 'applicantEmail'),
			createdAt: getFormattedDateFromUnixTimestampWithYear(application.createdAtS)!,
			updatedAt: getFormattedDateFromUnixTimestampWithYear(application.updatedAtS)!,
			links: getFieldStrings(application, 'projectLinks'),
			details: projectDetails,
			goals: getFieldString(application, 'projectGoals'),
			milestones: application.milestones,
			fundingBreakdown: getFieldString(application, 'fundingBreakdown'),
			teamMembers: getFieldStrings(application, 'teamMembers'),
			memberDetails: getFieldStrings(application, 'memberDetails'),
			customFields: getCustomFields(application),
			token: chainInfo,
			state: application.state,
			feedbackDao: application.feedbackDao ?? '',
			grant: application.grant,
		})

		logger.info({ proposal }, '(Proposal) Final data')
		setProposal(proposal)
	}

	useEffect(() => {
		const application = results[0]?.grantApplication
		if(!application || !application?.grant || !chainId) {
			return
		}

		fetchData(application)
	}, [results])

	return buildComponent()
}

Proposal.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Proposal