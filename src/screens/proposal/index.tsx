import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Box, Flex, Heading, Image, Link, Spacer, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CopyIcon from 'src/components/ui/copy_icon'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import { useGetApplicationDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { formatAmount, getFieldString, getFormattedDateFromUnixTimestampWithYear, truncateStringFromMiddle } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'

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
					{projectName}
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
							{' '}
							{applicantName}
							{' '}
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
							{' '}
							{applicantAddress ? truncateStringFromMiddle(applicantAddress) : truncateStringFromMiddle(proposalData?.applicantId!)}
							{' '}
						</Text>
						<CopyIcon text={applicantAddress ?? proposalData?.applicantId} />
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
						<CopyIcon text={applicantEmail} />
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
							{getFormattedDateFromUnixTimestampWithYear(proposalData?.createdAtS!)}
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
					<Box display={projectLink.length > 0 ? '' : 'none'}>
						<Heading
							variant='applicationHeading'>
							Links
						</Heading>
						{
							projectLink.map(({ link }) => (
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
								decodedDetails ? (
									<TextViewer
										text={decodedDetails}
									/>
								) : null
							}

						</Text>
					</Box>

					{/* Project Goals */}
					<Box display={projectGoals && projectGoals !== '' ? '' : 'none'}>
						<Heading variant='applicationHeading'>
							Project Goals
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{projectGoals}
						</Text>
					</Box>

					{/* Project Milestones */}
					<Box display={projectMilestones.length ? '' : 'none'}>
						<Heading variant='applicationHeading'>
							Project Milestones
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{' '}
							{
								projectMilestones.map((milestone: any, index: number) => (
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
												src={icon}
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
														milestone?.amount && proposalData
                                                        && formatAmount(
                                                        	milestone?.amount,
                                                        	decimal,
                                                        )
													}
													{' '}
													{label}
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
							memberDetails.map((memberDetail: any, index: number) => (
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
						display={customFields.length > 0 ? '' : 'none'}
						mt={10}>
						<Heading
							variant='applicationHeading'>
							Additional Info
						</Heading>

						{
							customFields.map((customField: any, index: number) => (
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
	const [chainId, setChainId] = useState<SupportedChainId>()

	const [projectName, setProjectName] = useState('')
	const [projectLink, setProjectLink] = useState<any[]>([])
	const [projectGoals, setProjectGoals] = useState('')
	const [projectMilestones, setProjectMilestones] = useState<any[]>([])
	const [decodedDetails, setDecodedDetails] = useState('')

	const [applicantName, setApplicantName] = useState('')
	const [applicantAddress, setApplicantAddress] = useState('')
	const [applicantEmail, setApplicantEmail] = useState('')

	const [fundingBreakdown, setFundingBreakdown] = useState('')
	const [teamMembers, setTeamMembers] = useState('')
	const [memberDetails, setMemberDetails] = useState<any[]>([])
	const [customFields, setCustomFields] = useState<any[]>([])
	const [decimal, setDecimal] = useState<number>()
	const [label, setLabel] = useState<string>()
	const [icon, setIcon] = useState<string>()

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
		chains: [chainId ?? defaultChainId]
	})

	useEffect(() => {
		fetchMore({ applicationID: proposalId }, true)
	}, [proposalId, chainId])

	const proposalData = useMemo(() => {
		return results[0]?.grantApplication
	}, [results])

	useEffect(() => {
		logger.info({ proposalData }, 'Proposal Data')

		if(!proposalData) {
			return
		}

		if(proposalData?.grant.reward.token) {
			setLabel(proposalData.grant.reward.token.label)
			setIcon(proposalData.grant.reward.token.iconHash)
		} else {
			setLabel(getAssetInfo(
				proposalData?.grant?.reward?.asset,
				chainId,
			)?.label)
			setIcon(getAssetInfo(
				proposalData?.grant?.reward?.asset,
				chainId,
			)?.icon)
		}

		setProjectName(getFieldString(proposalData, 'projectName'))
		setProjectLink(
			proposalData?.fields
				?.find((fld: any) => fld?.id?.split('.')[1] === 'projectLink')
				?.values.map((val) => ({ link: val.value })) || [],
		)

		const projectDetailsTemp = getFieldString(proposalData, 'projectDetails')
		if(projectDetailsTemp.startsWith('Qm') && projectDetailsTemp.length < 64) {
			getDecodedDetails(projectDetailsTemp)
		} else {
			setDecodedDetails(projectDetailsTemp)
		}

		// console.log(decodedDetails)

		setProjectGoals(getFieldString(proposalData, 'projectGoals'))
		setProjectMilestones(proposalData?.milestones || [])
		setFundingBreakdown(getFieldString(proposalData, 'fundingBreakdown'))
		setTeamMembers(getFieldString(proposalData, 'teamMembers'))
		setMemberDetails(
			proposalData?.fields
				?.find((fld: any) => fld?.id?.split('.')[1] === 'memberDetails')
				?.values.map((val) => val.value) || [],
		)
		if(proposalData.grant.reward.token) {
			setDecimal(proposalData.grant.reward.token.decimal)
		} else {
			setDecimal(CHAIN_INFO[
				getSupportedChainIdFromSupportedNetwork(
					proposalData.grant.workspace.supportedNetworks[0],
				)
			]?.supportedCurrencies[proposalData.grant.reward.asset.toLowerCase()]
				?.decimals)
		}

		setApplicantName(getFieldString(proposalData, 'applicantName'))
		setApplicantAddress(getFieldString(proposalData, 'applicantAddress'))
		setApplicantEmail(getFieldString(proposalData, 'applicantEmail'))

		if(proposalData.fields.length > 0) {
			setCustomFields(proposalData.fields
				.filter((field: any) => (field.id.split('.')[1].startsWith('customField')))
				.map((field: any) => {
					const i = field.id.indexOf('-')
					return ({
						title: field.id.substring(i + 1).split('\\s').join(' '),
						value: field.values[0].value,
						isError: false,
					})
				}))
		}
	}, [proposalData])

	const getDecodedDetails = async(detailsHash: string) => {
		// console.log(detailsHash)
		const d = await getFromIPFS(detailsHash)
		setDecodedDetails(d)
	}


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