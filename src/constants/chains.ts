import chainInfo from 'src/generated/chainInfo.json'
import SupportedChainId from 'src/generated/SupportedChainId'
import { ChainInfoMap } from 'src/types'
import 'dotenv/config'

// by default, we show all test nets
export const SHOW_TEST_NETS = process.env.NEXT_PUBLIC_IS_TEST !== 'false'
export const defaultChainId = process.env.NEXT_PUBLIC_IS_TEST === 'true'
	? SupportedChainId.OPTIMISM_MAINNET
	: SupportedChainId.OPTIMISM_MAINNET
export const CHAIN_INFO = chainInfo as ChainInfoMap
export const USD_ASSET = '0x0000000000000000000000000000000000000001'
export const USD_ICON = '/dollar_icon.svg'
export const SOL_ETH_ASSET = '0x0000000000000000000000000000000000000002'
export const USD_DECIMALS = 0
export const SOL_ETH_DECIMALS = 9

// when SHOW_TEST_NETS = true, we show every chain
// otherwise only use mainnets
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(CHAIN_INFO)
	.map(({ id }) => id)
	// Changed this temporarily to show only the testnet for testing
	.filter(id => SHOW_TEST_NETS || !CHAIN_INFO[id].isTestNetwork)

export { SupportedChainId }
