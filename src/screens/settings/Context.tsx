import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useGetWorkspaceDetailsQuery, useGetWorkspaceMembersByWorkspaceIdQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/libraries/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { GrantProgramForm, SettingsFormContextType, WorkspaceMembers } from 'src/screens/settings/_utils/types'

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined)

const SettingsFormProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const providerComponent = () => (
		<SettingsFormContext.Provider
			value={
				{
					workspace: workspace!,
					workspaceMembers: workspaceMembers!,
					grantProgramData: grantProgramData!,
					setGrantProgramData: setGrantProgramData!,
				}
			}>
			{children}
		</SettingsFormContext.Provider>
	)

	const [grantProgramData, setGrantProgramData] = useState<GrantProgramForm>()
	const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMembers>()

	const { workspace, chainId } = useContext(ApiClientsContext)!

	const { fetchMore: fetchGrantProgram } = useMultiChainQuery({
		useQuery: useGetWorkspaceDetailsQuery,
		options: {},
		chains: [chainId]
	})

	const { fetchMore: fetchWorkspaceMembers } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersByWorkspaceIdQuery,
		options: {},
		chains: [chainId ]
	})


	const fetchGrantProgramDetails = useCallback(async() => {
		const response = await fetchGrantProgram({
			workspaceID: workspace?.id
		})
		logger.info('Grant program fetched', response)
		setGrantProgramData({
			title: response[0]?.workspace?.title!,
			about: response[0]?.workspace?.about!,
			bio: response[0]?.workspace?.bio!,
			logoIpfsHash: response[0]?.workspace?.logoIpfsHash!,
			socials: response[0]?.workspace?.socials!.map(social => {
				return {
					name: social.name,
					value: social.value
				}
			})
		 })
		return workspace
	}, [chainId, workspace])


	const fetchWorkspaceMembersDetails = useCallback(async() => {
		const response = await fetchWorkspaceMembers({
			workspaceId: workspace?.id
		})
		logger.info('Workspace members fetched', response)
		setWorkspaceMembers(response[0]?.workspaceMembers)
		return workspaceMembers
	}, [chainId, workspace])

	useEffect(() => {
		fetchGrantProgramDetails().then((message) => {
			logger.info({ message }, 'Fetch grant program message')
		})

		fetchWorkspaceMembersDetails().then((message) => {
			logger.info({ message }, 'Fetch grant members message')
		})
	}, [workspace, chainId])

	return providerComponent()
}

export { SettingsFormContext, SettingsFormProvider }