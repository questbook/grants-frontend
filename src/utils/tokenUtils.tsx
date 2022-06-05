import { CHAIN_INFO, SupportedChainId } from 'src/constants/chains'

export function getAssetInfo(asset?: string, chainId?: SupportedChainId) {
	asset = asset?.toLowerCase()
	const chain = CHAIN_INFO[chainId!] || CHAIN_INFO[SupportedChainId.RINKEBY]

	return {
		label: chain?.supportedCurrencies[asset!]?.label ?? '',
		icon: chain?.supportedCurrencies[asset!]?.icon ?? '',
	}
}
