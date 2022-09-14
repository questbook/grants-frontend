import { useContext, useEffect } from 'react'
import { BiconomyContext, WebwalletContext } from 'pages/_app'

export const useBiconomy = (data: { chainId?: string, shouldRefreshNonce?: boolean }) => {
	const { webwallet, scwAddress, nonce } = useContext(WebwalletContext)!
	const { biconomyDaoObj, biconomyWalletClient, loadingBiconomyMap, initiateBiconomy } = useContext(BiconomyContext)!

	useEffect(() => {
		if(typeof window === 'undefined') {
			return
		}

		const chainId = data.chainId

		if(!webwallet || !nonce || !chainId) {
			return
		}

		initiateBiconomy(chainId)
	}, [initiateBiconomy, data.chainId, nonce])

	return {
		biconomyDaoObj: biconomyDaoObj,
		biconomyWalletClient: biconomyWalletClient,
		scwAddress: scwAddress,
		loading: !!loadingBiconomyMap[data.chainId!],
	}
}