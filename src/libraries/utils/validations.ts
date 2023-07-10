import { SupportedNetwork as SupportedValidatorNetwork } from '@questbook/service-validator-client/dist/api'
import { PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { ethers } from 'ethers'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { SupportedNetwork } from 'src/generated/graphql'
import logger from 'src/libraries/utils/logger'
import { MinimalWorkspace } from 'src/types'

const isValidEthereumAddress = (address: string) => {
	return ethers.utils.isAddress(address)
}

const isValidSolanaAddress = (address: string) => {
	try {
		new PublicKey(address)
		return true
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		return false
	}
}

const isValidTonAddress = async(address: string) => {
	try {
		const res = await axios.get<{ok: boolean, error: string}>(`https://toncenter.com/api/v2/getAddressInformation?address=${address}`)
		return !!res.data?.ok
	} catch(e) {
		return false
	}
}

const isSupportedAddress = async(address: string) => {
	return true
	const isValidTon = await isValidTonAddress(address)
	logger.info({ eth: isValidEthereumAddress(address), sol: isValidSolanaAddress(address), ton: isValidTon }, 'isValidSafeAddress')
	return isValidEthereumAddress(address) || isValidSolanaAddress(address) || isValidTon
}

const isValidEmail = (email: string) => {
	// noinspection RegExpRedundantEscape,RegExpSimplifiable
	const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regexp.test(email)
}

/**
 * Get the numeric chain ID from the GraphQL supported network type.
 * @param chain GraphQL supported network, eg. "chain_245022926", "chain_4"
 * @returns the numeric chain ID, eg. 245022926, 4
 */
const getSupportedChainIdFromSupportedNetwork = (chain: SupportedNetwork | undefined): SupportedChainId => {
	if(chain) {
		const [, chainIdStr] = chain?.split('_')
		const chainId = +chainIdStr
		// if the chain ID is valid -- then it would be converted to a regular, non-NaN number
		// otherwise -- it's invalid and we simply return the default chain
		if(!Number.isNaN(chainId)) {
			return chainId
		}
	}

	// if the chain ID failed to decode -- return the default chain
	return defaultChainId
}

const getSupportedValidatorNetworkFromChainId = (chainId: SupportedChainId) => (
	chainId.toString() as SupportedValidatorNetwork
)

const getSupportedChainIdFromWorkspace = (workspace?: Pick<MinimalWorkspace, 'supportedNetworks'>) => {
	if(!workspace) {
		return undefined
	}

	const chainId = workspace.supportedNetworks[0] as SupportedNetwork
	return getSupportedChainIdFromSupportedNetwork(chainId)
}

export {
	isValidEthereumAddress,
	isValidSolanaAddress,
	isSupportedAddress,
	isValidEmail,
	getSupportedChainIdFromWorkspace,
	getSupportedValidatorNetworkFromChainId,
	getSupportedChainIdFromSupportedNetwork,
}
