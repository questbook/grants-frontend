import { reclaimProof } from 'src/generated/mutation/reclaimProof'
import { executeMutation } from 'src/graphql/apollo'

export const generateProof = async(provider: string, address: string, proposalId?: string, pubKey?: string) => {
	try {
		const response = await executeMutation(reclaimProof, { type: provider, address, proposalId, pubKey })
		if(response.generateProof) {
			return {
				requestUrl: response.generateProof.requestUrl,
				statusUrl: response.generateProof.statusUrl,
				sessionId: response.generateProof.sessionId,
				migrationId: response?.generateProof?.migrationId,
				error: false
			}
		}

		return {
			requestUrl: '',
			statusUrl: '',
			sessionId: '',
			migrationId: '',
			error: true
		}
	} catch(e) {
		return {
			requestUrl: '',
			statusUrl: '',
			sessionId: '',
			migrationId: '',
			error: true
		}
	}
}