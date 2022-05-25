import { useRef } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { GrantApplicationFieldAnswerItem, GrantApplicationRequest } from '@questbook/service-validator-client'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { GetApplicationDetailsQuery, GrantFieldAnswerItem } from 'src/generated/graphql'
import { useAccount } from 'wagmi'
import useEncryption from './utils/useEncryption'

export default function useApplicationEncryption() {
	const { encryptMessage, decryptMessage } = useEncryption()
	const [{ data: accountData }] = useAccount()

	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const encryptApplicationPII = async(
		data: GrantApplicationRequest,
		piiFields: string[],
		members: any[],
	): Promise<GrantApplicationRequest | undefined> => {
		const newData = { ...data }
		const piiData : { [key:string]: GrantApplicationFieldAnswerItem[] } = {}
		piiFields.forEach((field) => {
			piiData[field] = newData.fields[field]
			delete newData.fields[field]
		})
		if(!members || !members.length) {
			return undefined
		}

		newData.pii = {}
		members.forEach(
			(member) => {
				if(!member || !member.publicKey) {
					return
				}

				const encryptedPiiData = encryptMessage(JSON.stringify(piiData), member.publicKey!)
        newData!.pii![member.actorId] = encryptedPiiData
			},
		)
		return newData
	}

	// [TODO]: Once types are generated, this should be updated to use the generated types
	const decryptApplicationPII = async(data: GetApplicationDetailsQuery['grantApplication']) => {
		// const decryptApplicationPII = async (data: any) => {
		const newData = { ...data } as GetApplicationDetailsQuery['grantApplication']
		if(!newData || !newData.fields || !newData.pii) {
			return newData
		}

		if(!accountData || !accountData.address) {
			return newData
		}

		const piiData = newData.pii.find((pii) => pii.id.split('.')[1].toLowerCase() === accountData.address.toLowerCase())!
		console.log('piiData', piiData)
		if(!piiData) {
			console.log(newData)
			toastRef.current = toast({
				position: 'top',
				render: () => ErrorToast({
					content: 'User public key not present at time of encryption.',
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
			return newData
		}

		const applicationId = newData.pii[0].id.split('.')[0]
		let decryptedPiiData = await decryptMessage(piiData.data)
		console.log('decryptedPiiData', decryptedPiiData)
		if(decryptedPiiData) {
			decryptedPiiData = JSON.parse(decryptedPiiData)
			if(!decryptedPiiData) {
				return newData
			}

			const piiData2: { id: string; values: GrantFieldAnswerItem[] }[] = Object.entries(decryptedPiiData).map(([key, value]) => ({ id: `${applicationId}.${key}`, values: value as unknown as GrantFieldAnswerItem[] }))
			console.log('piiData', piiData2)
			newData.fields = [...newData.fields, ...piiData2]
		}

		console.log('newData', newData)

		return newData
	}

	return { encryptApplicationPII, decryptApplicationPII }
}
