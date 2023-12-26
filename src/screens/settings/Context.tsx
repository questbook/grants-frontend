/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { getSafeURL } from 'src/libraries/utils/multisig'
import { getKeyForMemberPii, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { GrantProgramForm, SettingsFormContextType, WorkspaceMembers } from 'src/screens/settings/_utils/types'
import { getWorkspaceDetailsQuery, getWorkspaceMembersByWorkspaceIdQuery } from 'src/screens/settings/data'

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined)

const SettingsFormProvider = ({ children }: {children: ReactNode}) => {
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

	const { grant, setGrant } = useContext(GrantsProgramContext)!

	const { scwAddress, webwallet } = useContext(WebwalletContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { fetchMore: fetchGrantProgram } = useQuery({
		query: getWorkspaceDetailsQuery,
	})

	const { fetchMore: fetchWorkspaceMembers } = useQuery({
		query: getWorkspaceMembersByWorkspaceIdQuery,
	})


	const fetchGrantProgramDetails = useCallback(async() => {
		try {
			const response: any = await fetchGrantProgram({
				workspaceID: grant?.workspace?.id
			})
			setGrantProgramData({
				title: response.workspace?.title,
				about: response?.workspace?.about,
				bio: response?.workspace?.bio,
				logoIpfsHash: response?.workspace?.logoIpfsHash,
				socials: response?.workspace?.socials.map((social: any) => {
					return {
						name: social.name,
						value: social.value
					}
				})
			})
			return grant?.workspace
		} catch(error) {
			logger.error('No grant program details found', error)
		}
	}, [chainId, grant])


	const fetchWorkspaceMembersDetails = useCallback(async() => {
		try {
			const response: any = await fetchWorkspaceMembers({
				workspaceId: grant?.workspace?.id
			})
			logger.info('Workspace members fetched', grant)

			const workspaceMembers: WorkspaceMembers = []
			for(const member of response?.workspaceMembers!) {
				if(!scwAddress || !webwallet || !member.publicKey) {
					continue
				}

				const pii = member.pii?.find((pii: any) => pii?.id?.includes(scwAddress?.toLowerCase()))
				if(!pii) {
					workspaceMembers.push(member)
					continue
				}

				const value = pii?.data
				const channel = await getSecureChannelFromPublicKey(webwallet, member.publicKey, getKeyForMemberPii(`${grant?.workspace?.id}.${scwAddress.toLowerCase()}`))
				try {
					const data = await channel.decrypt(value)
					const json = JSON.parse(data)
					if(json.email) {
						workspaceMembers.push({ ...member, email: json.email })
					} else {
						workspaceMembers.push(member)
					}
				} catch(error) {
					logger.error(error, 'Error decrypting email')
					workspaceMembers.push(member)
				}
			}

			setWorkspaceMembers(workspaceMembers)
			const safeUrl = getSafeURL(grant?.workspace.safe?.address!, grant?.workspace.safe?.chainId!)
			setSafeURL(safeUrl)
			return workspaceMembers
		} catch(error) {
			logger.error('No workspace members found', error)
		}
	}, [chainId, grant, scwAddress])

	const getLocalGrant = () => {

		const rawGrant = localStorage.getItem('cur-grant')

		logger.info('Fetching grant from local storage')

		if(!rawGrant) {
			logger.info('No grant found in local storage')
			return undefined
		}

		const grant = JSON.parse(rawGrant)

		return grant
	}

	useEffect(() => {
		fetchGrantProgramDetails().then((message) => {
			logger.info({ message }, 'Fetch grant program message')
		})

		fetchWorkspaceMembersDetails().then((message) => {
			logger.info({ message }, 'Fetch grant members message')
		})
	}, [grant, chainId])

	useEffect(() => {
		if(!grant) {
			const _grant = getLocalGrant()
			if(_grant) {
				logger.info({ grant: _grant }, 'Setting grant from local storage')
				setGrant(_grant)
			}
		}
	}, [grant])

	return providerComponent()
}

export { SettingsFormContext, SettingsFormProvider }