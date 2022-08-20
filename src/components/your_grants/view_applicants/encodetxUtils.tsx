import { utils } from 'ethers'
import { MetaTransaction } from 'ethers-multisend'

const encodeMetaTransaction = (tx: MetaTransaction): string => {
	const data = utils.arrayify(tx.data)
	const encoded = utils.solidityPack(
		['uint8', 'address', 'uint256', 'uint256', 'bytes'],
		[tx.operation, tx.to, tx.value, data.length, data]
	)
	return encoded.slice(2)
}


export const encodeMultiSend = (txs: MetaTransaction[]): string => {
	return '0x' + txs.map((tx) => encodeMetaTransaction(tx)).join('')
}
