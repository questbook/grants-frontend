import 'dotenv/config';

export enum SupportedChainId {
  RINKEBY = 4,
  HARMONY_TESTNET_S0 = 1666700000,
  POLYGON_TESTNET = 80001,
  POLYGON_MAINNET = 137,
  OPTIMISM_MAINNET = 10,
  // NEON_DEVNET = 245022926,
}

const testingNetworks = [
  SupportedChainId.RINKEBY,
];

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(
  SupportedChainId,
).filter(
  (id) => typeof id === 'number'
    && ((process.env.IS_TEST === 'true'
      && testingNetworks.findIndex((network) => network === id) !== -1)
      || !process.env.IS_TEST || process.env.IS_TEST === 'false'),
) as SupportedChainId[];
