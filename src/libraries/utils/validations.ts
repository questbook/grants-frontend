import { PublicKey } from '@solana/web3.js'
import { ethers } from 'ethers'

export const isValidEthereumAddress = (address: string) => {
	return ethers.utils.isAddress(address)
}

export const isValidSolanaAddress = (address: string) => {
	try {
		//@todo: isOnCurve is not the right check here, it returns false even with right address
		return PublicKey.isOnCurve(address)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		return false
	}
}

export const isValidSafeAddress = (address: string) => {
	return isValidEthereumAddress(address) || isValidSolanaAddress(address)
}