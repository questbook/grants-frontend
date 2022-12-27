import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceDetailsQuery, useGetWorkspaceMembersByWorkspaceIdQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { DOMAIN_CACHE_KEY } from 'src/libraries/ui/NavBar/_utils/constants'
import { WebwalletContext } from 'src/pages/_app'
import { SettingsFormContextType, Workspace, WorkspaceMember, WorkspaceMembers } from 'src/screens/settings/_utils/types'

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined)

const SettingsFormProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const providerComponent = () => (
		<SettingsFormContext.Provider
			value={
				{
					workspace: workspace!,
					workspaceMembers: workspaceMembers!
				}
			}>
			{children}
		</SettingsFormContext.Provider>
	)

	const { scwAddress } = useContext(WebwalletContext)!
	const [workspace, setWorkspace] = useState<Workspace>()
	const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMembers>()
	const [workspaceId, setWorkspaceId] = useState<string>()
	const [chainId, setChainId] = useState<number>(-1)

	const { fetchMore: fetchWorkspaceDetails } = useMultiChainQuery({
		useQuery: useGetWorkspaceDetailsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId ]
	})

	const { fetchMore: fetchWorkspaceMembers } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersByWorkspaceIdQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId ]
	})

	const fetchWorkspace = useCallback(async() => {
		const response = await fetchWorkspaceDetails({
			workspaceID: workspaceId
		}, true)
		logger.info('Workspace details fetched', response[0])
		setWorkspace(response[0]?.workspace)
		return workspace
	}, [chainId, scwAddress])

	const fetchWorkspaceMembersDetails = useCallback(async() => {
		const response = await fetchWorkspaceMembers({
			workspaceId: workspaceId
		})
		logger.info('Workspace members fetched', response)
		setWorkspaceMembers(response[0]?.workspaceMembers)
		return workspaceMembers
	}, [chainId, scwAddress])

	useEffect(() => {
		const savedWorkspaceData = localStorage.getItem(DOMAIN_CACHE_KEY)
		if(savedWorkspaceData) {
			const savedWorkspaceDataChainId = savedWorkspaceData.split('-')[0].split('_')[1]
			const savedWorkspaceDataId = savedWorkspaceData.split('-')[1]

			setWorkspaceId(savedWorkspaceDataId)
			setChainId(Number(savedWorkspaceDataChainId))
		}

	})

	useEffect(() => {
		fetchWorkspace().then((message) => {
			logger.info({ message }, 'Fetch grant details message')
		})
		fetchWorkspaceMembersDetails().then((message) => {
			logger.info({ message }, 'Fetch grant members message')
		})
	}, [workspaceId, chainId])

	return providerComponent()
}

export { SettingsFormContext, SettingsFormProvider }