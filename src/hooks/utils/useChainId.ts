import React, { useEffect } from 'react'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import { useNetwork } from 'wagmi'

export default function useChainId() {
	const { activeChain } = useNetwork()
	const supportedChainIdFromNetworkData = (chainId: number) => {
		return CHAIN_INFO[chainId as SupportedChainId].id ?? undefined
	}

	const [chainId, setChainId] = React.useState<SupportedChainId>()
	useEffect(() => {
		// console.log('changing net');
		if(!activeChain?.id) {
			setChainId(undefined)
			return
		}

		setChainId(supportedChainIdFromNetworkData(activeChain.id))
	}, [activeChain?.id])

	return chainId
}
