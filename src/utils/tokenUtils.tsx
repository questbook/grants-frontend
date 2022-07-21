import {
	CHAIN_INFO,
	defaultChainId,
	SupportedChainId,
} from 'src/constants/chains'
import { ChainInfo } from 'src/types'
import { getUrlForIPFSHash } from './ipfsUtils'

export function getAssetInfo(asset?: string, chainId?: SupportedChainId) {
	asset = asset?.toLowerCase()
	const chain = CHAIN_INFO[chainId!] || CHAIN_INFO[defaultChainId]

	return {
		label: chain?.supportedCurrencies[asset!]?.label ?? '',
		icon: chain?.supportedCurrencies[asset!]?.icon ?? '',
	}
}

export function getChainInfo(grant: any, chainId: SupportedChainId) : ChainInfo['supportedCurrencies'][string] {
	// let chainInfo: ChainInfo['supportedCurrencies'][string]
	let tokenIcon: string
	let chainInfo =
      CHAIN_INFO[chainId]?.supportedCurrencies[
      	grant.reward.asset.toLowerCase()
      ]
	if(!chainInfo) {
		tokenIcon = getUrlForIPFSHash(grant.reward.token?.iconHash)
		chainInfo = {
			address: grant.reward.token.address,
			label: grant.reward.token.label,
			decimals: parseInt(grant.reward.token.decimal, 10),
			icon: tokenIcon,
		}
	}

	return chainInfo
}
