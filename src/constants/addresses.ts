import { CHAIN_INFO } from 'src/constants/chains'
import { AddressMap, QBContract } from 'src/types'

export const WORKSPACE_REGISTRY_ADDRESS = compileAddresses('workspace')
export const APPLICATION_REGISTRY_ADDRESS = compileAddresses('applications')
export const APPLICATION_REVIEW_REGISTRY_ADDRESS = compileAddresses('reviews')
export const GRANT_FACTORY_ADDRESS = compileAddresses('grantFactory')
export const COMMUNICATION_ADDRESS = compileAddresses('communication')

function compileAddresses(contract: QBContract) {
	return Object.values(CHAIN_INFO).reduce(
		(acc, chainInfo) => {
			acc[chainInfo.id] = chainInfo.qbContracts[contract]
			return acc
		}, { } as AddressMap
	)
}