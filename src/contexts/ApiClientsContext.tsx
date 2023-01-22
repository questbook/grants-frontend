import { createContext, PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react'
import { Configuration, ValidationApi } from '@questbook/service-validator-client'
import { ALL_SUPPORTED_CHAIN_IDS, defaultChainId } from 'src/constants/chains'
import SubgraphClient from 'src/graphql/subgraph'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { DOMAIN_CACHE_KEY } from 'src/libraries/ui/NavBar/_utils/constants'
import { extractInviteInfo, InviteInfo } from 'src/libraries/utils/invite'
import { ApiClientsContextType } from 'src/libraries/utils/types'
import { MinimalWorkspace } from 'src/types'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

const ApiClientsContext = createContext<ApiClientsContextType | null>(null)

const ApiClientsContextProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const [workspace, setWorkspace] = useState<MinimalWorkspace>()
	const [isNewUser, setIsNewUser] = useState<boolean>(true)
	const [inviteInfo, setInviteInfo] = useState<InviteInfo>()
	const toast = useCustomToast()

	useEffect(() => {
		try {
			const inviteInfo = extractInviteInfo()
			if(inviteInfo) {
				setInviteInfo(inviteInfo)
			}
		} catch(error) {
			toast({
				title: `Invalid invite "${(error as Error).message}"`,
				status: 'error',
				duration: 9000,
				isClosable: true,
			})
		}
	}, [])

	const validatorApi = useMemo(() => {
		const validatorConfiguration = new Configuration({
		})
		return new ValidationApi(validatorConfiguration)
	}, [])

	const clients = useMemo(() => {
		const clientsObject = {} as { [chainId: string]: SubgraphClient }
		ALL_SUPPORTED_CHAIN_IDS.forEach((chainId) => {
			clientsObject[chainId] = new SubgraphClient(chainId)
		})
		return clientsObject
	}, [])

	const chainId = useMemo(() => getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId, [workspace])

	const apiClients = useMemo(
		() => ({
			validatorApi,
			workspace,
			setWorkspace: (newWorkspace?: MinimalWorkspace) => {
				if(newWorkspace) {
					localStorage.setItem(
						DOMAIN_CACHE_KEY,
						newWorkspace.supportedNetworks[0] + '-' + newWorkspace.id
					)
				} else {
					localStorage.setItem(DOMAIN_CACHE_KEY, 'undefined')
				}

				// const member = newWorkspace?.members?.find((member) => member.actorId === scwAddress?.toLowerCase())
				// if(member) {
				// 	const newRole = member.accessLevel === 'reviewer' ? 'reviewer' : 'admin'
				// 	logger.info({ newRole }, 'Setting role 6')
				// 	setRole(newRole)
				// 	localStorage.setItem(ROLE_CACHE, newRole)
				// }

				setWorkspace(newWorkspace)
			},
			chainId,
			inviteInfo,
			setInviteInfo,
			subgraphClients: clients,
			isNewUser,
			setIsNewUser
		}),
		[workspace, validatorApi, clients, inviteInfo, setInviteInfo, isNewUser, setIsNewUser]
	)

	const context = () => {
		return (
			<ApiClientsContext.Provider value={apiClients}>
				{children}
			</ApiClientsContext.Provider>
		)
	}

	return context()
}

export { ApiClientsContextProvider, ApiClientsContext }