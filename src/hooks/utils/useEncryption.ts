import { useCallback, useRef } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { encrypt } from '@metamask/eth-sig-util'
import { ethers } from 'ethers'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'

// @TODO what does this component do?

export default function useEncryption() {
	const { data: accountData, nonce } = useQuestbookAccount()
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const getPublicEncryptionKey = async(): Promise<string | undefined> => {
		const { ethereum } = window

		if(!ethereum) {
			toastRef.current = toast({
				position: 'top',
				render: () => ErrorToast({
					content: 'Encryption not supported with current wallet',
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
		}

		if(ethereum && accountData && accountData.address) {
			const pubEncryptionKey = await ethereum.request({
				// @ts-expect-error
				method: 'eth_getEncryptionPublicKey', params: [accountData.address],
			})

			return pubEncryptionKey
		}

		return undefined
	}

	const encryptMessage = (
		message: string,
		publicKey: string,
	): string => {
		const encryptedData = encrypt({
			publicKey,
			data: message,
			version: 'x25519-xsalsa20-poly1305',
		})
		const hexValue = ethers.utils.hexlify(
			Buffer.from(JSON.stringify(encryptedData)),
		)
		return hexValue
	}

	const decryptMessage = useCallback(async(cipherText: string): Promise<string | undefined> => {
		const { ethereum } = window

		if(ethereum && accountData && accountData.address) {
			const decryptedData = await ethereum.request({
				// @ts-expect-error
				method: 'eth_decrypt', params: [cipherText, accountData?.address],
			})
			return decryptedData
		}

		return undefined
	}, [accountData])

	return { getPublicEncryptionKey, encryptMessage, decryptMessage }
}
