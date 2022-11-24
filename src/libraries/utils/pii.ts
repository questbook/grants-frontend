import { useCallback, useContext, useMemo } from 'react'
import { GrantApplicationRequest, GrantApplicationUpdate } from '@questbook/service-validator-client'
import { ec as EC } from 'elliptic'
import { ethers, Wallet } from 'ethers'
import {
	arrayify,
	keccak256,
} from 'ethers/lib/utils'
import { GetProposalsQuery, useGetGrantManagersWithPublicKeyQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import MAIN_LOGGER from 'src/utils/logger'

const ec = new EC('secp256k1')

// /**
//  * Generates a secure channel between the current wallet and another wallet B
//  * @param provider provider to interact with RPC
//  * @param webwallet our webwallet (private key is a must)
//  * @param txHash hash of transaction made by wallet B
//  * @param extraInfo
//  * @returns utilities to securely encrypt/decrypt info with wallet B
//  */
// export async function getSecureChannelFromTxHash(
// 	provider: BaseProvider,
// 	webwallet: Wallet,
// 	txHash: string,
// 	extraInfo?: string
// ) {
// 	// first we fetch the tx details from the hash
// 	// and derive the public key
// 	const tx = await provider.getTransaction(txHash!)
// 	const publicKey = await getPublicKeyFromTx(tx)
//
// 	return getSecureChannelFromPublicKey(webwallet, publicKey, extraInfo)
// }


/**
 * Generates a secure channel between the current wallet and another wallet B
 * @param webwallet our webwallet (private key is a must)
 * @param publicKeyStr
 * @param extraInfo
 * @returns utilities to securely encrypt/decrypt info with wallet B
 */
export async function getSecureChannelFromPublicKey(
	webwallet: Wallet,
	publicKeyStr: string,
	extraInfo?: string,
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
				encoder.encode(plaintext),
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
		},
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

	const fetch = useCallback(
		async() => {
			if(!grantId) {
				throw new Error('Cannot fetch grant managers without grantId')
			}

			const { data } = await fetchMore({
				variables: { grantID: grantId },
			})
			const result: { [address: string]: string | null } = {}
			for(const { member } of (data?.grantManagers || [])) {
				if(!member?.publicKey) {
					continue
				}

				try {
					// check if the public key is valid or not
					ethers.utils.computeAddress(member?.publicKey)
				} catch(e) {
					continue
				}

				if(member?.enabled) {
					result[member.actorId] = member.publicKey
				}
			}

			return result
		}, [fetchMore, grantId]
	)

	return { fetch }
}

