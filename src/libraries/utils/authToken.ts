import { logger } from 'ethers'
import { generateTokenMutation, verifyTokenMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'

export const generateToken = async(address: string) => {
	const generate = await executeMutation(generateTokenMutation, { address })
	logger.info(generate.generateToken.record, 'generateToken')
	if(!generate?.generateToken?.record) {
		throw new Error('Unable to generate token')
	}


	return generate.generateToken.record
}

export const verifyToken = async(id: string, sign: string) => {
	const verify = await executeMutation(verifyTokenMutation, { id, sign })
	if(!verify?.verifyToken?.accessToken) {
		throw new Error('Unable to verify token')
	}

	return verify.verifyToken.accessToken
}