import { ChainInfoMap } from 'src/types'
import 'dotenv/config'
import chainInfo from '../generated/chainInfo.json'
import SupportedChainId from '../generated/SupportedChainId'

const SHOW_TEST_NETS = process.env.NEXT_PUBLIC_IS_TEST === 'true'

export const CHAIN_INFO = chainInfo as ChainInfoMap

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(CHAIN_INFO)
	.map(({ id }) => id)
	.filter(id => SHOW_TEST_NETS || !CHAIN_INFO[id].isTestNetwork)

export { SupportedChainId }