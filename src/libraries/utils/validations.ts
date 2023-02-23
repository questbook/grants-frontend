import { PublicKey } from '@solana/web3.js'
import { ethers } from 'ethers'
import logger from 'src/libraries/logger'

export const isValidEthereumAddress = (address: string) => {
	return ethers.utils.isAddress(address)
}

export const isValidSolanaAddress = (address: string) => {
	try {
		new PublicKey(address)
		return true
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		return false
	}
}

export const isValidSafeAddress = (address: string) => {
	logger.info({ eth: isValidEthereumAddress(address), sol: isValidSolanaAddress(address) }, 'isValidSafeAddress')
	return isValidEthereumAddress(address) || isValidSolanaAddress(address)
}