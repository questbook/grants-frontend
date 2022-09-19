import {
	CHAIN_INFO,
	defaultChainId,
	SupportedChainId,
} from 'src/constants/chains'
import { ChainInfo, Grant } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

export function getAssetInfo(asset?: string, chainId?: SupportedChainId) {
	asset = asset?.toLowerCase()
	const chain = CHAIN_INFO[chainId!] || CHAIN_INFO[defaultChainId]

	return {
		label: chain?.supportedCurrencies[asset!]?.label || '',
		icon: chain?.supportedCurrencies[asset!]?.icon || '',
	}
}

export function getChainInfo(grant: { reward: Grant['reward'] }, chainId: SupportedChainId): ChainInfo['supportedCurrencies'][string] {
	// let chainInfo: ChainInfo['supportedCurrencies'][string]
	let tokenIcon: string
	let chainInfo =
		CHAIN_INFO[chainId]?.supportedCurrencies[
			grant.reward.asset.toLowerCase()
		]

	if(!chainInfo && grant.reward.token) {
		tokenIcon = getUrlForIPFSHash(grant.reward.token.iconHash)
		chainInfo = {
			address: grant.reward.token.address,
			label: grant.reward.token.label,
			pair: undefined,
			decimals: +grant.reward.token.decimal,
			icon: tokenIcon,
		}
	} else if(!chainInfo && !grant.reward.token) {
		chainInfo = {
			address: '',
			label: 'UNSUP',
			decimals: 18,
			pair: undefined,
			icon: '',
		}
	}

	return chainInfo
}

export function getSafeIcon(safeChainId: string | undefined) {
	if(!safeChainId) {
		return ''
	}

	if(safeChainId === '900001') {
		return '/safes_icons/realms.svg'
	} else if(safeChainId === '42220') {
		return '/safes_icons/celo.svg'
	} else {
		return '/safes_icons/gnosis.svg'
	}
}
