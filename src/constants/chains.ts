export enum SupportedChainId {
  // Not For PRODUCTION
  // RINKEBY = 4,
  // HARMONY_TESTNET_S0 = 1666700000,
  // POLYGON_TESTNET = 80001,
  POLYGON_MAINNET = 137,
  OPTIMISM_MAINNET = 10,
}

export const DefaultSupportedChainId = SupportedChainId.POLYGON_MAINNET;

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number',
) as SupportedChainId[];
