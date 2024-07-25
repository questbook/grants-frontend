import { generateTokenMutation, verifyTokenMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import logger from 'src/libraries/logger'

export const generateToken = async(address: string) => {
	const generate = await executeMutation(generateTokenMutation, { address })
	logger.info(generate.generateToken.record, 'generateToken')
	if(!generate?.generateToken?.record) {
		throw new Error('Unable to generate token')
	}


	return generate.generateToken.record
}

export const verifyToken = async(id: string, sign: string, isEOA?: boolean) => {
	const verify = await executeMutation(verifyTokenMutation, { id, sign, isEOA: isEOA || false })
	if(!verify?.verifyToken?.accessToken) {
		throw new Error('Unable to verify token')
	}

	return verify.verifyToken.accessToken
}