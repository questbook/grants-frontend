import { SupportedChainId } from './chains';

// @TODO: Polygon

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
  readonly supportedCurrencies: {
    [address: string]: {
      icon: string
      label: string
      address: string
    }
  }
  readonly subgraphClientUrl: string;
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
        icon: '/wallet_icons/walletconnect.svg',
      },
    ],
    explorer: {
      address: 'https://rinkeby.etherscan.io/address/',
      transactionHash: 'https://rinkeby.etherscan.io/tx/',
    },
    supportedCurrencies: {
      '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735': {
        icon: '/ui_icons/brand/currency/dai_symbol.svg',
        label: 'DAI',
        address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
      },
      '0xc778417e063141139fce010982780140aa0cd5ab': {
        icon: '/ui_icons/brand/currency/weth_symbol.svg',
        label: 'WETH',
        address: '0xc778417e063141139fce010982780140aa0cd5ab',
      },
      // '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': {
      //   icon: '/ui_icons/brand/currency/wmatic_symbol.svg',
      //   label: 'WMATIC',
      //   address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      // },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph',
  },
  [SupportedChainId.HARMONY_TESTNET_S0]: {
    name: 'Harmony Testnet S0',
    nativeCurrency: {
      name: 'Harmony Testnet ONE',
      symbol: 'ONE',
      decimals: 18,
    },
    icon: '/network_icons/harmony.svg',
    wallets: [
      {
        id: 'injected',
        name: 'Metamask',
        icon: '/wallet_icons/metamask.svg',
      },
      {
        id: 'walletConnect',
        name: 'Wallet Connect',
        icon: '/wallet_icons/walletconnect.svg',
      },
    ],
    explorer: {
      address: 'https://explorer.pops.one/address/',
      transactionHash: 'https://explorer.pops.one/tx/',
    },
    supportedCurrencies: {
      '0xc27255d7805fc79e4616d5cd50d6f4464aea75a3': {
        icon: '/ui_icons/brand/currency/dai.svg',
        label: '1DAI',
        address: '0xc27255d7805fc79e4616d5cd50d6f4464aea75a3',
      },
      '0x1e120b3b4af96e7f394ecaf84375b1c661830013': {
        icon: '/ui_icons/brand/currency/weth.svg',
        label: '1ETH',
        address: '0x1e120b3b4af96e7f394ecaf84375b1c661830013',
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-harmonytest',
  },
  [SupportedChainId.POLYGON_TESTNET]: {
    name: 'Polygon Testnet',
    nativeCurrency: {
      name: 'Matic Token',
      symbol: 'MATIC',
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
        icon: '/wallet_icons/walletconnect.svg',
      },
    ],
    explorer: {
      address: 'https://https://mumbai.polygonscan.com/address/',
      transactionHash: 'https://https://mumbai.polygonscan.com/tx/',
    },
    supportedCurrencies: {
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270': {
        icon: '/ui_icons/brand/currency/wmatic_symbol.svg',
        label: 'WMATIC',
        address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph',
  },
};
