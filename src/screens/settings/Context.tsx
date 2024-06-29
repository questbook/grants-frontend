/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { getSafeURL } from 'src/libraries/utils/multisig'
import { getKeyForMemberPii, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { adminTable, GrantProgramForm, SettingsFormContextType, WorkspaceMembers } from 'src/screens/settings/_utils/types'
import { getWorkspaceDetailsQuery, getWorkspaceMembersByWorkspaceIdQuery } from 'src/screens/settings/data'
import { getAdminTableQuery } from 'src/screens/settings/data/getAdminTableQuery'
import { getAllGrantsAdminTableQuery } from 'src/screens/settings/data/getAllGrantsAdminTableQuery'

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
					safeURL: safeURL!,
					refreshWorkspace: (refresh: boolean) => {
						if(refresh) {
							fetchGrantProgramDetails()
							fetchWorkspaceMembersDetails()
							getAdminTable()
						}
					},
					adminTable: adminTable!,
					showAdminTable: showAdminTable!,
					setShowAdminTable: setShowAdminTable!,
					listAllGrants: listAllGrants!,
					setListAllGrants: setListAllGrants!,
					allGrantsAdminTable: allGrantsAdminTable!,
				}
			}>
			{children}
		</SettingsFormContext.Provider>
	)

	const [grantProgramData, setGrantProgramData] = useState<GrantProgramForm>()
	const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMembers>()
	const [safeURL, setSafeURL] = useState<string>('')
	const [adminTable, setAdminTable] = useState<adminTable>([])
	const [showAdminTable, setShowAdminTable] = useState<boolean>(false)
	const [listAllGrants, setListAllGrants] = useState<boolean>(false)
	const [allGrantsAdminTable, setAllGrantsAdminTable] = useState<adminTable>([])

	const { grant, setGrant, setRole } = useContext(GrantsProgramContext)!

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

	const { fetchMore: fetchMoreAdminTable } = useQuery({
		query: getAdminTableQuery,
	})

	const { fetchMore: fetchAllGrantsAdminTable } = useQuery({
		query: getAllGrantsAdminTableQuery,
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
				synapsId: response?.workspace?.synapsId || '',
				docuSign: response?.workspace?.docuSign || '',
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
			logger.info('Workspace members fetched', response)

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

		if(!scwAddress) {
			logger.info('No SCW Address')
			return undefined
		}

		const grant = JSON.parse(rawGrant)

		if(scwAddress) {
			logger.info({ scwAddress }, 'SCW Address')
			for(const member of grant?.workspace?.members ?? []) {
				if(member.actorId.toLowerCase() === scwAddress.toLowerCase()) {
					logger.info({ member }, 'Member (ROLE)')
					setRole(member.accessLevel === 'reviewer' ? 'reviewer' : 'admin')
				}
			}
		}

		return grant
	}

	const getAdminTable = useCallback(async() => {
		if(!grant?.id) {
			return 'no-grant-id'
		}

		const details: any = await fetchMoreAdminTable({ id: grant?.id }, true)
		logger.info({ details }, 'Grant details (GET GRANT)')
		let applications = []
		if(!details?.grant) {
			return 'no-grant-in-query'
		}

		if(details?.fundTransfers) {
			applications = details?.grant?.applications?.map((application: any) => {
				const fundTransfer = details?.fundTransfers?.find((fundTransfer: any) => fundTransfer?.application?.id === application?.id)
				logger.info({ fundTransfer }, 'Fund transfer')
				return {
					...application,
					fundTransfer: fundTransfer !== undefined ? [fundTransfer] : false
				}
			})
		}

		setAdminTable(applications)

		return 'grant-details-fetched'
	}, [grant?.id])

	const getAdminTableAllGrants = useCallback(async() => {
		const details: any = await fetchAllGrantsAdminTable({}, true)
		logger.info({ details }, 'Grant details (GET ALL GRANTS)')
		let allGrants = []
		if(!details?.section?.grants) {
			return 'no-grant-in-query'
		}

		if(details?.section?.grants) {
			allGrants = details?.section?.grants.map((grant: {
				id: string
				title: string
			}) => {
				return {
					id: grant.id,
					title: grant.title
				}
			})

		}

		let applications: adminTable = []
		if(allGrants?.length > 0) {
			for(const grants of allGrants) {
				logger.info({ grants }, 'grant details')
				const details: any = await fetchMoreAdminTable({ id: grants?.id }, true)
				logger.info({ details }, 'Grant details (GET GRANT)')
				if(!details?.grant) {
					continue
				}

				logger.info(details?.grant?.applications, 'Application details')

				if(details?.fundTransfers) {
					applications = details?.grant?.applications?.map((application: any) => {
						const fundTransfer = details?.fundTransfers?.find((fundTransfer: any) => fundTransfer?.application?.id === application?.id)
						logger.info({ fundTransfer }, 'Fund transfer')
						return {
							...application,
							grantId: grants?.id,
							grantTitle: grants?.title,
							fundTransfer: fundTransfer !== undefined ? [fundTransfer] : false
						}
					})
				}

				logger.info({ applications }, 'Applications')

				if(applications?.length > 0) {
					setAllGrantsAdminTable((prev: any) => [...prev, ...applications.filter((application: any) => !prev.some((prevApplication: any) => prevApplication.id === application.id))])
				}
			}
		}

		logger.info({ allGrantsAdminTable }, 'All grants')

		return 'grant-details-fetched'
	}, [listAllGrants])

	useEffect(() => {
		if(grant?.id) {
			getAdminTable()
		}
	}, [grant?.id])

	useEffect(() => {
		fetchGrantProgramDetails().then((message) => {
			logger.info({ message }, 'Fetch grant program message')
		})

		fetchWorkspaceMembersDetails().then((message) => {
			logger.info({ message }, 'Fetch grant members message')
		})
	}, [grant, chainId])

	useEffect(() => {
		if(listAllGrants) {
			getAdminTableAllGrants().then((message) => {
				logger.info({ message }, 'Fetch all grants message')
			})
		}
	}, [listAllGrants])


	useEffect(() => {
		if(!grant) {
			const _grant = getLocalGrant()
			if(_grant) {
				logger.info({ grant: _grant }, 'Setting grant from local storage')
				setGrant(_grant)
			}
		}
	}, [grant, scwAddress, chainId])

	return providerComponent()
}

export { SettingsFormContext, SettingsFormProvider }