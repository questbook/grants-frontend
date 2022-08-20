import axios from 'axios'
import BigNumber from 'bignumber.js'
//@ts-ignore
import EIP712Domain from 'eth-typed-data'
import * as ethUtil from 'ethereumjs-util'
import { utils } from 'ethers'

/*
 * Safe relay service example
 * * * * * * * * * * * * * * * * * * * */

const gnosisEstimateTransaction = async(safe: string, tx: any): Promise<any> => {
	console.log(JSON.stringify(tx))
	try {
		const resp = await axios.post(`https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safe}/multisig-transactions/estimations/`, tx)
		console.log(resp.data)
		return resp.data
	} catch(e) {
		console.log(JSON.stringify(e.response.data))
		throw e
	}
}

const gnosisSubmitTx = async(safe: string, tx: any): Promise<any> => {
	try {
		const resp = await axios.post(`https://safe-relay.rinkeby.gnosis.pm/api/v1/safes/${safe}/transactions/`, tx)
		console.log(resp.data)
		return resp.data
	} catch(e) {
		console.log(JSON.stringify(e.response.data))
		throw e
	}
}

const execute = async(safe, privateKey) => {
	const safeDomain = new EIP712Domain({
		verifyingContract: safe,
	})

	const SafeTx = safeDomain.createType('SafeTx', [
		{ type: 'address', name: 'to' },
		{ type: 'uint256', name: 'value' },
		{ type: 'bytes', name: 'data' },
		{ type: 'uint8', name: 'operation' },
		{ type: 'uint256', name: 'safeTxGas' },
		{ type: 'uint256', name: 'baseGas' },
		{ type: 'uint256', name: 'gasPrice' },
		{ type: 'address', name: 'gasToken' },
		{ type: 'address', name: 'refundReceiver' },
		{ type: 'uint256', name: 'nonce' },
	])

	const to = utils.getAddress('0x0ebd146ffd9e20bf74e374e5f3a5a567a798177e')

	const baseTxn = {
		to,
		value: '1000',
		data: '0x',
		operation: '0',
	}

	console.log(JSON.stringify({ baseTxn }))

	const { safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, lastUsedNonce } = await gnosisEstimateTransaction(
		safe,
		baseTxn,
	)

	const txn = {
		...baseTxn,
		safeTxGas,
		baseGas,
		gasPrice,
		gasToken,
		nonce: lastUsedNonce === undefined ? 0 : lastUsedNonce + 1,
		refundReceiver: refundReceiver || '0x0000000000000000000000000000000000000000',
	}

	console.log({ txn })
	const safeTx = new SafeTx({
		...txn,
		data: utils.arrayify(txn.data)
	})
	const signer = async(data: Buffer) => {
		const { r, s, v } = ethUtil.ecsign(data, ethUtil.toBuffer(privateKey))
		return {
			r: new BigNumber(r.toString('hex'), 16).toString(10),
			s: new BigNumber(s.toString('hex'), 16).toString(10),
			v
		}
	}

	const signature = await safeTx.sign(signer)

	console.log({ signature })

	const toSend = {
		...txn,
		dataGas: baseGas,
		signatures: [signature],
	}

	console.log(JSON.stringify({ toSend }))

	const { data } = await gnosisSubmitTx(safe, toSend)
	console.log({ data })
	console.log('Done?')
}

// This example uses the relay service to execute a transaction for a Safe
// execute('<safe>', '<0x_signer_private_key>')

/*
 * Safe transaction service example
 * * * * * * * * * * * * * * * * * * * */

const gnosisProposeTx = async(safe: string, tx: any): Promise<any> => {
	try {
		const resp = await axios.post(`https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safe}/transactions/`, tx)
		console.log(resp.data)
		return resp.data
	} catch(e) {
		if(e.response) {
			console.log(JSON.stringify(e.response.data))
		}

		throw e
	}
}

const submitTx = async(safe, sender, privateKey, tx, chainId) => {

	const safeDomain = new EIP712Domain({
		verifyingContract: safe,
	})

	console.log('chain id ---> ', chainId)

	const EIP712_SAFE_TX_TYPE = {
		SafeTx: [
			{ type: 'address', name: 'to' },
			{ type: 'uint256', name: 'value' },
			{ type: 'bytes', name: 'data' },
			{ type: 'uint8', name: 'operation' },
			{ type: 'uint256', name: 'safeTxGas' },
			{ type: 'uint256', name: 'baseGas' },
			{ type: 'uint256', name: 'gasPrice' },
			{ type: 'address', name: 'gasToken' },
			{ type: 'address', name: 'refundReceiver' },
			{ type: 'uint256', name: 'nonce' },
		]
	}

	// const safeTxHash = utils._TypedDataEncoder.hash({
	// 	chainId: ethers.BigNumber.from(chainId),
	// 	verifyingContract: safe,
	// }, EIP712_SAFE_TX_TYPE, tx)
	const SafeTx = safeDomain.createType('SafeTx', [
		{ type: 'address', name: 'to' },
		{ type: 'uint256', name: 'value' },
		{ type: 'bytes', name: 'data' },
		{ type: 'uint8', name: 'operation' },
		{ type: 'uint256', name: 'safeTxGas' },
		{ type: 'uint256', name: 'baseGas' },
		{ type: 'uint256', name: 'gasPrice' },
		{ type: 'address', name: 'gasToken' },
		{ type: 'address', name: 'refundReceiver' },
		{ type: 'uint256', name: 'nonce' },
	])

	const to = utils.getAddress('0x0ebd146ffd9e20bf74e374e5f3a5a567a798177e')

	// tx['operation'] = 1
	const baseTxn = tx

	console.log(JSON.stringify({ baseTxn }))

	// Let the Safe service estimate the tx and retrieve the nonce
	// const { safeTxGas, lastUsedNonce } = await gnosisEstimateTransaction(
	// 	safe,
	// 	baseTxn,
	// )

	const txn = {
		...baseTxn,
		safeTxGas: 5000,
		// Here we can also set any custom nonce
		nonce: 34,
		// We don't want to use the refund logic of the safe to lets use the default values
		baseGas: 0,
		gasPrice: 0,
		gasLimit: 20000,
		gasToken: '0x0000000000000000000000000000000000000000',
		refundReceiver: '0x0000000000000000000000000000000000000000',
	}

	console.log({ txn })
	const safeTx = new SafeTx({
		...txn,
		data: utils.arrayify(txn.data)
	})
	const signer = async data => {
		const { r, s, v } = ethUtil.ecsign(data, ethUtil.toBuffer(privateKey))
		return ethUtil.toRpcSig(v, r, s)
	}

	// const signHash = async(signer, hash: string) => {
	// 	const typedDataHash = utils.arrayify(hash)
	// 	return {
	// 		signer: signer.address,
	// 		data: (await signer.signMessage(typedDataHash)).replace(/1b$/, '1f').replace(/1c$/, '20')
	// 	}
	// }

	// const signature = await signHash(signer, safeTxHash)
	const signature = await safeTx.sign(signer)

	console.log({ signature })

	const toSend = {
		...txn,
		sender,
		contractTransactionHash: '0xb40e500adee27688c2d15390fc585ecd31d55fc025698ee04daf4a0004492d3b',
		signature: signature,
	}

	console.log(JSON.stringify({ toSend }))

	const { data } = await gnosisProposeTx(safe, toSend)
	console.log({ data })
	console.log('Done?')
}

// This example uses the transaction service to propose a transaction to the Safe Multisig interface
// submit('<safe>', '<0x_signer_address>', '<0x_signer_private_key>')

export default submitTx
