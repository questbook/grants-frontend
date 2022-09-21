import { useContext, useEffect, useState } from 'react'
import {
	Box,
	Button,
	Center,
	Flex,
	Grid,
	GridItem,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import {
	ApplicationState,
	GetInitialToBeReviewedApplicationGrantsQuery,
	useGetMoreReviewedApplicationsLazyQuery,
	useGetMoreToBeReviewedApplicationsLazyQuery,
} from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { IReview, IReviewFeedback } from 'src/types'
import {
	getFieldString,
	getFormattedDateFromUnixTimestampWithYear,
	getRewardAmount,
} from 'src/utils/formattingUtils'
import { capitalizeFirstLetter } from 'src/utils/generics'
import logger from 'src/utils/logger'
import { useLoadReview } from 'src/utils/reviews'
import { getAssetInfo } from 'src/utils/tokenUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import PaginatorView from 'src/v2/components/WorkspaceMembers/PaginatorView'

const STATUS_COLORS: { [key in ApplicationState]?: { 'text': string, 'bg': string } } = {
	[ApplicationState.Approved]: {
		'text': '#128994',
		'bg': '#C3EAE3',
	},
	[ApplicationState.Submitted]: {
		'text': '#0F7ABC',
		'bg': '#DCF3FF',
	},
	[ApplicationState.Rejected]: {
		'text': '#C60063',
		'bg': '#FFC6C5',
	},
}

export type InitialApplicationType = GetInitialToBeReviewedApplicationGrantsQuery['grantReviewerCounters'][0]['grant']['applications'][0]

type ReviewType = InitialApplicationType['reviews'][0]

export const APPLICATIONS_TABLE_PAGE_SIZE = 5

type Application = {
  id: string
  submittedOn: number
  grantRubricIsPrivate: boolean | undefined
  state: ApplicationState
  reviews: ReviewType[]
  projectName: string
  reward: string
  applicantId: string
  applicantName: string
  applicantEmail?: string
}

type Props = {
  reviewerId: string
  showToBeReviewedApplications: boolean
  initialApplications?: InitialApplicationType[]
  grant: GetInitialToBeReviewedApplicationGrantsQuery['grantReviewerCounters'][0]['grant']
}


function ApplicationsTable({
	grant,
	reviewerId,
	initialApplications,
	showToBeReviewedApplications,
}: Props) {
	const parseApplication = (application: InitialApplicationType, chainId: SupportedChainId): Application => {
		const decimals = CHAIN_INFO[
			getSupportedChainIdFromSupportedNetwork(
				grant.workspace?.supportedNetworks[0],
			)
		]?.supportedCurrencies[grant.reward!.asset.toLowerCase()]
			?.decimals

		const rewardAmount = getRewardAmount(decimals, application)

		const tokenLabel = getAssetInfo(
			grant?.reward?.asset?.toLowerCase(),
			chainId,
		).label

		return {
			id: application.id,
			submittedOn: application.createdAtS,
			reviews: application.reviews,
			grantRubricIsPrivate: grant?.rubric?.isPrivate,
			reward: `${rewardAmount} ${tokenLabel}`,
			state: application.state,
			applicantId: application.applicantId,
			projectName: getFieldString(application, 'projectName')!,
			applicantEmail: getFieldString(application, 'applicantEmail'),
			applicantName: getFieldString(application, 'applicantName')!,
		}
	}

	const [page, setPage] = useState(0)
	const [applications, setApplications] = useState<Array<Application>>()
	const [hasMoreData, setHasMoreData] = useState(true)

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[chainId]

	const { loadReview } = useLoadReview(grant.id, chainId)

	const TABLE_HEADERS = ['Project Name', 'Funding ask', 'Submitted on']

	if(!showToBeReviewedApplications && !TABLE_HEADERS.includes('Status')) {
		TABLE_HEADERS.push('Status')
	}

	if(!TABLE_HEADERS.includes('Review')) {
		TABLE_HEADERS.push('Review')
	}

	const router = useRouter()

	useEffect(() => {
		if(applications) {
			setHasMoreData(applications!.length >= APPLICATIONS_TABLE_PAGE_SIZE)
		} else {
			setHasMoreData(false)
		}
	}, [applications])

	const variables = {
		reviewerAddress: reviewerId.toLowerCase(),
		reviewerAddressStr: reviewerId,
		grantId: grant.id!,
		first: APPLICATIONS_TABLE_PAGE_SIZE,
		skip: page * APPLICATIONS_TABLE_PAGE_SIZE,
	}
	const moreData = showToBeReviewedApplications ?
		useGetMoreToBeReviewedApplicationsLazyQuery({ client, variables }) :
		useGetMoreReviewedApplicationsLazyQuery({ client, variables })

	useEffect(() => {
		if(page === 0 && initialApplications !== undefined) {
			setApplications(initialApplications.map(
				(application) => (parseApplication(application, chainId)),
			))
		} else {
			(async() => {
				const { data } = await moreData[0]({ client, variables })
				if(data) {
					setApplications(data.grantApplications.map(
						(application) => (parseApplication(application, chainId)),
					))
				}
			})()
		}
	}, [page])

	return (
		<>
			<Text
				fontSize={25}
				fontWeight='bold'>
				{grant.title}
			</Text>
			<Box h={2} />
			<Box
				boxShadow='lg'
				borderRadius={7.5}
				bg='white'
			>
				<Table>
					<Thead>
						<Tr>
							{
								TABLE_HEADERS.map((tableHeader) => (
									<Th
										key={tableHeader}
										fontSize={18}
										fontWeight='bold'
										letterSpacing={-1}
										textTransform='none'
									>
										{tableHeader}
									</Th>
								))
							}
						</Tr>
					</Thead>
					<Tbody>
						{
							applications && applications!.map((application) => (
								<Tr
									key={application.id}
									style={{ cursor: showToBeReviewedApplications ? 'inherit' : 'pointer' }}
									onClick={
										showToBeReviewedApplications ? undefined :
											() => {
												router.push(`/your_grants/view_applicants/applicant_form?applicationId=${application.id}`)
											}
									}
								>
									<Td>
										<Grid>
											<GridItem fontWeight='bold'>
												{application.projectName}
											</GridItem>
											<GridItem color='#9292AF'>
												{`${application.applicantName} • ${application.applicantEmail ?? application.applicantId}`}
											</GridItem>
										</Grid>
									</Td>
									<Td>
										{application.reward}
									</Td>
									<Td>
										{getFormattedDateFromUnixTimestampWithYear(application.submittedOn)}
									</Td>
									{
										!showToBeReviewedApplications && (
											<Td>
												<Flex alignItems='start'>
													<Text
														fontWeight='bold'
														padding='5px 10px'
														borderRadius='5px'
														color={STATUS_COLORS[application.state]?.text}
														bg={STATUS_COLORS[application.state]?.bg}
													>
														{application.state === ApplicationState.Submitted ? 'In review by others' : capitalizeFirstLetter(application.state)}
													</Text>
												</Flex>
											</Td>
										)
									}
									<ReviewTableData
										application={application}
										loadReview={r => loadReview(r, application.id)} />
								</Tr>
							))
						}
					</Tbody>
				</Table>
				{
					applications === undefined ? (
						<Center padding={5}>
							<Loader />
						</Center>
					) : applications!.length === 0 ? (
						<Center padding={5}>
							{`No ${page === 0 ? '' : 'more '}applications!`}
						</Center>
					) : <Box />
				}
			</Box>
			<Box h={2} />
			<Flex
				justifyContent='end'>
				<PaginatorView
					currentPage={page}
					onPageChange={setPage}
					hasMoreData={hasMoreData}
				/>
			</Flex>
		</>
	)
}

type ReviewTableDataProps = {
	application: Application
	loadReview: (r: IReview) => Promise<IReviewFeedback>
}

const ReviewTableData = ({
	application,
	loadReview,
}: ReviewTableDataProps) => {
	const [reviewSum, setReviewSum] = useState<number>()

	const { scwAddress } = useContext(WebwalletContext)!
	const router = useRouter()

	// review, if the logged in reviewer already has added a review
	const userReview = application.reviews.find((r) => (
		r.reviewer?.id.split('.')[1].toLowerCase() === scwAddress?.toLowerCase()
	))

	const loadMyReview = async() => {
		try {
			const data = await loadReview(userReview! as IReview)
			setReviewSum(data.total)
		} catch(err) {
			logger.error({ err, userReview }, 'error in loading self review')
			setReviewSum(0)
		}
	}

	useEffect(() => {
		if(userReview) {
			loadMyReview()
		}
	}, [userReview?.id])

	if(userReview) {
		return (
			<Td>
				<Flex alignItems='start'>
					{reviewSum === undefined ? <Loader /> : reviewSum}
				</Flex>
			</Td>
		)
	} else {
		return (
			<Td>
				<Button
					variant='solid'
					onClick={
						() => {
							router.push(`/your_grants/view_applicants/applicant_form?applicationId=${application.id}`)
						}
					}>
					Review
				</Button>
			</Td>
		)
	}
}


export default ApplicationsTable
