import { AddressMap, QBContract } from 'src/types'
import { CHAIN_INFO } from './chains'

export const WORKSPACE_REGISTRY_ADDRESS = compileAddresses('workspace')
export const APPLICATION_REGISTRY_ADDRESS = compileAddresses('applications')
export const APPLICATION_REVIEW_REGISTRY_ADDRESS = compileAddresses('reviews')
export const GRANT_FACTORY_ADDRESS = compileAddresses('grantFactory')

function compileAddresses(contract: QBContract) {
	return Object.values(CHAIN_INFO).reduce(
		(acc, chainInfo) => {
			acc[chainInfo.id] = chainInfo.qbContracts[contract]
			return acc
		}, { } as AddressMap
	)
}