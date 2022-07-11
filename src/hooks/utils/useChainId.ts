import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import { useNetwork } from 'wagmi'

/**
 * Return the chain ID if supported by the app, otherwise return undefined
 * @returns the chain ID if supported -- undefined otherwise
 */
export default function useChainId() {
	// @TODO: Change here!
	const { activeChain } = useNetwork()
	// return CHAIN_INFO[activeChain?.id as SupportedChainId]?.id
	return CHAIN_INFO["80001"]?.id
}
