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
import { useAccount } from 'wagmi'
import { ApiClientsContext } from '../../../../../pages/_app'
import Loader from '../../../../components/ui/loader'
import { CHAIN_INFO, defaultChainId } from '../../../../constants/chains'
import {
	ApplicationState,
	GetInitialToBeReviewedApplicationGrantsQuery,
	useGetMoreReviewedApplicationsLazyQuery,
	useGetMoreToBeReviewedApplicationsLazyQuery,
} from '../../../../generated/graphql'
import SupportedChainId from '../../../../generated/SupportedChainId'
import useEncryption from '../../../../hooks/utils/useEncryption'
import { formatAmount, getFormattedDateFromUnixTimestampWithYear } from '../../../../utils/formattingUtils'
import { capitalizeFirstLetter } from '../../../../utils/generics'
import { getFromIPFS } from '../../../../utils/ipfsUtils'
import { getAssetInfo } from '../../../../utils/tokenUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from '../../../../utils/validationUtils'
import PaginatorView from '../../WorkspaceMembers/PaginatorView'

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

type InitialApplicationType = GetInitialToBeReviewedApplicationGrantsQuery['grantReviewerCounters'][0]['grant']['applications'][0]

type ReviewType = InitialApplicationType['reviews'][0]

export const APPLICATIONS_TABLE_PAGE_SIZE = 5

type Application = {
  id: string,
  submittedOn: number,
  grantRubricIsPrivate: boolean | undefined,
  state: ApplicationState,
  reviews: ReviewType[],
  projectName: string,
  reward: string,
  applicantId: string,
  applicantName: string,
  applicantEmail?: string,
}

type Props = {
  reviewerId: string,
  showToBeReviewedApplications: boolean,
  initialApplications?: InitialApplicationType[],
  grant: GetInitialToBeReviewedApplicationGrantsQuery['grantReviewerCounters'][0]['grant'],
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
			?.decimals || 18

		const getFieldString = (name: string) => application.fields.find((field) => field?.id?.includes(`.${name}`))?.values[0]?.value

		let rewardAmount: number

		const fundingAskField = getFieldString('fundingAsk')
		if(fundingAskField) {
			rewardAmount = +formatAmount(fundingAskField, decimals)
		} else {
			rewardAmount = 0
			application.milestones.forEach(
				(milestone) => rewardAmount += +formatAmount(
					milestone.amount,
					decimals,
				))
		}

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
			projectName: getFieldString('projectName')!,
			applicantEmail: getFieldString('applicantEmail'),
			applicantName: getFieldString('applicantName')!,
		}
	}

	const [page, setPage] = useState(0)
	const [applications, setApplications] = useState<Array<Application>>()
	const [hasMoreData, setHasMoreData] = useState(true)

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[chainId]

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
				fontWeight={'bold'}>
				{grant.title}
			</Text>
			<Box h={2} />
			<Box
				boxShadow={'lg'}
				borderRadius={7.5}
				bg={'white'}
			>
				<Table>
					<Thead>
						<Tr>
							{
								TABLE_HEADERS.map((tableHeader) => (
									<Th
										key={tableHeader}
										fontSize={18}
										fontWeight={'bold'}
										letterSpacing={-1}
										textTransform={'none'}
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
											<GridItem fontWeight={'bold'}>
												{application.projectName}
											</GridItem>
											<GridItem color={'#9292AF'}>
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
												<Flex alignItems={'start'}>
													<Text
														fontWeight={'bold'}
														padding={'5px 10px'}
														borderRadius={'5px'}
														color={STATUS_COLORS[application.state]?.text}
														bg={STATUS_COLORS[application.state]?.bg}
													>
														{application.state === ApplicationState.Submitted ? 'In review by others' : capitalizeFirstLetter(application.state)}
													</Text>
												</Flex>
											</Td>
										)
									}
									<ReviewTableData application={application} />
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
				justifyContent={'end'}>
				<PaginatorView
					currentPage={page}
					onPageChange={setPage}
					hasMoreData={hasMoreData}
				/>
			</Flex>
		</>
	)
}

const ReviewTableData = ({ application }: { application: Application }) => {
	const [reviewSum, setReviewSum] = useState<number>()

	const { decryptMessage } = useEncryption()
	const { data: accountData } = useAccount()
	const router = useRouter()

	// review, if the logged in reviewer already has added a review
	const userReview = application.reviews.find((r) => (
		r.reviewer?.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
	))

	const loadReview = async() => {
		if(!userReview) {
			return
		}

		let data: { items: { rating: number }[] }
		if(application.grantRubricIsPrivate) {
			const reviewData = userReview?.data.find((d) => (
				d.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
			))
			const ipfsData = await getFromIPFS(reviewData!.data)

			data = JSON.parse(await decryptMessage(ipfsData) || '{}')
		} else {
			const ipfsData = await getFromIPFS(userReview!.publicReviewDataHash!)
			data = JSON.parse(ipfsData || '{}')
		}

		let reviewSum = 0
		data?.items.forEach((feedback) => reviewSum += feedback.rating)

		setReviewSum(reviewSum)
	}

	useEffect(() => {
		loadReview()
	}, [])

	if(userReview) {
		return (
			<Td>
				<Flex alignItems={'start'}>
					{reviewSum === undefined ? <Loader /> : reviewSum}
				</Flex>
			</Td>
		)
	} else {
		return (
			<Td>
				<Button
					variant={'solid'}
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
