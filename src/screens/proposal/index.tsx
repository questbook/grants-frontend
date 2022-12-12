import { ReactElement, useContext, useEffect, useState } from 'react'
import { Box, Flex, Heading, Image, Link, Spacer, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CopyIcon from 'src/components/ui/copy_icon'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters'
import { defaultChainId } from 'src/constants/chains'
import { GetApplicationDetailsQuery, useGetApplicationDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import useApproveMilestone from 'src/hooks/useApproveMilestone'
import useBatchUpdateApplicationState from 'src/hooks/useBatchUpdateApplicationState'
import useUpdateApplicationState from 'src/hooks/useUpdateApplicationState'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/pages/_app'
import ActionPanel from 'src/screens/proposal/_components/ActionPanel'
import ConfirmationModal from 'src/screens/proposal/_components/ConfirmationModal'
import MilestoneDoneModal from 'src/screens/proposal/_components/milestoneDoneModal'
import MilestoneItem from 'src/screens/proposal/_components/MilestoneItem'
import RejectProposalModal from 'src/screens/proposal/_components/RejectProposalModal'
import ScoresPanel from 'src/screens/proposal/_components/ScoresPanel'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { P } from 'src/screens/proposal/_types'
import { ChainInfo, CustomField, IApplicantData } from 'src/types'
import { formatAmount, getCustomFields, getFieldString, getFieldStrings, getFormattedDateFromUnixTimestampWithYear, getRewardAmountMilestones, truncateStringFromMiddle } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { useEncryptPiiForApplication } from 'src/utils/pii'
import { getChainInfo } from 'src/utils/tokenUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
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
				maxW='75%'
				flexDirection='column'
				gap={4}
			>
				<Flex>
					<Text variant='v2_heading_3'>
						{proposalName}
					</Text>
					<Spacer />
					<Flex
						display={proposal?.state === 'submitted' ? 'none' : ''}
						justifyContent='center'
						bg={proposal?.state === 'rejected' ? '#FFDCC0' : proposal?.state === 'approved' ? '#E3F6C1' : ''}
						borderRadius='3px'
						padding='8px'>
						<Text
							textTransform='capitalize'
							color={proposal?.state === 'rejected' ? '#FF7545' : proposal?.state === 'approved' ? '#0DC98B' : ''}
							fontWeight='600'
							fontSize='14px'
							lineHeight='20px'

						>
							{proposal?.state}
						</Text>
					</Flex>
				</Flex>

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
							{applicantName}
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
							{truncateStringFromMiddle(applicantAddress!)}
						</Text>
						<CopyIcon text={applicantAddress!} />
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
							{applicantEmail}
							{' '}
						</Text>
						<CopyIcon text={applicantEmail!} />
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
							{createdAt}
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
					<Box
						display={proposalLinks?.length ? '' : 'none'}>
						<Heading
							variant='applicationHeading'>
							Links
						</Heading>
						{
							proposalLinks?.map((link) => (
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

					{/* Proposal Details */}
					<Box>
						<Heading variant='applicationHeading'>
							Project Details
						</Heading>
						<Text mt={2}>
							{
								proposalDetails ? (
									<TextViewer
										text={proposalDetails}
									/>
								) : null
							}

						</Text>
					</Box>

					{/* Proposal Goals */}
					<Box display={proposalGoals && proposalGoals !== '' ? '' : 'none'}>
						<Heading variant='applicationHeading'>
							Project Goals
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{proposalGoals}
						</Text>
					</Box>

					{/* Proposal Milestones */}
					<Box display={milestones?.length ? '' : 'none'}>
						<Heading variant='applicationHeading'>
							Project Milestones
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{' '}
							{
								milestones?.map((milestone, index: number) => (
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
												src={token?.icon}
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
                                                        	token?.decimals,
                                                        )
													}
													{' '}
													{token?.label}
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
						display={fundingBreakdown && fundingBreakdown !== '' ? '' : 'none'}
					>
						<Heading variant='applicationHeading'>
							Funding Breakdown
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{fundingBreakdown}
						</Text>
					</Box>

					{/* Team Member */}
					<Box
						display={teamMembers ? '' : 'none'}
						mt={8}>
						<Heading variant='applicationHeading'>
							Team Members -
							{' '}
							{teamMembers}
						</Heading>
						{
							memberDetails?.map((memberDetail, index: number) => (
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
						display={customFields?.length ? '' : 'none'}
						mt={10}>
						<Heading
							variant='applicationHeading'>
							Additional Info
						</Heading>

						{
							customFields.map((customField, index: number) => (
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
				direction='column'
			>
				<ActionPanel
					state={proposal?.state!}
					rejectionReason={proposal?.feedbackDao ?? ''}
					rejectionDate={updatedAt ?? ''}
					onSendFundClick={
						() => {
							setSendFundData([{
								grantTitle: proposal?.grant?.title,
								grant: proposal?.grant,
								applicationId: proposal?.id!,
								applicantName: applicantName,
								applicantEmail: applicantEmail,
								applicantAddress: applicantAddress,
								sentOn: createdAt!,
								updatedOn: updatedAt!,
								projectName: proposalName,
								fundingAsked: {
									amount: getRewardAmountMilestones(token?.decimals!, proposal?.milestones),
									symbol: token?.label ?? '',
									icon: token?.icon!,
								},
								// status: applicationStatuses.indexOf(applicant?.state),
								status: TableFilters[proposal?.state!],
								milestones: milestones!,
								amountPaid: '0',
								reviewers: [],
								reviews: []
							}])
						}
					}
					onAcceptClick={
						() => {
							// setIsConfirmClicked(true)
							setIsAcceptProposalClicked(true)
							setIsConfirmationModalOpen(true)
							// setUpdateApplicationStateData({
							//     state: 2, comment: ''
							// })
						}
					}
					onRejectClick={
						() => {
							setIsRejectProposalClicked(true)
							setIsRejectProposalModalOpen(true)
							setUpdateApplicationStateData({
								state: 3, comment: ''
							})
						}
					} />
				<ConfirmationModal
					isOpen={isConfirmationModalOpen}
					isAcceptProposalClicked={isAcceptProposalClicked}
					isRejectProposalClicked={isRejectProposalClicked}
					setIsAcceptProposalClicked={setIsAcceptProposalClicked}
					setIsConfirmationModalOpen={setIsConfirmationModalOpen}
					setIsRejectProposalClicked={setIsRejectProposalClicked}
					setIsConfirmClicked={setIsConfirmClicked}
					networkTransactionModalStep={networkTransactionModalStep!}
					setUpdateApplicationStateData={setUpdateApplicationStateData} />
				<RejectProposalModal
					isOpen={isRejectProposalModalOpen}
					isRejectProposalClicked={isRejectProposalClicked}
					networkTransactionModalStep={networkTransactionModalStep!}
					updateApplicationStateData={updateApplicationStateData!}
					setIsConfirmClicked={setIsRejectConfirmClicked}
					setIsRejectProposalClicked={setIsRejectProposalClicked}
					setIsRejectProposalModalOpen={setIsRejectProposalModalOpen}
					setUpdateApplicationStateData={setUpdateApplicationStateData} />
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
						{getRewardAmountMilestones(token?.decimals!, proposal)}
						{' '}
						{token?.label}
					</Text>
				</Flex>

				<Flex
					direction='column'
					mt={4}
					bg='white'
					p={6}>
					{
						milestones?.map((milestone, index) => {
							const disbursedMilestones = proposal?.grant?.fundTransfers?.filter((fundTransfer) => fundTransfer?.milestone?.id === milestone.id)
							return (
								<MilestoneItem
									key={milestone.id}
									milestone={milestone}
									disbursedMilestones={disbursedMilestones!}
									index={index}
									token={token!}
									proposalStatus={proposal?.state!}
									onModalOpen={
										() => {
											setIsMilestoneDoneModalOpen(true)
											setApproveMilestoneData({ index, comment: '' })
										}
									} />
							)
						})
					}
				</Flex>

				{
					(proposal?.grant?.rubric?.items?.length || 0) > 0 && (
						<ScoresPanel
							proposal={proposal}
							chainId={chainId} />
					)
				}

				<MilestoneDoneModal
					onSubmit={
						(comment: string) => {
							setApproveMilestoneData({ index: approveMilestoneData.index, comment })
						}
					}
					isOpen={isMilestoneDoneModalOpen}
					onClose={() => setIsMilestoneDoneModalOpen(false)}
				/>

				<SendFunds
					workspace={workspace!}
					sendFundsTo={sendFundData}
					rewardAssetAddress={token?.address ?? ''}
					grantTitle={proposal?.grant?.title ?? ''} />

				<NetworkTransactionModal
					isOpen={networkTransactionModalStep !== undefined}
					subtitle={`${proposal?.state === 'approved' ? 'Marking milestone as done' : updateApplicationStateData?.state === 2 ? 'Accepting Application' : 'Rejecting Application'}`}
					description={
						<Flex
							direction='column'
							w='100%'
							align='start'>
							<Text
								fontWeight='500'
								fontSize='17px'
							>
								{proposal?.grant?.title}
							</Text>

							{/* <Button
							rightIcon={<ExternalLinkIcon />}
							variant='linkV2'
							bg='#D5F1EB'>
							{(grantData?.grants?.length || 0) > 0 && formatAddress(grantData?.grants[0]?.id!)}
						</Button> */}
						</Flex>
					}
					currentStepIndex={networkTransactionModalStep || 0}
					steps={
						[
							'Uploading data to IPFS',
							'Signing transaction with in-app wallet',
							'Waiting for transaction to complete on chain',
							'Indexing transaction on graph protocol',
							`${proposal?.state === 'approved' ? 'Milestone approved on-chain' : `Application ${updateApplicationStateData?.state === 2 ? 'accepted' : 'rejected'} on-chain`}`,
						]
					}
					viewLink={txnLink ? txnLink : acceptTxnLink ? acceptTxnLink : rejectTxnLink}
					onClose={
						async() => {
							setNetworkTransactionModalStep(undefined)
							router.reload()
						}
					} />
			</Flex>
		</Flex>

	)

	const router = useRouter()
	const { workspace } = useContext(ApiClientsContext)!

	const [proposalName, setProposalName] = useState('')
	const [applicantName, setApplicantName] = useState('')
	const [applicantEmail, setApplicantEmail] = useState('')
	const [applicantAddress, setApplicantAddress] = useState('')

	const [createdAt, setCreatedAt] = useState('')
	const [updatedAt, setUpdatedAt] = useState('')

	const [proposalDetails, setProposalDetails] = useState('')
	const [proposalLinks, setProposalLinks] = useState([])
	const [proposalGoals, setProposalGoals] = useState()

	const [milestones, setMilestones] = useState<Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>['milestones']>([])

	const [fundingBreakdown, setFundingBreakdown] = useState('')

	const [teamMembers, setTeamMembers] = useState<string[]>([])
	const [memberDetails, setMemberDetails] = useState<string[]>([])

	const [customFields, setCustomFields] = useState<CustomField[]>([])

	// const [isProposalLoading, setIsProposalLoading] = useState(true)

	const [isMilestoneDoneModalOpen, setIsMilestoneDoneModalOpen] = useState<boolean>(false)
	const [sendFundData, setSendFundData] = useState<IApplicantData[]>([])
	const [updateApplicationStateData, setUpdateApplicationStateData] = useState<{ state: number, comment: string }>({ state: -1, comment: '' })
	const [approveMilestoneData, setApproveMilestoneData] = useState<{ index: number, comment: string }>({ index: -1, comment: '' })

	const [proposalId, setProposalId] = useState<string>()
	const [chainId, setChainId] = useState<SupportedChainId>(defaultChainId)

	const [token, setToken] = useState<ChainInfo['supportedCurrencies'][string]>()

	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
	const [isRejectProposalModalOpen, setIsRejectProposalModalOpen] = useState<boolean>(false)

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [isConfirmClicked, setIsConfirmClicked] = useState<boolean>(false)
	const [isRejectConfirmClicked, setIsRejectConfirmClicked] = useState<boolean>(false)
	const [proposal, setProposal] = useState<P>()

	const [isAcceptProposalClicked, setIsAcceptProposalClicked] = useState<boolean>(false)
	const [isRejectProposalClicked, setIsRejectProposalClicked] = useState<boolean>(false)

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

	const [, rejectTxnLink,] = useUpdateApplicationState(
		updateApplicationStateData.comment,
		proposal?.id,
		updateApplicationStateData.state,
		isRejectConfirmClicked,
		setIsRejectConfirmClicked,
		setNetworkTransactionModalStep
	)

	// Needs to use these values properly
	const [, acceptTxnLink, , , ] = useBatchUpdateApplicationState(
		updateApplicationStateData.comment,
		[parseInt(proposal?.id!)],
		updateApplicationStateData.state,
		isConfirmClicked,
		setIsConfirmClicked,
		setNetworkTransactionModalStep
	)

	// Need to use the returned values properly
	const [, txnLink,] = useApproveMilestone(
		approveMilestoneData.comment,
		proposal?.id,
		approveMilestoneData.index,
		setNetworkTransactionModalStep
	)

	useEffect(() => {
		fetchMore({ applicationID: proposalId }, true)
	}, [proposalId, chainId])

	useEffect(() => {
		logger.info({ results }, '(Proposal) Results')
	}, [results])


	const decodeProposalDetails = async() => {
		let proposalDetails = getFieldString(proposal, 'projectDetails')
		if(proposalDetails.startsWith('Qm') && proposalDetails.length < 64) {
			proposalDetails = await getFromIPFS(proposalDetails)
		}

		setProposalDetails(proposalDetails)
	}

	useEffect(() => {
		const application = results[0]?.grantApplication
		if(!application || !application?.grant || !chainId) {
			return
		}
		// console.log('proposal links', getFieldStrings(application, 'projectLink'))

		logger.info({ application }, 'Application')
		setProposal(application)
		// fetchData(application)

	}, [results])

	useEffect(() => {
		if(proposal) {
			decodeProposalDetails()
			setProposalName(getFieldString(proposal, 'projectName'))
			setApplicantName(getFieldString(proposal, 'applicantName'))
			setApplicantAddress(getFieldString(proposal, 'applicantAddress') ?? proposal.applicantId)
			setApplicantEmail(getFieldString(proposal, 'applicantEmail'))

			setCreatedAt(getFormattedDateFromUnixTimestampWithYear(proposal.createdAtS)!)
			setUpdatedAt(getFormattedDateFromUnixTimestampWithYear(proposal.updatedAtS)!)
			setProposalLinks(getFieldStrings(proposal, 'projectLink'))
			setProposalGoals(getFieldString(proposal, 'projectGoals'))
			setMilestones(proposal.milestones)
			setFundingBreakdown(getFieldString(proposal, 'fundingBreakdown'))
			setTeamMembers(getFieldStrings(proposal, 'teamMembers'))
			setMemberDetails(getFieldStrings(proposal, 'memberDetails'))
			setCustomFields(getCustomFields(proposal))

			const chainInfo = getChainInfo(proposal.grant, chainId!)
			setToken(chainInfo)
		}
	}, [proposal])

	const { decrypt } = useEncryptPiiForApplication(
		proposal?.grant?.id,
		proposal?.applicantPublicKey,
		chainId
	)

	useEffect(() => {
		decrypt(proposal!).then((decryptedProposal) => {
			logger.info('Decrypted proposal', decryptedProposal)
			setProposal(decryptedProposal)
		})
	}, [proposal, setProposal, decrypt])

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
