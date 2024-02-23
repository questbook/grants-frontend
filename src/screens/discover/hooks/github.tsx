import axios from 'axios'
import { logger } from 'ethers'


export const useGithub = async(token: string):
    Promise<{
        username: string
        repos: number
    }> => {
	try {
		logger.info({ token }, 'useGithub')
		const response = await axios.get('https://api.github.com/user', {
			headers: {
				'Authorization': `token ${token}`
			}
		})
		return {
			username: response.data.login,
			repos: response.data.public_repos
		}
	} catch(error) {
		logger.info({ error }, 'useGithub')
		return {
			username: '',
			repos: 0
		}
	}
}