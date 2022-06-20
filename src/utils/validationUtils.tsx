/* eslint-disable no-underscore-dangle */
import { SupportedNetwork as SupportedValidatorNetwork } from '@questbook/service-validator-client/dist/api'
import { ethers } from 'ethers'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import { SupportedNetwork } from 'src/generated/graphql'
import { MinimalWorkspace } from 'src/types'

const isValidAddress = (address: string) => ethers.utils.isAddress(address)
const isValidEmail = (email: string) => {
	// eslint-disable-next-line no-useless-escape
	const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regexp.test(email)
}

const getSupportedChainIdFromSupportedNetwork = (chainId: SupportedNetwork) => {

	// console.log('chain Id', chainId)
	if(!(chainId.slice(chainId.indexOf('_') + 1) === 'undefined')) {
		const chainid = parseInt(chainId.slice(chainId.indexOf('_') + 1))
		return CHAIN_INFO[chainid as SupportedChainId].id
	}

	return CHAIN_INFO['4'].id
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
	return CHAIN_INFO[chainId].id.toString() as SupportedValidatorNetwork
}

export {
	isValidAddress,
	isValidEmail,
	getSupportedChainIdFromWorkspace,
	getSupportedValidatorNetworkFromChainId,
	getSupportedChainIdFromSupportedNetwork,
}
