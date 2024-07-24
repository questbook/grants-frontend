import axios from 'axios'

export const generateProof = async(provider: string, address: string) => {
	try {
		const response = await axios.get(`https://m8aanm1noe.execute-api.ap-southeast-1.amazonaws.com/reclaim/generate?type=${provider}&address=${address}`)
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