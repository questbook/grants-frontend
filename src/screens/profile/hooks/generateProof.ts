import { reclaimProof } from 'src/generated/mutation/reclaimProof'
import { executeMutation } from 'src/graphql/apollo'

export const generateProof = async(provider: string, address: string) => {
	try {
		const response = await executeMutation(reclaimProof, { type: provider, address })
		if(response.generateProof) {
			return {
				requestUrl: response.generateProof.requestUrl,
				statusUrl: response.generateProof.statusUrl,
				sessionId: response.generateProof.sessionId,
				error: false
			}
		}

		return {
			requestUrl: '',
			statusUrl: '',
			sessionId: '',
			error: true
		}
	} catch(e) {
		return {
			requestUrl: '',
			statusUrl: '',
			sessionId: '',
			error: true
		}
	}
}