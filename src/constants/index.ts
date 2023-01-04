import { SupportedChainId } from 'src/constants/chains'

export const ROLES = {
	admin: 0x0,
	reviewer: 0x1,
}

export const USD_THRESHOLD = 0

export const DEFAULT_NETWORK = process.env.NEXT_PUBLIC_IS_TEST === 'true' ? SupportedChainId.GOERLI_TESTNET.toString() : SupportedChainId.OPTIMISM_MAINNET.toString()