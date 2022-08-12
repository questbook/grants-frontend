import React, { useContext, useMemo, useState } from 'react'
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
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from '../../../../../pages/_app'
import Loader from '../../../../components/ui/loader'
import { CHAIN_INFO, defaultChainId } from '../../../../constants/chains'
import { ApplicationState, useGetReviewerApplicationsQuery } from '../../../../generated/graphql'
import { formatAmount, getFormattedDateFromUnixTimestampWithYear } from '../../../../utils/formattingUtils'
import { capitalizeFirstLetter } from '../../../../utils/generics'
import { getAssetInfo } from '../../../../utils/tokenUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from '../../../../utils/validationUtils'
import PaginatorView from '../../WorkspaceMembers/PaginatorView'

type ReviewType = GetReviewerApplicationsQuery['grantApplications'][0]['reviews'][0]

const PAGE_SIZE = 5

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
  showApplicationState: boolean,
  applicationStateIn: ApplicationState[],
}


function ApplicationsTable({
	reviewerId,
	applicationStateIn,
	showApplicationState,
}: Props) {
	const [page, setPage] = useState(0)
	const [hasMoreData, setHasMoreData] = useState(true)

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[chainId]

	const { data } = useGetReviewerApplicationsForGrantQuery({
		client,
		variables: {
			workspaceId: workspace!.id,
			reviewerId,
			applicationStateIn,
			first: PAGE_SIZE,
			skip: page * PAGE_SIZE,
		},
	})

	const applications = useMemo(() => {
		if(!data) {
			return
		}

		setHasMoreData(data!.grantApplications.length >= PAGE_SIZE)

		const fetchedApplications: Application[] = data!.grantApplications.map((application) => {
			const decimals = CHAIN_INFO[
				getSupportedChainIdFromSupportedNetwork(
					application.grant.workspace.supportedNetworks[0],
				)
			]?.supportedCurrencies[application.grant.reward.asset.toLowerCase()]
				?.decimals || 18

			const getFieldString = (name: string) => application.fields.find((field) => field?.id?.includes(`.${name}`))?.values[0]?.value

			let rewardAmount: number

			const fundingAskField = getFieldString('fundingAsk')
			if(fundingAskField) {
				rewardAmount = +formatAmount(
          getFieldString('fundingAsk')!,
          decimals,
				)
			} else {
				rewardAmount = 0
				application.milestones.forEach(
					(milestone) => rewardAmount += +formatAmount(
						milestone.amount,
						decimals,
					))
			}

			const tokenLabel = getAssetInfo(
				application?.grant?.reward?.asset?.toLowerCase(),
				getSupportedChainIdFromWorkspace(workspace),
			).label

			return {
				id: application.id,
				submittedOn: application.createdAtS,
				reviews: application.reviews,
				grantRubricIsPrivate: application.grant.rubric?.isPrivate,
				reward: `${rewardAmount} ${tokenLabel}`,
				state: application.state,
				applicantId: application.applicantId,
				projectName: getFieldString('projectName')!,
				applicantEmail: getFieldString('applicantEmail'),
				applicantName: getFieldString('applicantName')!,
			}
		})

		return fetchedApplications
	}, [page, data])

	const TABLE_HEADERS = ['Project Name', 'Funding ask', 'Submitted on']

	if(showApplicationState && !TABLE_HEADERS.includes('Status')) {
		TABLE_HEADERS.push('Status')
	}

	if(!TABLE_HEADERS.includes('Review')) {
		TABLE_HEADERS.push('Review')
	}

	return (
		<>
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
										showApplicationState && (
											<Td>
												{capitalizeFirstLetter(application.state)}
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

	const loadReview = async() => {
		const review = application.reviews.find((r) => (
			r.reviewer?.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
		))

		if(!review) {
			return
		}

		let data: { items: { feedback: { rating: number } }[] }
		if(application.grantRubricIsPrivate) {
			const reviewData = review?.data.find((d: any) => (
				d.id.split('.')[1].toLowerCase() === accountData?.address?.toLowerCase()
			))
			const ipfsData = await getFromIPFS(reviewData!.data)

			data = JSON.parse(await decryptMessage(ipfsData) || '{}')
		} else {
			const ipfsData = await getFromIPFS(review!.publicReviewDataHash!)
			data = JSON.parse(ipfsData || '{}')
		}

		let reviewSum = 0
		data?.items.forEach((feedback: any) => reviewSum += feedback.rating)

		setReviewSum(reviewSum)
	}

	useEffect(() => {
		loadReview()
	}, [])

	if(application.state === ApplicationState.Submitted) {
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
	} else {
		return (
			<Td>
				{reviewSum}
			</Td>
		)
	}
}


export default ApplicationsTable
