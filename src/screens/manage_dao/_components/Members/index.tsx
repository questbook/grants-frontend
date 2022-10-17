import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LinkIcon } from '@chakra-ui/icons'
import {
	Button,
	Flex, Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
	useGetWorkspaceMembersByWorkspaceIdQuery,
	WorkspaceMemberAccessLevel,
} from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import FilterTable from 'src/libraries/ui/FilterTable'
import { ApiClientsContext } from 'src/pages/_app'
import TablePanel from 'src/screens/manage_dao/_components/Members/TablePanel'
import InviteModal from 'src/v2/components/InviteModal'

const USER_TYPES = [
	{
		name: 'All',
		accessLevels: Object.values(WorkspaceMemberAccessLevel),
	},
	{
		name: 'Administrators',
		accessLevels: [WorkspaceMemberAccessLevel['Owner'], WorkspaceMemberAccessLevel['Admin']],
	},
	{
		name: 'Reviewers',
		accessLevels: [WorkspaceMemberAccessLevel['Reviewer']],
	},
]

function WorkspaceMembers() {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				w='100%'>
				<Flex
					w='100%'
					mb={5}>
					<Text
						variant='v2_heading_3'
						fontWeight='500'>
						Members
					</Text>
					<Button
						ml='auto'
						onClick={() => setIsInviteModalOpen(true)}
						leftIcon={<LinkIcon />}
						variant='primaryV2' >
						{t('/manage_dao.create_link')}
					</Button>
				</Flex>
				<FilterTable
					tabs={
						USER_TYPES.map((type,) => {
							const filteredMembers = members.filter((member) => type.accessLevels.indexOf(member.accessLevel) !== -1)
							return {
								title: `${type.name} (${filteredMembers.length})`,
								element: <TablePanel
									data={filteredMembers}
								/>
							}
						})
					}
					tabIndex={selectedUserTypeIdx}
					onChange={setSelectedUserTypeIdx}
				/>
				<InviteModal
					isOpen={isInviteModalOpen}
					onClose={() => setIsInviteModalOpen(false)} />
			</Flex>
		)
	}

	const { t } = useTranslation()
	const router = useRouter()
	const { workspace } = useContext(ApiClientsContext)!

	const [isInviteModalOpen, setIsInviteModalOpen] = useState(router.query.tab === 'members')
	const [selectedUserTypeIdx, setSelectedUserTypeIdx] = useState(0)

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersByWorkspaceIdQuery,
		options: {
			variables: {
				workspaceId: workspace?.id ?? '',
			}
		}
	})

	useEffect(() => {
		fetchMore({
			workspaceId: workspace?.id
		}, true)
	}, [workspace])

	const members = useMemo(() => {
		if(!results) {
			return []
		}

		return results?.[0]?.workspaceMembers ?? []
	}, [results])

	return buildComponent()
}

export default WorkspaceMembers
