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
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import SendFunds from 'src/v2/payouts/SendFunds'
import ConfirmationModal from './_components/ConfirmationModal'
import RejectProposalModal from './_components/RejectProposalModal'
import useUpdateApplicationState from 'src/hooks/useUpdateApplicationState'

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
                <Flex>
                <Text variant='proposalHeading'>
                    {proposal?.name}
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
                    
                    >{proposal?.state}</Text>
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
                            {truncateStringFromMiddle(proposal?.applicantAddress!)}
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
                                applicantName: proposal?.applicantName,
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
                    onAcceptClick={
                        () => {
                            // setIsConfirmClicked(true)
                            setIsAcceptProposalClicked(true)
                            setIsConfirmationModalOpen(true)
                            setUpdateApplicationStateData({
                                state: 2, comment: ''
                            })
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
                    networkTransactionModalStep={networkTransactionModalStep!} />
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
                                    token={proposal?.token}
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
                    workspaceSafe={workspace?.safe?.address}
                    workspaceSafeChainId={workspace?.safe?.chainId ?? ''}
                    sendFundsTo={sendFundData}
                    rewardAssetAddress={proposal?.token?.address ?? ''}
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
                        async () => {
                            setNetworkTransactionModalStep(undefined)
                            router.reload()
                        }
                    } />
            </Flex>
        </Flex>

    )

    const router = useRouter()
    const { workspace } = useContext(ApiClientsContext)!

    const [isMilestoneDoneModalOpen, setIsMilestoneDoneModalOpen] = useState<boolean>(false)
    const [sendFundData, setSendFundData] = useState<IApplicantData[]>([])
    const [updateApplicationStateData, setUpdateApplicationStateData] = useState<{ state: number, comment: string }>({ state: -1, comment: '' })
    const [approveMilestoneData, setApproveMilestoneData] = useState<{ index: number, comment: string }>({ index: -1, comment: '' })

    const [proposalId, setProposalId] = useState<string>()
    const [chainId, setChainId] = useState<SupportedChainId>(defaultChainId)

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
    const [isRejectProposalModalOpen, setIsRejectProposalModalOpen] = useState<boolean>(false)

    const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
    const [isConfirmClicked, setIsConfirmClicked] = useState<boolean>(false)
    const [isRejectConfirmClicked, setIsRejectConfirmClicked] = useState<boolean>(false)
    const [proposal, setProposal] = useState<ProposalType>()

    const [isAcceptProposalClicked, setIsAcceptProposalClicked] = useState<boolean>(false)
    const [isRejectProposalClicked, setIsRejectProposalClicked] = useState<boolean>(false)

    useEffect(() => {
        logger.info({ chainId }, '(Proposal) Chain ID')
    }, [chainId])

    useEffect(() => {
        logger.info({ proposalId }, '(Proposal) Proposal ID')
    }, [chainId])

    useEffect(() => {
        if (typeof router.query.id === 'string') {
            setProposalId(router.query.id)
        }

        if (typeof router.query.chain === 'string' && router.query.chain in SupportedChainId) {
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

    const [rejectTxnData, rejectTxnLink, ] = useUpdateApplicationState(
        updateApplicationStateData.comment,
        proposal?.id,
        updateApplicationStateData.state,
        isRejectConfirmClicked,
        setIsRejectConfirmClicked,
        setNetworkTransactionModalStep
    )

    // Needs to use these values properly
    const [txnData, acceptTxnLink, , isBiconomyInitialised, error] = useBatchUpdateApplicationState(
        updateApplicationStateData.comment,
        [parseInt(proposal?.id!)],
        updateApplicationStateData.state,
        isConfirmClicked,
        setIsConfirmClicked,
        setNetworkTransactionModalStep
    )

    // Need to use the returned values properly
    const [txn, txnLink,] = useApproveMilestone(
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

    const fetchData = async (application: Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>) => {
        let projectDetails = getFieldString(application, 'projectDetails')
        if (projectDetails.startsWith('Qm') && projectDetails.length < 64) {
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
        if (!application || !application?.grant || !chainId) {
            return
        }

        fetchData(application)
    }, [results])

    return buildComponent()
}

Proposal.getLayout = function (page: ReactElement) {
    return (
        <NavbarLayout>
            {page}
        </NavbarLayout>
    )
}

export default Proposal