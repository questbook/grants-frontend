import axios from "axios"
import SAFES_ENDPOINTS_MAINNETS from 'src/constants/safesEndpoints.json'
import SAFES_ENDPOINTS_TESTNETS from 'src/constants/safesEndpointsTest.json'

const SAFES_ENDPOINTS = { ...SAFES_ENDPOINTS_MAINNETS, ...SAFES_ENDPOINTS_TESTNETS }
type ValidChainID = keyof typeof SAFES_ENDPOINTS;

const NETWORK_PREFIX: {[key: string]: string} = {
	'4': 'rin',
	'137': 'matic',
	'1': 'eth',
	'10': 'opt'
}

export function getGnosisTansactionLink(safeAddress: string, chainId: string) {
	if(chainId === '42220') {
		return `https://safe.celo.org/#/safes/${safeAddress}/transactions`
	} else {
		return `https://gnosis-safe.io/app/${NETWORK_PREFIX[chainId]}:${safeAddress}/transactions/queue`
	}
}

export async function getTokenBalance(safeNetworkId: string, safeAddress: string) {
	const gnosisUrl = `${SAFES_ENDPOINTS[safeNetworkId as ValidChainID]}/v1/safes/${safeAddress}/balances/usd`
	const response = await axios.get(gnosisUrl)
	
	return response

} 


