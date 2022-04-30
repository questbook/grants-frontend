import { SupportedChainId } from './chains';

// @TODO: Polygon

interface ChainInfo {
  readonly id: number;
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
      decimals: number
    }
  }
  readonly subgraphClientUrl: string;
  readonly rpcUrls: string[];
}

export type ChainInfoMap = { readonly [chainId: number]: ChainInfo };
export const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.POLYGON_MAINNET]: {
    id: SupportedChainId.POLYGON_MAINNET,
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
        icon: '/ui_icons/brand/currency/dai_icon.svg',
        label: 'DAI',
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        decimals: 18,
      },
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': {
        icon: '/ui_icons/brand/currency/matic_symbol.svg',
        label: 'WMATIC',
        address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        decimals: 18,
      },
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': {
        icon: '/ui_icons/brand/currency/weth_icon.svg',
        label: 'WETH',
        address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        decimals: 18,
      },
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': {
        icon: '/ui_icons/brand/currency/usdc_icon.svg',
        label: 'USDC',
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        decimals: 6,
      },
      '0xd6df932a45c0f255f85145f286ea0b292b21c90b': {
        icon: '/ui_icons/brand/currency/aave_icon.svg',
        label: 'AAVE',
        address: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
        decimals: 18,
      },
      '0x282d8efce846a88b159800bd4130ad77443fa1a1': {
        icon: '/ui_icons/brand/currency/ocean.svg',
        label: 'OCEAN',
        address: '0x282d8efce846a88b159800bd4130ad77443fa1a1',
        decimals: 18,
      },
      '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f': {
        icon: '/ui_icons/brand/currency/inch_symbol.svg',
        label: '1INCH',
        address: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        decimals: 18,
      },
      '0x1B30e875754aaD79A55929EcfC24f4bd1cd40C08': {
        icon: '/ui_icons/brand/currency/ankr_symbol.svg',
        label: 'ANKR',
        address: '0xC8E36f0a44fBecA89FdD5970439cBe62EB4b5d03',
        decimals: 18,
      },
      '0x6C0AB120dBd11BA701AFF6748568311668F63FE0': {
        icon: '/ui_icons/brand/currency/apwine_symbol.svg',
        label: 'APW',
        address: '0x6C0AB120dBd11BA701AFF6748568311668F63FE0',
        decimals: 18,
      },
      '0x236Ba47C763a8eE1a8F064E867d0751b1714fdF8': {
        icon: '/ui_icons/brand/currency/boba_symbol.svg',
        label: 'BOBA',
        address: '0x236Ba47C763a8eE1a8F064E867d0751b1714fdF8',
        decimals: 18,
      },
      '0xd10852DF03Ea8b8Af0CC0B09cAc3f7dbB15e0433': {
        icon: '/ui_icons/brand/currency/flux_symbol.svg',
        label: 'FLUX',
        address: '0xd10852DF03Ea8b8Af0CC0B09cAc3f7dbB15e0433',
        decimals: 18,
      },
      '0x3962F4A0A0051DccE0be73A7e09cEf5756736712': {
        icon: '/ui_icons/brand/currency/livepeer_symbol.svg',
        label: 'LPT',
        address: '0x3962F4A0A0051DccE0be73A7e09cEf5756736712',
        decimals: 18,
      },
      '0x62c4b802f2153a281dc87994427F606f561Cc620': {
        icon: '/ui_icons/brand/currency/spruce.svg',
        label: 'SPR',
        address: '0x62c4b802f2153a281dc87994427F606f561Cc620',
        decimals: 18,
      },
      '0x980111ae1B84E50222C8843e3A7a038F36Fecd2b': {
        icon: '/ui_icons/brand/currency/stackos_symbol.svg',
        label: 'STACK',
        address: '0x62c4b802f2153a281dc87994427F606f561Cc620',
        decimals: 18,
      },
      '0x3066818837c5e6eD6601bd5a91B0762877A6B731': {
        icon: '/ui_icons/brand/currency/uma_symbol.svg',
        label: 'UMA',
        address: '0x3066818837c5e6eD6601bd5a91B0762877A6B731',
        decimals: 18,
      },
      '0xb33EaAd8d922B1083446DC23f610c2567fB5180f': {
        icon: '/ui_icons/brand/currency/uniswap_symbol.svg',
        label: 'UNI',
        address: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
        decimals: 18,
      },
      '0xDA537104D6A5edd53c6fBba9A898708E465260b6': {
        icon: '/ui_icons/brand/currency/yearn_symbol.svg',
        label: 'YFI',
        address: '0xDA537104D6A5edd53c6fBba9A898708E465260b6',
        decimals: 18,
      },
      '0x9A06Db14D639796B25A6ceC6A1bf614fd98815EC': {
        icon: '/ui_icons/brand/currency/zkp_icon.svg',
        label: 'ZKP',
        address: '0x9A06Db14D639796B25A6ceC6A1bf614fd98815EC',
        decimals: 18,
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-polygon-mainnet',
    rpcUrls: ['https://polygon-rpc.com/'],
  },
  [SupportedChainId.OPTIMISM_MAINNET]: {
    id: SupportedChainId.OPTIMISM_MAINNET,
    name: 'Optimism Mainnet',
    nativeCurrency: {
      name: 'Optimism ETH',
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
      address: 'https://optimistic.etherscan.io/address/',
      transactionHash: 'https://optimistic.etherscan.io/tx/',
    },
    supportedCurrencies: {
      '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
        icon: '/ui_icons/brand/currency/dai_icon.svg',
        label: 'DAI',
        address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        decimals: 18,
      },
      '0x4200000000000000000000000000000000000006': {
        icon: '/ui_icons/brand/currency/weth_icon.svg',
        label: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
      },
      '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
        icon: '/ui_icons/brand/currency/usdc_icon.svg',
        label: 'USDC',
        address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
        decimals: 6,
      },
      '0x9e1028F5F1D5eDE59748FFceE5532509976840E0': {
        icon: '/ui_icons/brand/currency/perp_symbol.svg',
        label: 'PERP',
        address: '0x9e1028F5F1D5eDE59748FFceE5532509976840E0',
        decimals: 18,
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-optimism-mainnet',
    rpcUrls: ['https://mainnet.optimism.io/'],
  },
};
