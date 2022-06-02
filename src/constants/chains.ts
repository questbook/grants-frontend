import 'dotenv/config'

export enum SupportedChainId {
  // Not For PRODUCTION
  // RINKEBY = 4,
  // HARMONY_TESTNET_S0 = 1666700000,
  // POLYGON_TESTNET = 80001,
  POLYGON_MAINNET = 137,
  OPTIMISM_MAINNET = 10,
  // NEON_DEVNET = 245022926,
  // CELO_ALFAJORES_TESTNET = 44787
}

export const DefaultSupportedChainId = SupportedChainId.POLYGON_MAINNET

// const testingNetworks = [
//   ?? DefaultSupportedChainId,
// ];
const testingNetworks = [] as SupportedChainId[]

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(
	SupportedChainId,
).filter(
	(id) => typeof id === 'number'
    && ((process.env.NEXT_PUBLIC_IS_TEST === 'true'
      && testingNetworks.findIndex((network) => network === id) !== -1)
      || !process.env.NEXT_PUBLIC_IS_TEST || process.env.NEXT_PUBLIC_IS_TEST === 'false'),
) as SupportedChainId[]
