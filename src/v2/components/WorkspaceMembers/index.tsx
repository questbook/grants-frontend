import { useContext, useEffect, useState } from 'react'
import { LinkIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Center,
	Flex,
	Spacer,
	Table,
	TabList,
	Tabs,
	Tbody,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react'
import { ApiClientsContext } from '../../../../pages/_app'
import Loader from '../../../components/ui/loader'
import { defaultChainId } from '../../../constants/chains'
import {
	useGetWorkspaceMembersByWorkspaceIdQuery,
	WorkspaceMember,
	WorkspaceMemberAccessLevel,
} from '../../../generated/graphql'
import { getSupportedChainIdFromWorkspace } from '../../../utils/validationUtils'
import InviteModal from '../InviteModal'
import AccessLevelTab from './AccessLevelTab'
import MemberRow from './MemberRow'
import PaginatorView from './PaginatorView'

const PAGE_SIZE = 7

const USER_TYPES = [
	{
		'name': 'All',
		'accessLevels': Object.values(WorkspaceMemberAccessLevel),
	},
	{
		'name': 'Administrators',
		'accessLevels': [WorkspaceMemberAccessLevel['Admin']],
	},
	{
		'name': 'Reviewers',
		'accessLevels': [WorkspaceMemberAccessLevel['Reviewer']],
	},
]


const TABLE_HEADERS = ['', 'Member', 'Role', 'Joined on']

function WorkspaceMembers() {
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
	const [selectedUserTypeIdx, setSelectedUserTypeIdx] = useState(0)
	const [members, setMembers] = useState<Partial<WorkspaceMember>[]>()
	const [page, setPage] = useState(0)
	const [hasMoreData, setHasMoreData] = useState(true)

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[chainId]

	const { data } = useGetWorkspaceMembersByWorkspaceIdQuery({
		client,
		variables: {
			workspaceId: workspace!.id,
			first: PAGE_SIZE,
			skip: page * PAGE_SIZE,
			accessLevelsIn: USER_TYPES[selectedUserTypeIdx].accessLevels,
		},
	})

	useEffect(() => {
		if(!data) {
			return
		}

		setHasMoreData(data!.workspaceMembers.length >= PAGE_SIZE)
		setMembers(data!.workspaceMembers)
	}, [data, page, selectedUserTypeIdx])

	return (
		<>
			<Flex
				direction={'column'}
			>
				<Flex
					direction={'row'}
				>
					<Tabs
						borderBottom={'transparent'}
						onChange={
							(index) => {
								setPage(0)
								setSelectedUserTypeIdx(index)
							}
						}>
						<TabList>
							{
								USER_TYPES.map((userType, index) => (
									<AccessLevelTab
										key={index}
										accessLevel={userType.name} />
								),
								)
							}
						</TabList>
					</Tabs>
					<Spacer />
					<Button
						onClick={() => setIsInviteModalOpen(true)}
						leftIcon={<LinkIcon />}
						variant='primaryV2' >
            			Create invite link
					</Button>
				</Flex>
				<Box h={5} />
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
								members && members!.map((member) => (
									<MemberRow
										key={member.id}
										member={member} />
								))
							}
						</Tbody>
					</Table>
					{
						members === undefined ? (
							<Center padding={5}>
								<Loader />
							</Center>
						) : members!.length === 0 ? (
							<Center padding={5}>
								{`No ${page === 0 ? '' : 'more '}members!`}
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
			</Flex>
			<InviteModal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)} />
		</>
	)
}

export default WorkspaceMembers
