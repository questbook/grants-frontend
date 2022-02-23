import { SupportedChainId } from './chains';

interface ChainInfo {
  readonly name: string;
  readonly nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  },
  readonly icon: string;
  readonly wallets: {
    id: string
    name: string
    icon: string
  }[],
  readonly explorer: {
    address: string
    transactionHash: string
  }
}

export type ChainInfoMap = { readonly [chainId: number]: ChainInfo };
export const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.RINKEBY]: {
    name: 'Rinkeby',
    nativeCurrency: {
      name: 'Rinkeby ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    icon: '/network_icons/eth_mainnet.svg',
    wallets: [
      {
        id: 'injected',
        name: 'Metamask',
        icon: '/wallet_icons/metamask.svg',
      },
      {
        id: 'walletConnect',
        name: 'Wallet Connect',
        icon: '/wallet_icons/walletConnect.svg',
      },
    ],
    explorer: {
      address: 'https://rinkeby.etherscan.io/address/',
      transactionHash: 'https://rinkeby.etherscan.io/tx/',
    },
  },
  [SupportedChainId.HARMONY_TESTNET_S0]: {
    name: 'Harmony Testnet S0',
    nativeCurrency: {
      name: 'Harmony Testnet ONE',
      symbol: 'ONE',
      decimals: 18,
    },
    icon: '/network_icons/eth_mainnet.svg',
    wallets: [
      {
        id: 'injected',
        name: 'Metamask',
        icon: '/wallet_icons/metamask.svg',
      },
      {
        id: 'walletConnect',
        name: 'Wallet Connect',
        icon: '/wallet_icons/walletConnect.svg',
      },
    ],
    explorer: {
      address: 'https://explorer.pops.one/address/',
      transactionHash: 'https://explorer.pops.one/tx/',
    },
  },
};
