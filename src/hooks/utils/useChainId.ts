import React, { useEffect } from 'react'
import { SupportedChainId } from 'src/constants/chains'
import { useNetwork } from 'wagmi'

export default function useChainId() {
	const { activeChain } = useNetwork()
	const supportedChainIdFromNetworkData = (chainId: number) => {
		if(chainId === 4) {
			return SupportedChainId.RINKEBY
		}

		if(chainId === 1666700000) {
			return SupportedChainId.HARMONY_TESTNET
		}

		if(chainId === 137) {
			return SupportedChainId.POLYGON_MAINNET
		}

		if(chainId === 80001) {
			return SupportedChainId.POLYGON_MUMBAI
		}

		if(chainId === 10) {
			return SupportedChainId.OPTIMISM_MAINNET
		}

		if(chainId === 69) {
			return SupportedChainId.OPTIMISM_KOVAN
		}

		if(chainId === 245022926) {
			return SupportedChainId.NEON_DEVNET
		}

		if(chainId === 44787) {
			return SupportedChainId.CELO_ALFAJORES_TESTNET
		}

		if(chainId === 1666600000) {
			return SupportedChainId.HARMONY_MAINNET
		}

		if(chainId === 1001) {
			return SupportedChainId.KLAYTN_TESTNET
		}

		return undefined
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
