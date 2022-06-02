/* eslint-disable no-underscore-dangle */
import { SupportedNetwork as SupportedValidatorNetwork } from '@questbook/service-validator-client/dist/api'
import { ethers } from 'ethers'
import { SupportedChainId } from 'src/constants/chains'
import { SupportedNetwork } from 'src/generated/graphql'
import { MinimalWorkspace } from 'src/types'

const isValidAddress = (address: string) => ethers.utils.isAddress(address)
const isValidEmail = (email: string) => {
	// eslint-disable-next-line no-useless-escape
	const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regexp.test(email)
}

const getSupportedChainIdFromSupportedNetwork = (chainId: SupportedNetwork) => {
	if(chainId === SupportedNetwork.Chain_137) {
		return SupportedChainId.POLYGON_MAINNET
	}

	if(chainId === SupportedNetwork.Chain_10) {
		return SupportedChainId.OPTIMISM_MAINNET
	}

	// @TODO: needs type for harmony
	// if (chainId === SupportedNetwork.Chain_80001) {
	//   return SupportedChainId.HARMONY_TESTNET_S0;
	// }
	return SupportedChainId.POLYGON_MAINNET
	// cannot return undefined ?
	// return undefined;
}

const getSupportedChainIdFromWorkspace = (workspace?: MinimalWorkspace) => {
	if(!workspace) {
		return undefined
	}

	const chainId = workspace.supportedNetworks[0] as SupportedNetwork
	return getSupportedChainIdFromSupportedNetwork(chainId)
}

// eslint-disable-next-line arrow-body-style
const getSupportedValidatorNetworkFromChainId = (chainId: SupportedChainId) => {
	if(chainId === SupportedChainId.POLYGON_MAINNET) {
		return SupportedValidatorNetwork._137
	}

	if(chainId === SupportedChainId.OPTIMISM_MAINNET) {
		return SupportedValidatorNetwork._10
	}

	// @TODO: un-comment these lines.
	// if(chainId === SupportedChainId.CELO_ALFAJORES_TESTNET) {
	// 	return SupportedValidatorNetwork._44787
	// }

	// @TODO: needs type for harmony
	// if (chainId === SupportedNetwork.Chain_80001) {
	//   return SupportedChainId.HARMONY_TESTNET_S0;
	// }
	return SupportedValidatorNetwork._137
}

export {
	isValidAddress,
	isValidEmail,
	getSupportedChainIdFromWorkspace,
	getSupportedValidatorNetworkFromChainId,
	getSupportedChainIdFromSupportedNetwork,
}
