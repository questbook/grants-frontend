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
	HStack,
	Image,
	Link,
	Text,
} from '@chakra-ui/react'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'
import { CHAIN_INFO } from 'src/constants/chains'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import { GetApplicationDetailsQuery } from 'src/generated/graphql'
import { formatAmount, getFieldString, getRewardAmount } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

interface Props {
  applicationData: GetApplicationDetailsQuery['grantApplication']
}

function Application({ applicationData }: Props) {
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
		icon = applicationData.grant.reward.token.iconHash
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

		setProjectTitle(getFieldString(applicationData, 'projectName'))
		setProjectLink(
			applicationData?.fields
				?.find((fld: any) => fld?.id?.split('.')[1] === 'projectLink')
				?.values.map((val) => ({ link: val.value })) || [],
		)

		const projectDetailsTemp = getFieldString(applicationData, 'projectDetails')
		if(projectDetailsTemp.startsWith('Qm') && projectDetailsTemp.length < 64) {
			getDecodedDetails(projectDetailsTemp)
		} else {
			setDecodedDetails(projectDetailsTemp)
		}

		// console.log(decodedDetails)

		setProjectGoals(getFieldString(applicationData, 'projectGoals'))
		setProjectMilestones(applicationData?.milestones || [])
		setFundingAsk(getFieldString(applicationData, 'fundingAsk'))
		setFundingBreakdown(getFieldString(applicationData, 'fundingBreakdown'))
		setTeamMembers(getFieldString(applicationData, 'teamMembers'))
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
				<HStack
					w='full'
					align='center'
					justify='center'
					borderBottomColor='#E7DAFF'
					borderBottomWidth='1px'
					h={14}
					mb={8}
				>
					<Text
						background='white'
						color='#122224'
						fontSize='1.5rem'
						fontWeight='bold'
					>
						Grant Details
					</Text>
				</HStack>
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
					<Box display={projectLink?.length ? '' : 'none'}>
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
						display={projectMilestones?.length ? '' : 'none'}
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
						</Flex>
					</Box>

					<Box>
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
										&& getRewardAmount(decimal, { fields: applicationData?.fields, milestones: applicationData?.milestones })
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
