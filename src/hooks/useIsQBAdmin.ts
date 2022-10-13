import { useContext, useEffect, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useGetQbAdminsQuery } from 'src/generated/graphql'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

export default function useIsQBAdmin() {
	const [isQBAdmin, setIsQBAdmin] = useState<boolean>()

	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const { data: getAdminsData } = useGetQbAdminsQuery(
		{
			client: subgraphClients[
				getSupportedChainIdFromWorkspace(workspace) || defaultChainId
			].client,
		},
	)

	useEffect(() => {
		(async() => {
			if(!getAdminsData) {
				return
			}

			const adminWalletAddresses = getAdminsData.qbadmins.map(e => e.walletAddress.toLowerCase())

			if(scwAddress || webwallet) {
				setIsQBAdmin(
					(scwAddress ? adminWalletAddresses.includes(scwAddress.toLowerCase()) : false)
					|| (webwallet ? adminWalletAddresses.includes(webwallet.address.toLowerCase()) : false),
				)
			}
		})()

	}, [scwAddress, webwallet, getAdminsData])

	return { isQBAdmin }
}
