import { useContext, useEffect, useMemo, useState } from 'react'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BaseProvider } from '@ethersproject/providers'
import { ec as EC } from 'elliptic'
import { Wallet } from 'ethers'
import { arrayify, joinSignature, keccak256, recoverPublicKey, resolveProperties, serializeTransaction } from 'ethers/lib/utils'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { useGetTxHashesOfGrantManagersQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { useProvider } from 'wagmi'

const ec = new EC('secp256k1')

export function useSecureChannelFromTxHash(
	txHash: string | undefined,
	chainId: SupportedChainId
) {
	const provider = useProvider({ chainId })
	const { webwallet } = useContext(WebwalletContext)!
	const [data, setData] = useState<any>()
	const [error, setError] = useState<Error>()

	useEffect(() => {
		// cannot get secure channel without these
		if(!webwallet || !txHash) {
			return
		}

		let disposed = false;
		(async() => {
			try {
				const data = await getSecureChannelFromTxHash(
					provider,
					webwallet,
					txHash
				)

				if(!disposed) {
					setData(data)
					setError(undefined)
				}
			} catch(error: any) {
				console.log(`error in fetching pub key: ${error}`)
				if(!disposed) {
					setError(error)
				}
			}
		})()

		return () => {
			disposed = true
		}
	}, [txHash, chainId, webwallet, setData, setError])

	return {
		data,
		error
	}
}

/**
 * Generates a secure channel between the current wallet and another wallet B
 * @param provider provider to interact with RPC
 * @param webwallet our webwallet (private key is a must)
 * @param txHash hash of transaction made by wallet B
 * @returns utilities to securely encrypt/decrypt info with wallet B
 */
export async function getSecureChannelFromTxHash(
	provider: BaseProvider,
	webwallet: Wallet,
	txHash: string,
	extraInfo?: string
) {
	const encoder = new TextEncoder()
	const decoder = new TextDecoder()
	// first we fetch the tx details from the hash
	// and derive the public key
	const tx = await provider.getTransaction(txHash!)
	const publicKey = await getPublicKeyFromTx(tx)
	// second we use our private key & wallet B's public key
	// to perform ECDH & generate a shared key
	const keyPair = ec.keyFromPrivate(webwallet.privateKey)
	const pubKey = ec.keyFromPublic(publicKey)
	const sharedKeyBn = keyPair.derive(pubKey.getPublic())
	// lastly we hash the shared key with some extra info
	// to generate a unique shared key that will be used for AES crypto
	const sharedKeyHex = sharedKeyBn.toString('hex')
	const sharedKeySeed = encoder.encode(sharedKeyHex + extraInfo)
	const sharedAesKey = arrayify(keccak256(sharedKeySeed))

	// first 16 bytes of the extra info form the IV
	const iv = arrayify(keccak256(encoder.encode(extraInfo || ''))).slice(0, 16)
	// generate subtlecrypto key from raw bytes
	const subtle = window.crypto.subtle
	const subtleKey = await subtle.importKey('raw', sharedAesKey, 'aes-cbc', false, ['encrypt', 'decrypt'])

	return {
		/**
		 * encrypts general UTF-8 encoded text/binary data
		 * @returns base64 encrypted ciphertext
		 * */
		async encrypt(plaintext: string) {
			const encArrayBuffer = await crypto.subtle.encrypt(
				{ name: 'aes-cbc', iv: iv },
				subtleKey,
				encoder.encode(plaintext)
			)
			// from: https://stackoverflow.com/a/42334410
			const enc = new Uint8Array(encArrayBuffer)
    			.reduce((data, byte) => data + String.fromCharCode(byte), '')
			return window.btoa(enc)
		},
		/** decrypts base64 encoded text/binary data */
		async decrypt(ciphertext: string) {
			const ciphertextLatin1 = window.atob(ciphertext)
			const ciphertextBytes = Uint8Array.from(ciphertextLatin1, c => c.charCodeAt(0))
			const result = await crypto.subtle.decrypt(
				{ name: 'aes-cbc', iv: iv },
				subtleKey,
				ciphertextBytes,
			)

			return decoder.decode(result)
		}
	}
}

/**
 * Fetch a transaction hash of each of the grant managers
 * @param grantId the grant to fetch the managers from
 * @param chainId the chain to fetch on
 * @returns map of wallet address to tx hash
 */
export async function useGetTxHashesOfGrantManagers(grantId: string, chainId: SupportedChainId) {
	const { subgraphClients } = useContext(ApiClientsContext)!
	const { client } = subgraphClients[chainId]

	const { data } = useGetTxHashesOfGrantManagersQuery({
		client,
		variables: { grantId }
	})

	const map = useMemo(() => {
		const result: { [address: string]: string } = { }
		for(const { member } of (data?.grantManagers || [])) {
			if(member) {
				result[member.actorId] = member.lastKnownTxHash
			}
		}

		return result
	}, [data])

	return map
}

/**
 * retreives the public key from a transaction
 * from: https://ethereum.stackexchange.com/questions/78815/ethers-js-recover-public-key-from-contract-deployment-via-v-r-s-values
 * @param tx the transaction object
 */
async function getPublicKeyFromTx(tx: TransactionResponse) {
	const expandedSig = {
		r: tx.r!,
		s: tx.s!,
		v: tx.v!
	}
	const signature = joinSignature(expandedSig)
	const txData = {
		gasPrice: tx.gasPrice,
		gasLimit: tx.gasLimit,
		value: tx.value,
		nonce: tx.nonce,
		data: tx.data,
		chainId: tx.chainId,
		to: tx.to // you might need to include this if it's a regular tx and not simply a contract deployment
	}
	const rsTx = await resolveProperties(txData)
	const raw = serializeTransaction(rsTx) // returns RLP encoded tx
	const msgHash = keccak256(raw) // as specified by ECDSA
	const msgBytes = arrayify(msgHash) // create binary hash
	const recoveredPubKey = recoverPublicKey(msgBytes, signature)

	return arrayify(recoveredPubKey)
}