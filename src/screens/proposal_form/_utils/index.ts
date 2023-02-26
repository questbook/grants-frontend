import { PublicKey } from '@solana/web3.js'
import { ContentState, convertFromRaw, EditorState } from 'draft-js'
import { ethers } from 'ethers'
import { Form, Grant } from 'src/screens/proposal_form/_utils/types'
import { getFromIPFS, isIpfsHash } from 'src/libraries/utils/ipfs'

function containsField(grant: Grant, field: string) {
	return grant?.fields?.some((f) => f.id.endsWith(field))
}

function findField(form: Form, id: string) {
	return form.fields.find((f) => f.id === id) ?? { id, value: '' }
}

const getProjectDetails = async(projectDetails: string) => {
	try {
		if(isIpfsHash(projectDetails)) {
			const o = await getFromIPFS(projectDetails)
			// console.log('From IPFS: ', o)
			return EditorState.createWithContent(convertFromRaw(JSON.parse(o)))
		} else {
			// console.log('Previous text value: ', projectDetails)
			const o = JSON.parse(projectDetails)
			return EditorState.createWithContent(convertFromRaw(o))
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		if(projectDetails) {
			return EditorState.createWithContent(ContentState.createFromText(projectDetails))
		} else {
			return EditorState.createEmpty()
		}
	}
}

const validateEmail = (email: string, callback: (isValid: boolean) => void) => {
	if(email) {
		const re = /\S+@\S+\.\S+/
		callback(re.test(email))
	} else {
		callback(true)
	}
}

const validateWalletAddress = (address: string, safeObj: any, callback: (isValid: boolean) => void) => {
	if(address) {
		if(safeObj?.getIsEvm()) {
			callback(ethers.utils.isAddress(address))
		} else if(safeObj?.chainId === 900001) {
			try {
				callback(PublicKey.isOnCurve(address))
			} catch(e) {
				callback(false)
			}
		} else {
			callback(true)
		}
	} else {
		callback(true)
	}
}

export { containsField, findField, getProjectDetails, validateEmail, validateWalletAddress }