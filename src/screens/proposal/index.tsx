import { ReactElement, useEffect, useState } from 'react'
import { Box, Flex, Heading, Image, Link, Spacer, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CopyIcon from 'src/components/ui/copy_icon'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'
import { defaultChainId } from 'src/constants/chains'
import { GetApplicationDetailsQuery, useGetApplicationDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { ChainInfo, CustomField } from 'src/types'
import { formatAmount, getCustomFields, getFieldString, getFieldStrings, getFormattedDateFromUnixTimestampWithYear, truncateStringFromMiddle } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getChainInfo } from 'src/utils/tokenUtils'

type Proposal = {
    name: string
	applicantName: string
	applicantAddress: string
	applicantEmail: string
	createdAt: string
	links: {link: string}[]
	details: string
	goals: string
	milestones: {id: string, title: string, amount: string}[]
	fundingBreakdown: string
	teamMembers: string[]
	memberDetails: string[]
    customFields: CustomField[]
	token: ChainInfo['supportedCurrencies'][string]
}

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
				bg='blue' />
		</Flex>

	)

	const router = useRouter()

	const [proposalId, setProposalId] = useState<string>()
	const [chainId, setChainId] = useState<SupportedChainId>(defaultChainId)

	const [proposal, setProposal] = useState<Proposal>()

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
			name: getFieldString(application, 'projectName'),
			applicantName: getFieldString(application, 'applicantName'),
			applicantAddress: getFieldString(application, 'applicantAddress') ?? application.applicantId,
			applicantEmail: getFieldString(application, 'applicantEmail'),
			createdAt: getFormattedDateFromUnixTimestampWithYear(application.createdAtS)!,
			links: getFieldStrings(application, 'projectLinks'),
			details: projectDetails,
			goals: getFieldString(application, 'projectGoals'),
			milestones: application.milestones.map((milestone) => ({
				id: milestone.id,
				title: milestone.title,
				amount: milestone.amount
			}))!,
			fundingBreakdown: getFieldString(application, 'fundingBreakdown'),
			teamMembers: getFieldStrings(application, 'teamMembers'),
			memberDetails: getFieldStrings(application, 'memberDetails'),
			customFields: getCustomFields(application),
			token: chainInfo
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