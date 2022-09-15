import { useContext, useEffect } from 'react'
import { BiconomyContext, WebwalletContext } from 'pages/_app'

export const useBiconomy = (props: { chainId?: string, shouldRefreshNonce?: boolean }) => {
	const { webwallet, scwAddress, nonce } = useContext(WebwalletContext)!
	const { biconomyDaoObjs, biconomyWalletClients, loadingBiconomyMap, initiateBiconomy } = useContext(BiconomyContext)!

	useEffect(() => {
		if(typeof window === 'undefined') {
			return
		}

		const chainId = props.chainId

		if(!webwallet || !nonce || !chainId) {
			return
		}

		initiateBiconomy(chainId)
	}, [initiateBiconomy, props.chainId, nonce])

	return {
		biconomyDaoObj: (!!biconomyDaoObjs && props.chainId) ? biconomyDaoObjs[props.chainId] : undefined,
		biconomyWalletClient: (!!biconomyWalletClients && props.chainId) ? biconomyWalletClients[props.chainId] : undefined,
		scwAddress: scwAddress,
		loading: !!loadingBiconomyMap[props.chainId!],
	}
}