export function useEncryptPiiForApplication(
	grantId: string | undefined,
	applicantPublicKey: string | undefined | null,
	chainId: SupportedChainId,
) {
	const { webwallet, scwAddress } = useContext(WebwalletContext)!
	const { fetch } = useGetPublicKeysOfGrantManagers(grantId, chainId)
	const logger = useMemo(
		() => MAIN_LOGGER.child({ grantId, 'pii': true }),
		[grantId],
	)

	/**
	 * @param data All the fields to encrypt
	 * @returns The ready to push PII data
	 */
	const encryptPii = useCallback(
		async(piiFields: GrantApplicationRequest['fields']) => {
			if(!webwallet || !scwAddress) {
				throw new Error('Zero Wallet not connected')
			}

			if(!grantId) {
				throw new Error('Grant ID not provided')
			}

			// JSON serialize the data for it to be encrypted
			const piiFieldsJson = JSON.stringify(piiFields)
			const piiMap: GrantApplicationRequest['pii'] = {}
			let publicKeys = await fetch()
			// add our wallet's public key
			// so we can access the sent information too
			publicKeys = {
				...publicKeys,
				[scwAddress]: applicantPublicKey!,
			}

			logger.info({
				fields: Object.keys(piiFields).length,
				members: Object.keys(publicKeys).length,
			}, 'encrypting fields')

			await Promise.all(
				Object.entries(publicKeys).map(async([address, pubKey]) => {
					if(!pubKey) {
						logger.info({ address }, 'pub key not present, ignoring...')
						return
					}

					try {
						const secureChannel = await getSecureChannelFromPublicKey(
							webwallet,
							pubKey,
							getKeyForGrantPii(grantId)
						)
						const data = await secureChannel.encrypt(piiFieldsJson)

						logger.info({ address }, 'encrypted data')
						// the subgraph can handle about 7000 bytes in a single field
						// so if the data is too big, we upload it to IPFS, and set the hash
						// we can unambigously determine if the encrypted data is an IPFS hash or not
						// using a simple isIpfsHash function
						if(data.length < 7000) {
							piiMap[address] = data
						} else {
							logger.info(
								{ data: data.length },
								'data too large, uploading to IPFS...'
							)
							const { hash: ipfsHash } = await uploadToIPFS(data)
							piiMap[address] = ipfsHash
						}
					} catch(e) {
						logger.error({ address, error: e }, 'failed to encrypt')
					}
				})
			)

			return piiMap
		}, [webwallet, grantId, fetch, scwAddress, logger]
	)

	/**
	 * decrypted encrypted PII data
	 * @param piiData the enc data
	 * @returns Decrypted fields data
	 */
	const decryptPii = useCallback(
		async(piiData: string) => {
			if(!webwallet) {
				throw new Error('Zero Wallet not connected')
			}

			if(!applicantPublicKey || !grantId) {
				throw new Error('Grant ID or applicant public key not provided')
			}

			const secureChannel = await getSecureChannelFromPublicKey(
				webwallet,
				applicantPublicKey!,
				getKeyForGrantPii(grantId!)
			)

			logger.info({ applicantPublicKey }, 'got secure channel with applicant')

			const decrypted = await secureChannel.decrypt(piiData)

			logger.info('decrypted PII data')

			const json = JSON.parse(decrypted) as GrantApplicationRequest['fields']

			return json
		}, [webwallet, grantId, applicantPublicKey, logger]
	)

	const encrypt = useCallback(
		async(
			data: Pick<GrantApplicationUpdate, 'fields' | 'pii'>,
			piiFields: string[]
		) => {
			if(data.fields) {
				const piiFieldMap = Object.entries(data.fields).reduce(
					(prev, [key, value]) => {
						if(piiFields.includes(key)) {
							prev[key] = value
							delete data.fields![key]
						}

						return prev
					}, { } as GrantApplicationRequest['fields']
				)
				data.pii = await encryptPii(piiFieldMap)
			}
		}, [encryptPii]
	)

	/**
	 * decrypt a grant application if it has PII;
	 * otherwise return as is
	 */
	const decrypt = useCallback(
		async(app: Exclude<GetProposalsQuery['grantApplications'], null | undefined>[number]) => {
			if(app?.pii?.length) {
				logger.info('Encrypted Data', app)
				if(!scwAddress || !applicantPublicKey || !grantId) {
					logger.debug('skipping decryption, as details not present')
					return
				}

				const piiData = app.pii.find(p => {
					const idLowerCase = p.id.toLowerCase()
					return idLowerCase.endsWith(webwallet!.address.toLowerCase())
						|| idLowerCase.endsWith(scwAddress.toLowerCase())
				})
				if(piiData) {
					try {
						const fields = await decryptPii(piiData.data)
						// hacky way to copy the object
						app = JSON.parse(JSON.stringify({
							...app,
							// also remove PII from the application
							// since we don't require that anymore
							pii: undefined,
							fields: [
								...app.fields,
								// add all PII fields to the application
								...Object.entries(fields).map(([id, value]) => {
									return {
										id: `${app!.id}.${id}`,
										values: value
									}
								})
							]
						}))
					} catch(err) {
						logger.error({ err }, 'error in decrypting PII')
					}
				} else {
					logger.warn('app has PII, but not encrypted for user')
				}
			}

			return app
		}, [scwAddress, webwallet, applicantPublicKey, grantId, decryptPii]
	)

	return {
		encrypt,
		decrypt,
	}
}

// /**
//  * retreives the public key from a transaction
//  * from: https://ethereum.stackexchange.com/questions/78815/ethers-js-recover-public-key-from-contract-deployment-via-v-r-s-values
//  * @param tx the transaction object
//  * @returns the public key hex
//  */
// async function getPublicKeyFromTx(tx: TransactionResponse) {
// 	const expandedSig = {
// 		r: tx.r!,
// 		s: tx.s!,
// 		v: tx.v!
// 	}
// 	const signature = joinSignature(expandedSig)
// 	const txData = {
// 		gasPrice: tx.gasPrice,
// 		gasLimit: tx.gasLimit,
// 		value: tx.value,
// 		nonce: tx.nonce,
// 		data: tx.data,
// 		chainId: tx.chainId,
// 		to: tx.to // you might need to include this if it's a regular tx and not simply a contract deployment
// 	}
// 	const rsTx = await resolveProperties(txData)
// 	const raw = serializeTransaction(rsTx) // returns RLP encoded tx
// 	const msgHash = keccak256(raw) // as specified by ECDSA
// 	const msgBytes = arrayify(msgHash) // create binary hash
// 	return recoverPublicKey(msgBytes, signature)
// }

/** key of a grant for encrypting PII; can pass as "extraInfo" when generating shared key */
export function getKeyForGrantPii(grantId: string) {
	return `grant:${grantId}`
}


/** key of an application; can pass as "extraInfo" when generating shared key */
export function getKeyForApplication(applicationId: string) {
	return `app:${applicationId}`
}
