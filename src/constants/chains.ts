export enum SupportedChainId {
  RINKEBY = 4,
  HARMONY_TESTNET_S0 = 1666700000,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number',
) as SupportedChainId[];
