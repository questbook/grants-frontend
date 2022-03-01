import { SupportedChainId } from './chains';

type AddressMap = { [chainId: number]: string };

export const WORKSPACE_REGISTRY_ADDRESS: AddressMap = {
  [SupportedChainId.RINKEBY]: '0xf2ce7a56a30c9604a396ea2c6b2825269f9db88d',
  [SupportedChainId.HARMONY_TESTNET_S0]: '0x0E41057B1DfB745949D147DFc79448e2994D5A37',
};

export const APPLICATION_REGISTRY_ADDRESS: AddressMap = {
  [SupportedChainId.RINKEBY]: '0x9f0033722c0E05303fdB5E1cab8e5f59A105bFED',
  [SupportedChainId.HARMONY_TESTNET_S0]: '0xe9666A3aE8B19040572c81f8A6FDB3D771db002d',
};

export const GRANT_FACTORY_ADDRESS: AddressMap = {
  [SupportedChainId.RINKEBY]: '0x0E6B77F32c273aDae050Ab9d511Fc30Bb385DaAc',
  [SupportedChainId.HARMONY_TESTNET_S0]: '0xB6db4eB8C2DA3298E93B26fce59c790663360788',
};
