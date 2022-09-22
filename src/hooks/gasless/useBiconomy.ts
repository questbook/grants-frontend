import { useContext, useEffect } from 'react'
import { BiconomyContext, WebwalletContext } from 'src/pages/_app'
import logger from 'src/utils/logger'

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

	useEffect(() => {
		logger.info({ biconomyWalletClients, isPresent: biconomyWalletClients?.[props.chainId!], chainId: props.chainId, isPresentInt: biconomyWalletClients?.[parseInt(props.chainId!)] }, 'Biconomy Wallet Client')
	}, [biconomyWalletClients])

	return {
		biconomyDaoObj: (!!biconomyDaoObjs && props.chainId) ? biconomyDaoObjs[props.chainId] : undefined,
		biconomyWalletClient: (!!biconomyWalletClients && props.chainId) ? biconomyWalletClients[props.chainId] : undefined,
		scwAddress: scwAddress,
		loading: !!loadingBiconomyMap[props.chainId!],
	}
}