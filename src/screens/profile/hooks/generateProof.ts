import axios from 'axios'
const url = 'http://localhost:4000/reclaim/generate'

export const generateProof = async(provider: string, address: string) => {
	try {
		const response = await axios.get(`${url}?type=${provider}&address=${address}`)
		if(response.data) {
			return {
				requestUrl: response.data.requestUrl,
				statusUrl: response.data.statusUrl,
				sessionId: response.data.sessionId,
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