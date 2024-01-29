import axios from 'axios'
import SAFES_ENDPOINTS_MAINNETS from 'src/constants/safesEndpoints.json'
import SAFES_ENDPOINTS_TESTNETS from 'src/constants/safesEndpointsTest.json'
import logger from 'src/libraries/utils/logger'

const SAFES_ENDPOINTS = { ...SAFES_ENDPOINTS_MAINNETS, ...SAFES_ENDPOINTS_TESTNETS }
type ValidChainID = keyof typeof SAFES_ENDPOINTS;

const NETWORK_PREFIX: { [key: string]: string } = {
	'4': 'rin',
	'137': 'matic',
	'1': 'eth',
	'10': 'opt',
	'5': 'gor',
	'40': 'tlos',
	'4689': 'iotx',
	'4690': 'iotxtest',
	'42161': 'arb1'
}

export function getSafeURL(safeAddress: string, chainId: string) {
	if(chainId === '42220') {
		return `https://safe.celo.org/#/safes/${safeAddress}`
	} else if(chainId === '40') {
		return `https://safe.telos.net/${NETWORK_PREFIX[chainId]}:${safeAddress}`
	} else if(chainId === '4689' || chainId === '4690') {
		return `https://safe.iotex.io/${NETWORK_PREFIX[chainId]}:${safeAddress}`
	} else if(chainId === '512341' || chainId === '512342') {
		return `https://tonkey.app/transactions/history?safe=${safeAddress}`
	} else {
		return `https://app.safe.global/${NETWORK_PREFIX[chainId]}:${safeAddress}`
	}

}

export function getGnosisTansactionLink(safeAddress: string, chainId: string, txnHash: string) {
	if(chainId === '42220') {
		return `https://safe.celo.org/#/safes/${safeAddress}/transactions/tx?id=multisig_${safeAddress}_${txnHash}`
	} else if(chainId === '40') {
		return `https://safe.telos.net/${NETWORK_PREFIX[chainId]}:${safeAddress}/transactions/tx?id=multisig_${safeAddress}_${txnHash}`
	} else if(chainId === '4689' || chainId === '4690') {
		return `https://safe.iotex.io/${NETWORK_PREFIX[chainId]}:${safeAddress}/transactions/tx?id=multisig_${safeAddress}_${txnHash}`
	} else {
		//https://app.safe.global/gor:0xC113838A0d214a2Bd15d038701ec5957E83C4381/transactions/tx?id=multisig_0xC113838A0d214a2Bd15d038701ec5957E83C4381_0x9bae709b06a962681f9e0ff443b80685071ef95d713aae506ab22b07e6721aeb
		return `https://app.safe.global/${NETWORK_PREFIX[chainId]}:${safeAddress}/transactions/tx?id=multisig_${safeAddress}_${txnHash}`
	}
}

export async function getTokenBalance(safeNetworkId: string, safeAddress: string) {
	const gnosisUrl = `${SAFES_ENDPOINTS[safeNetworkId as ValidChainID]}v1/safes/${safeAddress}/balances/usd`
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

export function getProposalUrl(realmPk: string, proposalAddr: string) {
	return `https://app.realms.today/dao/${realmPk}/proposal/${proposalAddr}`
}

export function getRealmsURL(realmPk: string) {
	return `https://app.realms.today/dao/${realmPk}`
}

export function getTonkeyProposalUrl(id: string, transactionStatus: string) {
	return `https://tonkey.app/transactions/${transactionStatus}?safe=${id}`
}