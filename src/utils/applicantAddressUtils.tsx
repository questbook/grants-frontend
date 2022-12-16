import axios from 'axios'
import { IdrissCrypto } from 'idriss-crypto'
import idRiss from 'src/constants/idRiss'
import unstoppableDomains from 'src/constants/unstoppableDomains'
import logger from 'src/libraries/logger'

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
		logger.error(e)
	}
}

export const resolveIDriss = async(isEvm: boolean, applicantAddress: string) => {
	try {
		const idriss = new IdrissCrypto()
		const result = await idriss.resolve(applicantAddress)
		const chainType = isEvm ? 'evm' : 'non-evm'
		const domainTags = idRiss[chainType]

		for(const tag of domainTags) {
			const resolvedDomain = result[tag]
			if(resolvedDomain) {
				return resolvedDomain
			}
		}
	} catch(e) {
		logger.error(e)
	}
}

export async function resolveApplicantAddress(safeObj: any, applicantAddress: string) {
	const chainId = safeObj?.chainId
	const isEvm = safeObj?.getIsEvm()

	if(applicantAddress) {
		let unstoppabledomains: string | undefined = ''
		let idriss: string | undefined = ''
		try {
			unstoppabledomains = await resolveUnstoppableDomains(chainId, applicantAddress)
		} catch(e) {}

		try {
			idriss = await resolveIDriss(isEvm, applicantAddress)
		} catch(e) {}

		return ({ unstoppabledomains, idriss })
	}

}