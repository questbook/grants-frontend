import React, { useContext, useEffect, useState } from 'react'
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
import { ApiClientsContext } from '../../../../pages/_app'
import Loader from '../../../components/ui/loader'
import { defaultChainId } from '../../../constants/chains'
import { ApplicationState, useGetReviewerApplicationsQuery } from '../../../generated/graphql'
import { getFormattedDateFromUnixTimestampWithYear } from '../../../utils/formattingUtils'
import { capitalizeFirstLetter } from '../../../utils/generics'
import { getSupportedChainIdFromWorkspace } from '../../../utils/validationUtils'
import PaginatorView from '../WorkspaceMembers/PaginatorView'

const PAGE_SIZE = 5

type Application = {
  id: string,
  submittedOn: number,
  state: ApplicationState,
  projectName: string,
  applicantId: string,
  applicantName: string,
  applicantEmail?: string,
}

type Props = {
  reviewerId: string,
  header: string,
  showApplicationState: boolean,
  showReviewButton: boolean,
  applicationStateIn?: ApplicationState[],
}


function ApplicationsTable({
	reviewerId,
	header,
	applicationStateIn,
	showApplicationState,
	showReviewButton,
}: Props) {
	applicationStateIn ??= Object.values(ApplicationState)

	const TABLE_HEADERS = ['Proposals', 'Submitted on']

	if(showApplicationState && !TABLE_HEADERS.includes('Status')) {
		TABLE_HEADERS.push('Status')
	}

	if(showReviewButton && !TABLE_HEADERS.includes('Review')) {
		TABLE_HEADERS.push('Review')
	}

	const [applications, setApplications] = useState<Application[]>()
	const [page, setPage] = useState(0)
	const [hasMoreData, setHasMoreData] = useState(true)

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[chainId]

	const { data } = useGetReviewerApplicationsQuery({
		client,
		variables: {
			workspaceId: workspace!.id,
			reviewerId,
			applicationStateIn,
			first: PAGE_SIZE,
			skip: page * PAGE_SIZE,
		},
	})

	const router = useRouter()

	useEffect(() => {
		if(!data) {
			return
		}

		setHasMoreData(data!.grantApplications.length >= PAGE_SIZE)

		const fetchedApplications: Application[] = data!.grantApplications.map((application) => {
			const getFieldString = (name: string) => application.fields.find((field) => field?.id?.includes(`.${name}`))?.values[0]?.value

			return {
				id: application.id,
				submittedOn: application.createdAtS,
				state: application.state,
				applicantId: application.applicantId,
				projectName: getFieldString('projectName')!,
				applicantEmail: getFieldString('applicantEmail'),
				applicantName: getFieldString('applicantName')!,
			}
		})
		setApplications(fetchedApplications)
	}, [data, page])

	return (
		<>
			<Text
				fontWeight={'700'}
				fontSize={'30px'}
				lineHeight={'44px'}
				letterSpacing={-1}
			>
				{header}
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
										{getFormattedDateFromUnixTimestampWithYear(application.submittedOn)}
									</Td>
									{
										showApplicationState && (
											<Td>
												{capitalizeFirstLetter(application.state)}
											</Td>
										)
									}
									{
										showReviewButton && (
											<Td>
												<Button
													variant={'inviteLink'}
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


export default ApplicationsTable
