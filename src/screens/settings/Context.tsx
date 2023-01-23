import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceDetailsQuery, useGetWorkspaceMembersByWorkspaceIdQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { GrantsProgramContext } from 'src/pages/_app'
import { GrantProgramForm, SettingsFormContextType, WorkspaceMembers } from 'src/screens/settings/_utils/types'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { getSafeURL } from 'src/v2/utils/gnosisUtils'

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined)

const SettingsFormProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const providerComponent = () => (
		<SettingsFormContext.Provider
			value={
				{
					workspace: grant?.workspace!,
					workspaceMembers: workspaceMembers!,
					grantProgramData: grantProgramData!,
					setGrantProgramData: setGrantProgramData!,
					safeURL: safeURL!
				}
			}>
			{children}
		</SettingsFormContext.Provider>
	)

	const [grantProgramData, setGrantProgramData] = useState<GrantProgramForm>()
	const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMembers>()
	const [safeURL, setSafeURL] = useState<string>('')

	const { grant } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { fetchMore: fetchGrantProgram } = useMultiChainQuery({
		useQuery: useGetWorkspaceDetailsQuery,
		options: {},
		chains: [chainId]
	})

	const { fetchMore: fetchWorkspaceMembers } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersByWorkspaceIdQuery,
		options: {},
		chains: [chainId]
	})


	const fetchGrantProgramDetails = useCallback(async() => {
		const response = await fetchGrantProgram({
			workspaceID: grant?.workspace?.id
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
		return grant?.workspace
	}, [chainId, grant])


	const fetchWorkspaceMembersDetails = useCallback(async() => {
		const response = await fetchWorkspaceMembers({
			workspaceId: grant?.workspace?.id
		})
		logger.info('Workspace members fetched', response)
		setWorkspaceMembers(response[0]?.workspaceMembers)
		const safeUrl = getSafeURL(grant?.workspace.safe?.address!, grant?.workspace.safe?.chainId!)
		setSafeURL(safeUrl)
		return workspaceMembers
	}, [chainId, grant])

	useEffect(() => {
		fetchGrantProgramDetails().then((message) => {
			logger.info({ message }, 'Fetch grant program message')
		})

		fetchWorkspaceMembersDetails().then((message) => {
			logger.info({ message }, 'Fetch grant members message')
		})
	}, [grant, chainId])

	return providerComponent()
}

export { SettingsFormContext, SettingsFormProvider }