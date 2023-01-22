
import { useContext, useMemo } from 'react'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import { WebwalletContext } from 'src/contexts/WebwalletContext'

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
