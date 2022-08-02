import { useContext, useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, LinkIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Center,
	Flex,
	Spacer,
	Table,
	Tag,
	Tbody,
	Th,
	Thead,
	Tr,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import { ApiClientsContext } from '../../../../pages/_app'
import Loader from '../../../components/ui/loader'
import { defaultChainId } from '../../../constants/chains'
import { useGetWorkspaceMembersByWorkspaceIdQuery, WorkspaceMemberAccessLevel } from '../../../generated/graphql'
import { getSupportedChainIdFromWorkspace } from '../../../utils/validationUtils'
import InviteModal from '../InviteModal'
import MemberRow from './MemberRow'

const PAGE_SIZE = 7

const userTypes = [
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


const tableHeaders = ['', 'Member', 'Role', 'Joined on']

function WorkspaceMembers() {
	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const [selectedUserTypeIdx, setSelectedUserTypeIdx] = useState(0)

	const [members, setMembers] = useState<Array<any> | undefined>(undefined)

	const [page, setPage] = useState(0)
	const [hasMoreData, setHasMoreData] = useState(true)

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[chainId]

	const { data } = useGetWorkspaceMembersByWorkspaceIdQuery({
		client,
		variables: {
			workspaceId: workspace!.id,
			first: PAGE_SIZE,
			skip: page * PAGE_SIZE,
			accessLevelsIn: userTypes[selectedUserTypeIdx].accessLevels,
		},
	})

	useEffect(() => {
		if(!data) {
			return
		}

		setHasMoreData(data!.workspaceMembers.length >= PAGE_SIZE)
		setMembers(data!.workspaceMembers)
	}, [data, page, selectedUserTypeIdx])

	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

	return (
		<>
			<Flex
				direction={'column'}
			>
				<Flex
					direction={'row'}
				>
					<Wrap>
						{
							userTypes.map((userType, index) => (
								<WrapItem key={index}>
									<Tag
										onClick={
											() => {
												setPage(0)
												setSelectedUserTypeIdx(index)
											}
										}
										bg={index === selectedUserTypeIdx ? '#1F1F32' : '#E0E0EC'}
										fontSize={18}
										borderRadius={2}
										paddingTop={1}
										paddingBottom={1}
										letterSpacing={-1}
										textTransform={'none'}
										cursor={'pointer'}
										color={index === selectedUserTypeIdx ? '#E0E0EC' : '#1F1F32'}>
										{userType.name}
									</Tag>
								</WrapItem>
							),
							)
						}

					</Wrap>
					<Spacer />
					<Button
						onClick={() => setIsInviteModalOpen(true)}
						leftIcon={<LinkIcon />}
						bg={'#1F1F32'}
						colorScheme={'#E0E0EC'}
						borderRadius={4}
						variant='solid'>
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
									tableHeaders.map((tableHeader) => (
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
						{
							members === undefined ? (
								<Center>
									<Loader />
								</Center>
							) : members!.length === 0 ? (
								<Center>
									<span>
										{`No ${page === 0 ? '' : 'more '}members!`}
									</span>
								</Center>
							)
								:
								(
									<Tbody>
										{
                      members!.map((member: any) => (
                      	<MemberRow
                      		key={member.id}
                      		member={member} />
                      ))
										}
									</Tbody>
								)
						}
					</Table>
				</Box>
				<Box h={2} />
				<Flex
					justifyContent={'end'}>
					<Box
						boxShadow={'lg'}
						borderRadius={7.5}
						bg={'white'}>
						<Flex
							alignItems={'center'}>
							<Button
								bg={'inherit'}
								disabled={page === 0}
								onClick={() => setPage((page) => page - 1)}
							>
								<ChevronLeftIcon />
							</Button>
							<Box w={2.5} />
							{page + 1}
							<Box w={2.5} />
							<Button
								bg={'inherit'}
								disabled={!hasMoreData}
								onClick={() => setPage((page) => page + 1)}
							>
								<ChevronRightIcon />
							</Button>
						</Flex>
					</Box>
				</Flex>
			</Flex>
			<InviteModal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)} />
		</>
	)
}

export default WorkspaceMembers
