import axios from 'axios'
import { IdrissCrypto } from 'idriss-crypto'
import idRiss from 'src/constants/idRiss'
import unstoppableDomains from 'src/constants/unstoppableDomains'
import { useSafeContext } from 'src/contexts/safeContext'

export const resolveUnstoppableDomains = async(chainId: string, applicantAddress: string) => {

	const token = process.env.UD_KEY
	const response = await axios.get(`https://resolve.unstoppabledomains.com/domains/${applicantAddress}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	try {
		const { data } = response
		const resolvedDomain = data.records[`crypto.${unstoppableDomains[chainId]}.address`]
		return resolvedDomain
	} catch(e) {
		throw e
	}
}

export const resolveIDriss = async(isEvm: boolean, applicantAddress: string) => {
	try {
		const idriss = new IdrissCrypto()
		const result = await idriss.resolve(applicantAddress)
		return result[`${idRiss[isEvm ? 'evm' : 'non-evm']}`]
	} catch(e) {
		throw e
	}
}

export async function resolveApplicantAddress(safeObj: any, applicantAddress: string) {
	const chainId = safeObj?.chainId
	const isEvm = safeObj?.getIsEvm()

	if(applicantAddress) {
		try {
			const unstoppabledomains = await resolveUnstoppableDomains(chainId, applicantAddress)
			const idriss = await resolveIDriss(isEvm, applicantAddress)

			if(unstoppabledomains) {
				return ({ 'address':unstoppabledomains })
			} else if(idriss) {
				return ({ 'address':idriss })
			} else {
				return ({ 'address':applicantAddress })
			}

		} catch(e: any) {
			return ({ 'error': e.message })
		}
	}

}