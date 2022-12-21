import axios from 'axios'
import SAFES_ENDPOINTS_MAINNETS from 'src/constants/safesEndpoints.json'
import SAFES_ENDPOINTS_TESTNETS from 'src/constants/safesEndpointsTest.json'
import logger from 'src/utils/logger'

const SAFES_ENDPOINTS = { ...SAFES_ENDPOINTS_MAINNETS, ...SAFES_ENDPOINTS_TESTNETS }
type ValidChainID = keyof typeof SAFES_ENDPOINTS;

const NETWORK_PREFIX: { [key: string]: string } = {
	'4': 'rin',
	'137': 'matic',
	'1': 'eth',
	'10': 'opt',
	'5': 'gor',
	'40': 'tlos'
}

export function getSafeURL(safeAddress: string, chainId: string) {
	if(chainId === '42220') {
		return `https://safe.celo.org/#/safes/${safeAddress}`
	} else if(chainId === '40') {
		return `https://safe.telos.net/${NETWORK_PREFIX[chainId]}:${safeAddress}`
	} else {
		return `https://app.safe.global/${NETWORK_PREFIX[chainId]}:${safeAddress}`
	}
}

export function getGnosisTansactionLink(safeAddress: string, chainId: string) {
	if(chainId === '42220') {
		return `https://safe.celo.org/#/safes/${safeAddress}/transactions`
	} else if(chainId === '40') {
		return `https://safe.telos.net/${NETWORK_PREFIX[chainId]}:${safeAddress}/transactions/queue`
	} else {
		return `https://app.safe.global/${NETWORK_PREFIX[chainId]}:${safeAddress}/transactions/queue`
	}
}

export async function getTokenBalance(safeNetworkId: string, safeAddress: string) {
	const gnosisUrl = `${SAFES_ENDPOINTS[safeNetworkId as ValidChainID]}v1/safes/${safeAddress}/balances/usd`
	console.log('fetching tokens from ', gnosisUrl)
	const response = await axios.get(gnosisUrl)

	return response

}


export async function getTransactionHashStatus(safeNetworkId: string, transactionHash: string) {
	const API_URL = `${SAFES_ENDPOINTS[safeNetworkId as ValidChainID]}/v1/multisig-transactions/${transactionHash}/`
	const response = await axios.get(API_URL)
	logger.info({ data: response.data }, 'transaction status')
	const txnDetails = response.data
	if(txnDetails.isExecuted) {
		return { ...txnDetails, status: 1 }
	} else {
		return null
	}
}