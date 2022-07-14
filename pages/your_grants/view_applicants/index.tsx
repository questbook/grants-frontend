import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Flex, Heading, Image, Text, HStack } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import moment from 'moment'
import { useRouter } from 'next/router'
import Modal from 'src/components/ui/modal'
import AppplicationTableEmptyState from 'src/components/your_applications/empty_states/applications_table'
import GrantStatsBox from 'src/components/your_grants/grantStatsBox'
import RubricDrawer from 'src/components/your_grants/rubricDrawer'
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters'
import ChangeAccessibilityModalContent from 'src/components/your_grants/yourGrantCard/changeAccessibilityModalContent'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import {
	useGetApplicantsForAGrantQuery,
	useGetApplicantsForAGrantReviewerQuery,
	useGetFundSentDisburseforGrantQuery,
	useGetGrantDetailsQuery,
} from 'src/generated/graphql'
import useArchiveGrant from 'src/hooks/useArchiveGrant'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { ApplicationMilestone } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useAccount } from 'wagmi'
import Breadcrumbs from '../../../src/components/ui/breadcrumbs'
import Table from '../../../src/components/your_grants/view_applicants/table'
import NavbarLayout from '../../../src/layout/navbarLayout'
import { formatAmount } from '../../../src/utils/formattingUtils'
import { ApiClientsContext } from '../../_app'

const PAGE_SIZE = 500

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
	let val = BigNumber.from(0)
	milestones.forEach((milestone) => {
		val = val.add(milestone.amountPaid)
	})
	return val
}

