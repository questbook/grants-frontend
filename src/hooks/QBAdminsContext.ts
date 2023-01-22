import { useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import { WebwalletContext } from 'src/contexts/WebwalletContext'
import { useGetQbAdminsQuery } from 'src/generated/graphql'
import { ContextGenerator } from 'src/utils/contextGenerator'

const useGetQBAdmins = () => {
	const { subgraphClients } = useContext(ApiClientsContext)!
	const { webwallet, scwAddress } = useContext(WebwalletContext)!

	const { client } = subgraphClients[defaultChainId]
	const { data: adminData, loading, error } = useGetQbAdminsQuery({ client })

	const isQbAdmin = useMemo(() => {
		const scwLower = scwAddress?.toLowerCase()
		const webwalletLower = webwallet?.address?.toLowerCase()

		return !!adminData?.qbadmins.find(admin => {
			const adminLower = admin.walletAddress.toLowerCase()
			return adminLower === scwLower || adminLower === webwalletLower
		})
	}, [adminData, scwAddress, webwallet])

	return {
		isQbAdmin,
		loading,
		error,
		qbAdmins: adminData?.qbadmins.map((admin) => admin.walletAddress) || [],
	}
}

export const {
	context: QBAdminsContext,
	contextMaker: QBAdminsContextMaker,
} = ContextGenerator(useGetQBAdmins)
