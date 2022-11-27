import { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { useGetWorkspaceMembersByWorkspaceIdQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import { ApiClientsContext } from 'src/pages/_app'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function useMembers() {
	const router = useRouter()
	const { workspace } = useContext(ApiClientsContext)!

	const chainId = useMemo<SupportedChainId>(() => {
		return getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
	}, [workspace])

	const [isInviteModalOpen, setIsInviteModalOpen] = useState(router.query.tab === 'members' && !router.query.state)
	const [selectedUserTypeIdx, setSelectedUserTypeIdx] = useState(0)

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersByWorkspaceIdQuery,
		options: {
			variables: {
				workspaceId: workspace?.id ?? '',
			}
		},
		chains: [chainId]
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

	return { isInviteModalOpen, setIsInviteModalOpen, selectedUserTypeIdx, setSelectedUserTypeIdx, members }
}

export default useMembers