/* eslint-disable react/no-unstable-nested-components */
import React, {
	useContext, useEffect, useRef, useState,
} from 'react'
import Linkify from 'react-linkify'
import {
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	Image,
	Link,
	Text,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'
import { CHAIN_INFO } from 'src/constants/chains'
import { GetApplicationDetailsQuery } from 'src/generated/graphql'
import { formatAmount } from 'src/utils/formattingUtils'
import { getFromIPFS, getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

interface Props {
  applicationData: GetApplicationDetailsQuery['grantApplication']
  showHiddenData: () => void
}

function Application({ applicationData, showHiddenData }: Props) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const refs = [useRef(null), useRef(null), useRef(null), useRef(null)]

	const [projectTitle, setProjectTitle] = useState('')
	const [projectLink, setProjectLink] = useState<any[]>([])
	const [projectGoals, setProjectGoals] = useState('')
	const [projectMilestones, setProjectMilestones] = useState<any[]>([])
	const [fundingAsk, setFundingAsk] = useState('')
	const [fundingBreakdown, setFundingBreakdown] = useState('')
	const [teamMembers, setTeamMembers] = useState('')
	const [memberDetails, setMemberDetails] = useState<any[]>([])
	const [customFields, setCustomFields] = useState<any[]>([])
	const [decimal, setDecimal] = useState<number>()

	const [decodedDetails, setDecodedDetails] = useState('')
	const getDecodedDetails = async(detailsHash: string) => {
		// console.log(detailsHash)
		const d = await getFromIPFS(detailsHash)
		setDecodedDetails(d)
	}

	let icon: string
	let label: string
	let decimals
	if(applicationData?.grant.reward.token) {
		label = applicationData.grant.reward.token.label
		icon = getUrlForIPFSHash(applicationData.grant.reward.token.iconHash)
		decimals = applicationData.grant.reward.token.decimal
	} else {
		label = getAssetInfo(
			applicationData?.grant?.reward?.asset,
			chainId,
		)?.label
		icon = getAssetInfo(
			applicationData?.grant?.reward?.asset,
			chainId,
		)?.icon
	}

	useEffect(() => {
		if(!applicationData) {
			return
		}

		const getStringField = (fieldName: string) => applicationData?.fields?.find(({ id }) => id.split('.')[1] === fieldName)
			?.values[0]?.value || ''
		setProjectTitle(getStringField('projectName'))
		setProjectLink(
			applicationData?.fields
				?.find((fld: any) => fld?.id?.split('.')[1] === 'projectLink')
				?.values.map((val) => ({ link: val.value })) || [],
		)

		const projectDetailsTemp = getStringField('projectDetails')
		if(projectDetailsTemp.startsWith('Qm') && projectDetailsTemp.length < 64) {
			getDecodedDetails(projectDetailsTemp)
		} else {
			setDecodedDetails(projectDetailsTemp)
		}

		// console.log(decodedDetails)

		setProjectGoals(getStringField('projectGoals'))
		setProjectMilestones(applicationData?.milestones || [])
		setFundingAsk(getStringField('fundingAsk'))
		setFundingBreakdown(getStringField('fundingBreakdown'))
		setTeamMembers(getStringField('teamMembers'))
		setMemberDetails(
			applicationData?.fields
				?.find((fld: any) => fld?.id?.split('.')[1] === 'memberDetails')
				?.values.map((val) => val.value) || [],
		)
		if(applicationData.grant.reward.token) {
			setDecimal(applicationData.grant.reward.token.decimal)
		} else {
			setDecimal(CHAIN_INFO[
				getSupportedChainIdFromSupportedNetwork(
					applicationData.grant.workspace.supportedNetworks[0],
				)
			]?.supportedCurrencies[applicationData.grant.reward.asset.toLowerCase()]
				?.decimals)
		}

		if(applicationData.fields.length > 0) {
			setCustomFields(applicationData.fields
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
	}, [applicationData])

	return (
		<>
			<Flex
				mt='8px'
				direction='column'
				w='full'>
				<Divider />
				<Flex
					direction='row'
					w='full'
					justify='space-evenly'
					h={14}
					align='stretch'
					mb={8}
				>
					<Button
						variant='ghost'
						h='54px'
						w='full'
						_hover={
							{
								background: '#F5F5F5',
							}
						}
						_focus={{}}
						borderRadius={0}
						background='white'
						color='#122224'
						borderBottomColor='#E7DAFF'
						borderBottomWidth='1px'
						fontSize='1.5rem'
					>
						Grant Details
					</Button>
				</Flex>
			</Flex>
			<Flex
				direction='column'
				w='full'>
				<Flex
					direction='column'
					w='full'
					mt={4}>
					<Box display={projectTitle && projectTitle !== '' ? '' : 'none'}>
						<Heading
							variant='applicationHeading'
							ref={refs[0]}>
							Project Title
						</Heading>
						<Text
							variant='applicationText'
							mt={2}>
							{projectTitle}
						</Text>
					</Box>
					<Box display={projectLink && projectLink.length ? '' : 'none'}>
						<Heading
							variant='applicationHeading'
							mt={10}>
							Project Link
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

					{/* <Box display={projectDetails && projectDetails !== '' ? '' : 'none'}>
            <Heading variant="applicationHeading" mt={10}>
              Project Details
            </Heading>
            <Text variant="applicationText" mt={2} mb={10}>
              {projectDetails}
            </Text>
          </Box> */}

					<Heading
						variant='applicationHeading'
						mt={10}>
						Project Description
					</Heading>
					<Linkify
						componentDecorator={
							(
								decoratedHref: string,
								decoratedText: string,
								key: number,
							) => (
								<Link
									key={key}
									href={decoratedHref}
									isExternal>
									{decoratedText}
								</Link>
							)
						}
					>
						<Box
							mt={2}
							mb={10}
							fontWeight='400'>
							{
								decodedDetails ? (
									<TextViewer
										text={decodedDetails}
									/>
								) : null
							}
						</Box>
					</Linkify>

					<Box display={projectGoals && projectGoals !== '' ? '' : 'none'}>
						<Heading variant='applicationHeading'>
							Project Goals
						</Heading>
						<Text
							variant='applicationText'
							mt={2}
							mb={10}>
							{projectGoals}
						</Text>
					</Box>

					<Box
						display={projectMilestones && projectMilestones.length ? '' : 'none'}
					>
						<Heading
							variant='applicationHeading'
							ref={refs[1]}>
							Project Milestones
						</Heading>
						<Flex
							direction='column'
							w='full'
							mt={3}
							mb={10}>
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
														milestone?.amount && applicationData
                          && formatAmount(
                          	milestone?.amount,
                          	decimal || 18,
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
						</Flex>
					</Box>

					<Box display={fundingAsk && fundingAsk !== '' ? '' : 'none'}>
						<Heading variant='applicationHeading'>
							Funding & Budget Breakdown
						</Heading>
						<Flex
							direction='row'
							justify='start'
							mt={3}
							mb={10}>
							<Image
								boxSize='48px'
								src={icon}
							/>
							<Box ml={2} />
							<Flex
								direction='column'
								justify='center'
								align='start'>
								<Heading variant='applicationHeading'>
									Total funding asked
								</Heading>
								<Text
									variant='applicationText'
									color='brand.500'>
									{
										applicationData
                    && fundingAsk && fundingAsk !== '' && formatAmount(
                    	fundingAsk,
                    	decimals || 18,
										)
									}
									{' '}
									{label}
								</Text>
							</Flex>
						</Flex>
					</Box>

					<Box
						display={fundingBreakdown && fundingBreakdown !== '' ? '' : 'none'}
					>
						<Heading variant='applicationHeading'>
							Funding Breakdown
						</Heading>
						<Text
							variant='applicationText'
							mb={10}>
							{fundingBreakdown}
						</Text>
					</Box>

					<Box display={teamMembers ? '' : 'none'}>
						<Heading
							variant='applicationHeading'
							ref={refs[2]}>
							About Team
						</Heading>
						<Heading
							variant='applicationHeading'
							mt={4}>
							Team Members -
							{' '}
							<Heading
								variant='applicationHeading'
								color='brand.500'
								display='inline-block'
							>
								{teamMembers}
							</Heading>
						</Heading>
						{
							!!memberDetails?.length ? (
								memberDetails.map((memberDetail: any, index: number) => (
									<Box key={index}>
										<Heading
											variant='applicationHeading'
											color='brand.500'
											mt={5}
										>
											Member
											{' '}
											{index + 1}
										</Heading>
										<Text
											variant='applicationText'
											mt={2}>
											{memberDetail}
										</Text>
									</Box>
								))
							) : (
								<Box
									backdropBlur='base'
									border='1px'
									borderColor='#D0D3D3'
									rounded='md'
									py='5'
									mt='2'
									display='flex'
									justifyContent='center'
								>
									<Flex
										direction='column'
										justifyContent='center'
										alignItems='center'
										maxW='480px'
									>
										<Image
											h='77px'
											w='89px'
											src='/illustrations/disburse_grants.svg' />
										<Text
											textAlign='center'
											variant='applicationText'
											mt={2}>
											Team member details are hidden, and can be viewed only if
											you have specific access.
										</Text>
										<Button
											onClick={showHiddenData}
											variant='primary'
											mt={7}
											w='269px'
										>
											View Details
										</Button>
									</Flex>
								</Box>
							)
						}
					</Box>

					<Box
						mt={12}
						display={customFields.length > 0 ? '' : 'none'}>
						<Heading
							variant='applicationHeading'
							ref={refs[3]}>
							Add Custom Field
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
				<Box my={10} />
			</Flex>
		</>
	)
}

export default Application