function ViewApplicants() {
	const [applicantsData, setApplicantsData] = useState<any>([])
	const [reviewerData, setReviewerData] = useState<any>([])
	const [daoId, setDaoId] = useState('')
	const [grantID, setGrantID] = useState<any>(null)
	const [acceptingApplications, setAcceptingApplications] = useState(true)
	const [shouldShowButton, setShouldShowButton] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
	const [isReviewer, setIsReviewer] = React.useState<boolean>(false)
	const [isUser, setIsUser] = React.useState<any>('')
	const [isActorId, setIsActorId] = React.useState<any>('')
	const [totalDisbursed, setTotalDisbursed] = useState(0)
	const [rewardTokenDecimals, setRewardTokenDecimals] = useState(18)
	const [grantTitle, setGrantTitle] = useState('Grant Title')
	const [applicationsFilter, setApplicationsFilter] = useState('Accepted')

	const { data: accountData } = useAccount()
	const router = useRouter()
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

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
		if(router && router.query) {
			const { grantId: gId } = router.query
			setGrantID(gId)
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
      ].client,
	})

	const [queryReviewerParams, setQueryReviewerParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
      ].client,
	})

	const [queryFundsParams, setQueryFundsParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
      ].client,
	})

	useEffect(() => {
		if(
			workspace &&
      workspace.members &&
      workspace.members.length > 0 &&
      accountData &&
      accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase()
			)
			console.log(tempMember)
			setIsAdmin(
				tempMember?.accessLevel === 'admin' ||
          tempMember?.accessLevel === 'owner'
			)

			setIsReviewer(tempMember?.accessLevel === 'reviewer')
			setIsUser(tempMember?.id)
			setIsActorId(tempMember?.id)
		}
	}, [accountData, workspace])

	useEffect(() => {
		if(!workspace) {
			return
		}

		if(!grantID) {
			return
		}

		console.log('Grant ID: ', grantID)
		console.log('isUser: ', isUser)
		if(isAdmin) {
			setQueryParams({
				client:
          subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
				variables: {
					grantID,
					first: PAGE_SIZE,
					skip: 0,
				},
			})

			setQueryFundsParams({
				client:
          subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
				variables: {
					grantID,
				},
			})
		}

		if(isReviewer) {
			console.log('reviewer', isUser)
			setQueryReviewerParams({
				client:
          subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
				variables: {
					grantID,
					reviewerIDs: [isUser],
					first: PAGE_SIZE,
					skip: 0,
				},
			})
		}
	}, [workspace, grantID, isUser])

	const { data, error, loading } = useGetApplicantsForAGrantQuery(queryParams)
	const { data: grantData } = useGetGrantDetailsQuery(queryParams)
	const { data: fundsDisbursed } = useGetFundSentDisburseforGrantQuery(queryFundsParams)

	useEffect(() => {
		if(data && data.grantApplications.length) {
			const fetchedApplicantsData = data.grantApplications.map((applicant) => {
				const getFieldString = (name: string) => applicant.fields.find((field) => field?.id?.includes(`.${name}`))
					?.values[0]?.value
				let decimal
				let label
				let icon
				if(grantData?.grants[0].reward.token) {
					decimal = grantData?.grants[0].reward.token.decimal
					label = grantData?.grants[0].reward.token.label
					icon = getUrlForIPFSHash(grantData?.grants[0].reward.token.iconHash)
				} else {
					decimal =
            CHAIN_INFO[
            	getSupportedChainIdFromSupportedNetwork(
            		applicant.grant.workspace.supportedNetworks[0]
            	)
            ]?.supportedCurrencies[applicant.grant.reward.asset.toLowerCase()]
            	?.decimals
					label = getAssetInfo(
						applicant?.grant?.reward?.asset?.toLowerCase(),
						getSupportedChainIdFromWorkspace(workspace)
					).label
					icon = getAssetInfo(
						applicant?.grant?.reward?.asset?.toLowerCase(),
						getSupportedChainIdFromWorkspace(workspace)
					).icon
				}

				setRewardTokenDecimals(decimal)
				return {
					grantTitle: applicant?.grant?.title,
					applicationId: applicant.id,
					applicant_address: applicant.applicantId,
					sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
					updated_on: moment.unix(applicant.updatedAtS).format('DD MMM YYYY'),
					// applicant_name: getFieldString('applicantName'),
					project_name: getFieldString('projectName'),
					funding_asked: {
						// amount: formatAmount(
						//   getFieldString('fundingAsk') ?? '0',
						// ),
						amount:
              applicant && getFieldString('fundingAsk')
              	? formatAmount(getFieldString('fundingAsk')!, decimal ?? 18)
              	: '1',
						symbol: label,
						icon,
					},
					// status: applicationStatuses.indexOf(applicant?.state),
					status: TableFilters[applicant?.state],
					reviewers: applicant.reviewers,
					amount_paid: formatAmount(
						getTotalFundingRecv(
              applicant.milestones as unknown as ApplicationMilestone[]
						).toString(),
						decimal ?? 18
					),
				}
			})

			console.log('fetch', fetchedApplicantsData)

			setApplicantsData(fetchedApplicantsData)
			setGrantTitle(applicantsData[0]?.grantTitle)
			setDaoId(data.grantApplications[0].grant.workspace.id)
			setAcceptingApplications(
				data.grantApplications[0].grant.acceptingApplications
			)
		}
	}, [data, error, loading, grantData])

	useEffect(() => {
		console.log('Review params: ', queryReviewerParams)
	}, [queryReviewerParams])

	const reviewData =
    useGetApplicantsForAGrantReviewerQuery(queryReviewerParams)

	const Reviewerstatus = (item: any) => {
		const user = []
		// eslint-disable-next-line no-restricted-syntax
		for(const n in item) {
			if(item[n].reviewer.id === isActorId) {
				user.push(isActorId)
			}
		}

		if(user.length === 1) {
			return 9
		}

		return 0
	}

	useEffect(() => {
		console.log('Raw reviewer data: ', reviewData)
		if(reviewData.data && reviewData.data.grantApplications.length) {
			console.log('Reviewer Applications: ', reviewData.data)
			const fetchedApplicantsData = reviewData.data.grantApplications.map(
				(applicant) => {
					const getFieldString = (name: string) => applicant.fields.find((field) => field?.id?.includes(`.${name}`))
						?.values[0]?.value
					return {
						grantTitle: applicant?.grant?.title,
						applicationId: applicant.id,
						applicant_address: applicant.applicantId,
						sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
						project_name: getFieldString('projectName'),
						funding_asked: {
							// amount: formatAmount(
							//   getFieldString('fundingAsk') ?? '0',
							// ),
							amount:
                applicant && getFieldString('fundingAsk')
                	? formatAmount(
                      getFieldString('fundingAsk')!,
                      CHAIN_INFO[
                      	getSupportedChainIdFromSupportedNetwork(
                      		applicant.grant.workspace.supportedNetworks[0]
                      	)
                      ]?.supportedCurrencies[
                      	applicant.grant.reward.asset.toLowerCase()
                      ]?.decimals ?? 18
                	)
                	: '1',
							symbol: getAssetInfo(
								applicant?.grant?.reward?.asset?.toLowerCase(),
								getSupportedChainIdFromWorkspace(workspace)
							).label,
							icon: getAssetInfo(
								applicant?.grant?.reward?.asset?.toLowerCase(),
								getSupportedChainIdFromWorkspace(workspace)
							).icon,
						},
						// status: applicationStatuses.indexOf(applicant?.state),
						status: Reviewerstatus(applicant.reviews),
						reviewers: applicant.reviewers,
					}
				}
			)

			console.log('fetch', fetchedApplicantsData)

			setReviewerData(fetchedApplicantsData)
			setDaoId(reviewData.data.grantApplications[0].grant.workspace.id)
			setAcceptingApplications(
				reviewData.data.grantApplications[0].grant.acceptingApplications
			)
		}
	}, [reviewData])

	// const { data: grantData } = useGetGrantDetailsQuery(queryParams);
	useEffect(() => {
		console.log('grantData', grantData)
		const initialRubrics = grantData?.grants[0].rubric
		const newRubrics = [] as any[]
		console.log('initialRubrics', initialRubrics)
		initialRubrics?.items.forEach((initalRubric) => {
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
	}, [grantData])

	useEffect(() => {
		const total = fundsDisbursed?.fundsTransfers.reduce(
			(sum, { amount }) => sum + parseInt(amount), 0
		)
		if(total) {
			setTotalDisbursed(total / (10 ** rewardTokenDecimals))
		}
	}, [fundsDisbursed])

	useEffect(() => {
		setShouldShowButton(daoId === workspace?.id)
	}, [workspace, accountData, daoId])

	const [isAcceptingApplications, setIsAcceptingApplications] = React.useState<
    [boolean, number]
  >([acceptingApplications, 0])

	useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])
	}, [acceptingApplications])

	const [transactionData, txnLink, archiveGrantLoading, archiveGrantError] =
    useArchiveGrant(
    	isAcceptingApplications[0],
    	isAcceptingApplications[1],
    	grantID
    )

	const buttonRef = React.useRef<HTMLButtonElement>(null)

	const { setRefresh } = useCustomToast(txnLink)
	useEffect(() => {
		// console.log(transactionData);
		if(transactionData) {
			setIsModalOpen(false)
			setRefresh(true)
		}
	}, [transactionData])

	React.useEffect(() => {
		setIsAcceptingApplications([acceptingApplications, 0])
	}, [archiveGrantError])

	React.useEffect(() => {
		console.log('Is Accepting Applications: ', isAcceptingApplications)
	}, [isAcceptingApplications])

	return (
		<Container
			maxW="100%"
			display="flex"
			px="70px"
			mb="300px">
			<Container
				flex={1}
				display="flex"
				flexDirection="column"
				maxW="1116px"
				alignItems="stretch"
				pb={8}
				px={10}
				pos="relative"
			>
				<Breadcrumbs path={['Grants & Bounties', 'View Applicants']} />
				<Flex ml="-50px">
					<Box p='2'>
						<Heading size='md'>
							{grantTitle}
						</Heading>
					</Box>
				</Flex>
				<GrantStatsBox
					numberOfApplicants={applicantsData.length}
		  totalDisbursed={totalDisbursed}
				/>
				<Box>
				<Flex>
					<HStack spacing="14px">
					<Button w="128px" h="28px" variant="primaryV2" onClick= {() => setApplicationsFilter('Accepted')} >
						Accepted
					</Button>
					<Button w="128px" h="28px" variant="primaryV2" onClick= {() => setApplicationsFilter('In Review')} >
						In Review
					</Button>
					<Button w="128px" h="28px" variant="primaryV2" onClick= {() => setApplicationsFilter('Rejected')}>
						Rejected
					</Button>
					</HStack>
					</Flex>
				</Box>
				<RubricDrawer
					rubricDrawerOpen={rubricDrawerOpen}
					setRubricDrawerOpen={setRubricDrawerOpen}
					rubricEditAllowed={rubricEditAllowed}
					rubrics={rubrics}
					setRubrics={setRubrics}
					maximumPoints={maximumPoints}
					setMaximumPoints={setMaximumPoints}
					chainId={getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId}
					grantAddress={grantID}
					workspaceId={workspace?.id ?? ''}
					initialIsPrivate={grantData?.grants[0].rubric?.isPrivate ?? false}
				/>

				{
					(reviewerData.length > 0 || applicantsData.length > 0) &&
        (isReviewer || isAdmin) ? (
							<Table
								isReviewer={isReviewer}
								data={applicantsData}
								reviewerData={reviewerData}
								actorId={isActorId}
								applicationsFilter = {applicationsFilter}
								onViewApplicantFormClick={
									(commentData: any) => router.push({
										pathname: '/your_grants/view_applicants/applicant_form/',
										query: {
											commentData,
											applicationId: commentData.applicationId,
										},
									})
								}
								// eslint-disable-next-line @typescript-eslint/no-shadow
								onManageApplicationClick={
									(data: any) => router.push({
										pathname: '/your_grants/view_applicants/manage/',
										query: {
											applicationId: data.applicationId,
										},
									})
								}
								archiveGrantComponent={
									!acceptingApplications && (
										<Flex
											maxW="100%"
											bg="#F3F4F4"
											direction="row"
											align="center"
											px={8}
											py={6}
											mt={6}
											border="1px solid #E8E9E9"
											borderRadius="6px"
										>
											<Image
												src="/toast/warning.svg"
												w="42px"
												h="36px" />
											<Flex
												direction="column"
												ml={6}>
												<Text
													variant="tableHeader"
													color="#414E50">
													{
														shouldShowButton && accountData?.address
															? 'Grant is archived and cannot be discovered on the Home page.'
															: 'Grant is archived and closed for new applications.'
													}
												</Text>
												<Text
													variant="tableBody"
													color="#717A7C"
													fontWeight="400"
													mt={2}
												>
                      New applicants cannot apply to an archived grant.
												</Text>
											</Flex>
											<Box mr="auto" />
											{
												accountData?.address && shouldShowButton && (
													<Button
														ref={buttonRef}
														w={
															archiveGrantLoading
																? buttonRef?.current?.offsetWidth
																: 'auto'
														}
														variant="primary"
														onClick={() => setIsModalOpen(true)}
													>
                      Publish grant
													</Button>
												)
											}
										</Flex>
									)
								}
							/>
						) : (
							<Flex
								direction="column"
								w="100%">
								<AppplicationTableEmptyState />
								{
									isAdmin && (
										<Flex
											direction="column"
											justify="center"
											h="100%"
											align="center"
											mt={10}
											mx="auto"
										>
											<Box
												pos="relative"
												right="40px"
												top="48px">
												<Button
													variant="primaryV2"
													onClick={() => setRubricDrawerOpen(true)}
												>
                    Create scoring rubric
												</Button>
											</Box>
										</Flex>
									)
								}
							</Flex>
						)
				}
			</Container>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title=""
			>
				<ChangeAccessibilityModalContent
					onClose={() => setIsModalOpen(false)}
					imagePath="/illustrations/publish_grant.svg"
					title="Are you sure you want to publish this grant?"
					subtitle="The grant will be live, and applicants can apply for this grant."
					actionButtonText="Publish grant"
					actionButtonOnClick={
						() => {
							console.log('Doing it!')
							console.log(
								'Is Accepting Applications (Button click): ',
								isAcceptingApplications
							)
							setIsAcceptingApplications([
								!isAcceptingApplications[0],
								isAcceptingApplications[1] + 1,
							])
						}
					}
					loading={archiveGrantLoading}
				/>
			</Modal>
		</Container>
	)
}

ViewApplicants.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ViewApplicants
