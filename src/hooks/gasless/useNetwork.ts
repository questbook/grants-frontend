
import { useContext, useMemo } from 'react'
import { WebwalletContext } from 'pages/_app'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'

export const useNetwork = () => {
	const { network, switchNetwork } = useContext(WebwalletContext)!

	const data = useMemo(() => {
		if(network && network in CHAIN_INFO) {
			return CHAIN_INFO[network]
		}

		return CHAIN_INFO[defaultChainId]
	}, [network])

	return { activeChain: network, network, switchNetwork, data }
}
