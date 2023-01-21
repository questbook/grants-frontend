import { createContext, PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react'
import { ALL_SUPPORTED_CHAIN_IDS } from 'src/constants/chains'
import SubgraphClient from 'src/graphql/subgraph'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { extractInviteInfo, InviteInfo } from 'src/libraries/utils/invite'
import { ApiClientsContextType } from 'src/libraries/utils/types'

const ApiClientsContext = createContext<ApiClientsContextType | null>(null)

const ApiClientsContextProvider = ({ children }: PropsWithChildren<ReactNode>) => {
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

	const clients = useMemo(() => {
		const clientsObject = {} as { [chainId: string]: SubgraphClient }
		ALL_SUPPORTED_CHAIN_IDS.forEach((chainId) => {
			clientsObject[chainId] = new SubgraphClient(chainId)
		})
		return clientsObject
	}, [])

	const apiClients = useMemo(
		() => ({
			inviteInfo,
			setInviteInfo,
			subgraphClients: clients,
			isNewUser,
			setIsNewUser
		}),
		[clients, inviteInfo, setInviteInfo, isNewUser, setIsNewUser]
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