import { ChainInfoMap } from 'src/types'
import 'dotenv/config'
import chainInfo from '../generated/chainInfo.json'
import SupportedChainId from '../generated/SupportedChainId'

// by default, we show all test nets
export const SHOW_TEST_NETS = process.env.NEXT_PUBLIC_IS_TEST !== 'false'
export const defaultChainId = process.env.NEXT_PUBLIC_IS_TEST === 'true'
	? SupportedChainId.RINKEBY
	: SupportedChainId.POLYGON_MAINNET
export const CHAIN_INFO = chainInfo as ChainInfoMap

// when SHOW_TEST_NETS = true, we show every chain
// otherwise only use mainnets
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(CHAIN_INFO)
	.map(({ id }) => id)
	.filter(id => SHOW_TEST_NETS || !CHAIN_INFO[id].isTestNetwork)

export { SupportedChainId }