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
  [SupportedChainId.POLYGON_MAINNET]: {
    name: 'Polygon Mainnet',
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
      address: 'https://polygonscan.com/address/',
      transactionHash: 'https://polygonscan.com/tx/',
    },
    supportedCurrencies: {
      '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': {
        icon: '/ui_icons/brand/currency/dai_symbol.svg',
        label: 'DAI',
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      },
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': {
        icon: '/ui_icons/brand/currency/wmatic_symbol.svg',
        label: 'WMATIC',
        address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      },
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': {
        icon: '/ui_icons/brand/currency/weth_symbol.svg',
        label: 'WETH',
        address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-polygon',
  },
};
