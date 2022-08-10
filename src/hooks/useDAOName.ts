import { useContext, useEffect } from 'react'
import { ApiClientsContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import { useGetDaoNameLazyQuery } from 'src/generated/graphql'

const DEFAULT_DAO_NAME = 'A DAO'

const useDAOName = (workspaceId?: number, chainId?: number) => {
	const { subgraphClients } = useContext(ApiClientsContext)!

	const { client } = subgraphClients[chainId?.toString() || '']
		|| subgraphClients[defaultChainId]
	const [daoNameFetch, result] = useGetDaoNameLazyQuery({ client })

	useEffect(() => {
		(async() => {
			if(typeof workspaceId !== 'undefined') {
				const workspaceIdStr = '0x' + workspaceId.toString(16)
				await daoNameFetch({
					variables: { workspaceID: workspaceIdStr }
				})
			}
		})()
	}, [workspaceId, daoNameFetch])

	return result?.error
		? DEFAULT_DAO_NAME
		: result?.data?.workspace?.title
}

export default useDAOName