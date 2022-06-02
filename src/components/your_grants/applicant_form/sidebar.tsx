import React, { useContext, useEffect, useState } from 'react'
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
import { CHAIN_INFO } from 'src/constants/chainInfo'
import { DefaultSupportedChainId } from 'src/constants/chains'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import {
	formatAmount,
	getFormattedFullDateFromUnixTimestamp,
	truncateStringFromMiddle,
} from '../../../utils/formattingUtils'
import { getAssetInfo } from '../../../utils/tokenUtils'
import MailTo from '../mail_to/mailTo'
import ReviewDrawer from '../reviewerDrawer'
import RubricDrawer from '../rubricDrawer'
import RubricSidebar from './rubric_sidebar'

function Sidebar({
	showHiddenData,
	onAcceptApplicationClick,
	onRejectApplicationClick,
	onResubmitApplicationClick,
	applicationData,
}: {
  showHiddenData: () => void;
  onAcceptApplicationClick: () => void;
  onRejectApplicationClick: () => void;
  onResubmitApplicationClick: () => void;
  applicationData: any;
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	const applicantEmail = applicationData?.fields?.find(
		(fld: any) => fld?.id?.split('.')[1] === 'applicantEmail',
	) ? applicationData?.fields?.find(
			(fld: any) => fld?.id?.split('.')[1] === 'applicantEmail',
		)?.values[0]?.value : undefined

	const [rubricDrawerOpen, setRubricDrawerOpen] = useState(false)
	const [maximumPoints, setMaximumPoints] = React.useState(5)
	const [rubricEditAllowed] = useState(true)
	const [rubrics, setRubrics] = useState<any[]>([
		{
			name: '',
			nameError: false,
			description: '',
			descriptionError: false,
		},
	])

	useEffect(() => {
		if(!applicationData) {
			return
		}

		const initialRubrics = applicationData?.grant.rubric
		const newRubrics = [] as any[]
		console.log('initialRubrics', initialRubrics)
		console.log('application Data ', applicationData)
		initialRubrics?.items.forEach((initalRubric: any) => {
			newRubrics.push({
				name: initalRubric.title,
				nameError: false,
				description: initalRubric.details,
				descriptionError: false,
			})
		})
		if(newRubrics.length === 0) {
			return
		}

		setRubrics(newRubrics)
		if(initialRubrics?.items[0].maximumPoints) {
			setMaximumPoints(initialRubrics.items[0].maximumPoints)
		}
	}, [applicationData])

	const [reviewDrawerOpen, setReviewDrawerOpen] = React.useState(false)
	let icon
	let label
	let decimals
	if(applicationData?.grant.reward.token) {
		icon = getUrlForIPFSHash(applicationData.grant.reward.token.iconHash)
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
			applicationData?.grant.reward.asset.toLowerCase()
		]?.decimals
	}

	return (
		<>
			<Flex
				bg="white"
				border="2px solid #D0D3D3"
				borderRadius={8}
				w={340}
				direction="column"
				alignItems="stretch"
				px="28px"
				py="22px"
			>
				<Heading
					fontSize="16px"
					fontWeight="400"
					color="#414E50"
					lineHeight="26px"
					fontStyle="normal"
				>
          Application Details
				</Heading>
				<Flex
					direction="row"
					justify="start"
					w="full"
					mt={6}
					align="center">
					<Image
						h="45px"
						w="45px"
						src={icon}
					/>
					<Box mx={3} />
					<Tooltip label={applicationData?.applicantId}>
						<Heading
							variant="applicationHeading"
							color="brand.500">
							{truncateStringFromMiddle(applicationData?.applicantId)}
						</Heading>
					</Tooltip>
					<Box mr={4} />
					<CopyIcon text={applicationData?.applicantId} />
				</Flex>
				<Box my={4} />
				<Flex
					direction="row"
					justify="space-between"
					w="full"
					align="center">
					<Text
						variant="applicationText"
						lineHeight="32px">
            Name
					</Text>
					<Heading
						variant="applicationHeading"
						lineHeight="32px">
						{
							applicationData?.fields?.find(
								(fld: any) => fld?.id?.split('.')[1] === 'applicantName',
							)?.values[0]?.value
						}
					</Heading>
				</Flex>
				<Flex
					direction="row"
					justify="space-between"
					w="full"
					align="center">
					<Text
						variant="applicationText"
						lineHeight="32px">
            Email
					</Text>
					<Heading
						variant="applicationHeading"
						lineHeight="32px">
						{
							applicationData?.fields?.find(
								(fld: any) => fld?.id?.split('.')[1] === 'applicantEmail',
							) ? (
									<>
										{
											applicationData?.fields?.find(
												(fld: any) => fld?.id?.split('.')[1] === 'applicantEmail',
											)?.values[0]?.value
										}
										<MailTo applicantEmail={applicantEmail} />
									</>
								) : (
									<Heading
										variant="applicationHeading"
										lineHeight="32px"
										onClick={showHiddenData}
										cursor="pointer"
									>
                  Hidden
										{' '}
										<Text
											color="#6200EE"
											display="inline">
                    View
										</Text>
									</Heading>
								)
						}
					</Heading>
				</Flex>
				<Flex
					direction="row"
					justify="space-between"
					w="full"
					align="center">
					<Text
						variant="applicationText"
						lineHeight="32px">
            Sent On
					</Text>
					<Heading
						variant="applicationHeading"
						lineHeight="32px">
						{getFormattedFullDateFromUnixTimestamp(applicationData?.createdAtS)}
					</Heading>
				</Flex>
				<Flex
					direction="column"
					w="full"
					align="start"
					mt={4}>
					<Box
						// variant="dashed"
						border="1px dashed #A0A7A7"
						h={0}
						w="100%"
						m={0}
					/>
					<Text
						fontSize="10px"
						mt={6}
						lineHeight="12px">
            FUNDING REQUESTED
					</Text>
					<Text
						fontSize="20px"
						lineHeight="40px"
						fontWeight="500"
						fontStyle="normal"
						color="#122224"
					>
						{
							applicationData
              && formatAmount(
              	applicationData?.fields?.find(
              		(fld: any) => fld?.id?.split('.')[1] === 'fundingAsk',
              	)?.values[0]?.value ?? '0',
              	decimals ?? 18,
              )
						}
						{' '}
						{label}
					</Text>
					<Box
						// variant="dashed"
						border="1px dashed #A0A7A7"
						h={0}
						w="100%"
						mt="17px"
						mb={0}
					/>
				</Flex>
				<Button
					onClick={() => onAcceptApplicationClick()}
					variant="primary"
					mt={7}
					display={applicationData?.state === 'submitted' ? '' : 'none'}
				>
          Approve Application
				</Button>
				<Button
					onClick={() => onAcceptApplicationClick()}
					variant="primary"
					mt={7}
					disabled={applicationData?.state === 'resubmit'}
					display={applicationData?.state === 'resubmit' ? '' : 'none'}
				>
          Accept Application
				</Button>
				<Text
					mt={7}
					fontSize="sm"
					lineHeight="4"
					align="center"
					color="#717A7C"
					display={applicationData?.state === 'resubmit' ? '' : 'none'}
				>
          This application has been asked for resubmission. The applicant has been
          notified to resubmit.
				</Text>
				<Button
					onClick={() => onResubmitApplicationClick()}
					variant="resubmit"
					mt={4}
					display={applicationData?.state === 'submitted' ? '' : 'none'}
				>
          Ask to Resubmit
				</Button>
				<Button
					onClick={() => onRejectApplicationClick()}
					variant="reject"
					mt={4}
					display={applicationData?.state === 'submitted' ? '' : 'none'}
				>
          Reject Application
				</Button>
			</Flex>

			<Box mt={8} />

			<RubricSidebar
				total={
					applicationData
						?.reviewers.length ?? 0
				}
				reviews={applicationData?.reviews}
				rubric={applicationData?.grant.rubric}
			/>

			{
				!applicationData?.reviews || applicationData?.reviews.length === 0 ? null : (
					<Box mt={8} />
				)
			}

			<Flex
				bg="white"
				border="2px solid #D0D3D3"
				borderRadius={8}
				w={340}
				direction="column"
				alignItems="stretch"
				px="28px"
				py="22px"
			>
				<Flex direction="column">
					<Text fontWeight="700">
Application Reviewers
					</Text>
					<Text mt={2}>
Assign reviewers for application
					</Text>
					<Button
						mt={4}
						onClick={() => setReviewDrawerOpen(true)}>
						<Text fontWeight="700">
Assign Reviewers
						</Text>
					</Button>
				</Flex>

				<Flex direction="column">
					<Text
						mb="14px"
						fontWeight="700" />
					{
						applicationData
							?.reviewers
							?.map((r: any) => ({
								email: r.email,
								address: r.id.split('.')[1],
							})).map((reviewer: any) => (
								<Flex
									key={reviewer.email}
									w="100%"
									h="64px"
									align="center"
									mt={2}
									py={3}
								>
									<Image src="/ui_icons/reviewer_account.svg" />
									<Flex
										direction="column"
										ml={4}
										justifyContent="center">
										<Text
											fontWeight="700"
											color="#122224"
											fontSize="14px"
											lineHeight="16px"
										>
											{truncateStringFromMiddle(reviewer.address)}
										</Text>
										<Text
											mt={reviewer.email ? 1 : 0}
											color="#717A7C"
											fontSize="12px"
											lineHeight="16px">
											{reviewer.email}
										</Text>
									</Flex>
								</Flex>
							))
					}
				</Flex>
			</Flex>

			<ReviewDrawer
				reviewDrawerOpen={reviewDrawerOpen}
				setReviewDrawerOpen={setReviewDrawerOpen}
				grantAddress={applicationData?.grant.id}
				chainId={chainId}
				workspaceId={applicationData?.grant.workspace.id}
				initialReviewers={applicationData?.reviewers}
				reviews={applicationData?.reviews}
				applicationId={applicationData?.id}
				onClose={() => setReviewDrawerOpen(false)}
			/>

			<Flex
				bg="white"
				border="2px solid #D0D3D3"
				borderRadius={8}
				w={340}
				direction="column"
				alignItems="stretch"
				px="28px"
				py="22px"
				mt={8}
			>
				<Flex direction="column">
					<Flex
						mb={
							applicationData?.grant?.rubric && applicationData
								?.grant
								?.rubric
								.items.length > 0 ? '14px' : '0'
						}
						alignItems="center"
					>
						<Text
							mr="auto"
							fontWeight="700">
Evaluation Rubric
						</Text>
						<Text
							color="#8850EA"
							fontWeight="700"
							cursor="pointer"
							fontSize="12px"
							onClick={() => setRubricDrawerOpen(true)}
						>
							{
								applicationData?.grant?.rubric && applicationData
									?.grant
									?.rubric
									.items.length > 0 ? 'Edit' : 'Add'
							}
						</Text>
					</Flex>
					{
						applicationData?.grant?.rubric && applicationData
							?.grant
							?.rubric
							.items.map((r: any) => ({
								title: r.title,
								description: r.details,
							})).map((rubric: any) => (
								<>
									<Text
										mt={2}
										fontWeight="700"
										color="#122224"
										fontSize="14px">
										{rubric.title}
									</Text>
									<Text
										color="#717A7C"
										fontSize="12px">
										{rubric.description}
									</Text>
								</>
							))
					}
				</Flex>
			</Flex>

			<Box mb={8} />

			<RubricDrawer
				rubricDrawerOpen={rubricDrawerOpen}
				setRubricDrawerOpen={setRubricDrawerOpen}
				rubricEditAllowed={rubricEditAllowed}
				rubrics={rubrics}
				setRubrics={setRubrics}
				maximumPoints={maximumPoints}
				setMaximumPoints={setMaximumPoints}
				chainId={getSupportedChainIdFromWorkspace(workspace) ?? DefaultSupportedChainId}
				grantAddress={applicationData?.grant.id}
				workspaceId={workspace?.id ?? ''}
				initialIsPrivate={applicationData?.grant.rubric?.isPrivate ?? false}
			/>
		</>
	)
}

export default Sidebar
