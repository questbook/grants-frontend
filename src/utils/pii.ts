import { useContext } from 'react'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BaseProvider } from '@ethersproject/providers'
import { ec as EC } from 'elliptic'
import { Wallet } from 'ethers'
import { arrayify, joinSignature, keccak256, recoverPublicKey, resolveProperties, serializeTransaction } from 'ethers/lib/utils'
import { ApiClientsContext } from 'pages/_app'
import { useGetGrantManagersWithPublicKeyQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'

const ec = new EC('secp256k1')

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
	// first we fetch the tx details from the hash
	// and derive the public key
	const tx = await provider.getTransaction(txHash!)
	const publicKey = await getPublicKeyFromTx(tx)

	return getSecureChannelFromPublicKey(webwallet, publicKey, extraInfo)
}


/**
 * Generates a secure channel between the current wallet and another wallet B
 * @param provider provider to interact with RPC
 * @param webwallet our webwallet (private key is a must)
 * @param publicKey public key of wallet B
 * @returns utilities to securely encrypt/decrypt info with wallet B
 */
export async function getSecureChannelFromPublicKey(
	webwallet: Wallet,
	publicKeyStr: string,
	extraInfo?: string
) {
	const encoder = new TextEncoder()
	const decoder = new TextDecoder()

	const publicKey = arrayify(publicKeyStr)
	// we use our private key & wallet B's public key
	// to perform ECDH & generate a shared key
	const keyPair = ec.keyFromPrivate(arrayify(webwallet.privateKey))
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
export function useGetPublicKeysOfGrantManagers(grantId: string | undefined, chainId: SupportedChainId) {
	const { subgraphClients } = useContext(ApiClientsContext)!
	const { client } = subgraphClients[chainId]

	const { fetchMore } = useGetGrantManagersWithPublicKeyQuery({
		client,
		skip: true,
	})

	return {
		async fetch() {
			const { data } = await fetchMore({
				variables: { grantID: grantId || '' }
			})
			const result: { [address: string]: string | null } = { }
			for(const { member } of (data?.grantManagers || [])) {
				if(member) {
					result[member.actorId] = member.publicKey || null
				}
			}

			return result
		}
	}
}

/**
 * retreives the public key from a transaction
 * from: https://ethereum.stackexchange.com/questions/78815/ethers-js-recover-public-key-from-contract-deployment-via-v-r-s-values
 * @param tx the transaction object
 * @returns the public key hex
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

	return recoveredPubKey
}

/** key of an application; can pass as "extraInfo" when generating shared key */
export function getKeyForApplication(applicationId: string) {
	return `app:${applicationId}`
}