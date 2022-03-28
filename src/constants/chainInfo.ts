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
  [SupportedChainId.RINKEBY]: {
    id: SupportedChainId.RINKEBY,
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
        decimals: 18,
      },
      '0xc778417e063141139fce010982780140aa0cd5ab': {
        icon: '/ui_icons/brand/currency/weth_symbol.svg',
        label: 'WETH',
        address: '0xc778417e063141139fce010982780140aa0cd5ab',
        decimals: 18,
      },
      '0xeb8f08a975ab53e34d8a0330e0d34de942c95926': {
        icon: '/ui_icons/brand/currency/usdc_symbol.svg',
        label: 'USDC',
        address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
        decimals: 6,
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-rinkeby',
    rpcUrls: ['https://rinkeby.infura.io/v3/'],
  },
  [SupportedChainId.HARMONY_TESTNET_S0]: {
    id: SupportedChainId.HARMONY_TESTNET_S0,
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
        decimals: 18,
      },
      '0x1e120b3b4af96e7f394ecaf84375b1c661830013': {
        icon: '/ui_icons/brand/currency/weth.svg',
        label: '1ETH',
        address: '0x1e120b3b4af96e7f394ecaf84375b1c661830013',
        decimals: 18,
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-harmonytest',
    rpcUrls: ['https://api.s0.b.hmny.io'],
  },
  [SupportedChainId.POLYGON_TESTNET]: {
    id: SupportedChainId.POLYGON_TESTNET,
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
      address: 'https://mumbai.polygonscan.com/address/',
      transactionHash: 'https://mumbai.polygonscan.com/tx/',
    },
    supportedCurrencies: {
      // '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253': {
      //   icon: '/ui_icons/brand/currency/dai_symbol.svg',
      //   label: 'DAI',
      //   address: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
      // },
      '0x9c3c9283d3e44854697cd22d3faa240cfb032889': {
        icon: '/ui_icons/brand/currency/wmatic_symbol.svg',
        label: 'WMATIC',
        address: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
        decimals: 18,
      },
      // '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa': {
      //   icon: '/ui_icons/brand/currency/weth_symbol.svg',
      //   label: 'WETH',
      //   address: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      // },
      '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747': {
        icon: '/ui_icons/brand/currency/usdc_symbol.svg',
        label: 'USDC',
        address: '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
        decimals: 6,
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-polygon-mumbai',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
  },
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
        icon: '/ui_icons/brand/currency/dai_symbol.svg',
        label: 'DAI',
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        decimals: 18,
      },
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': {
        icon: '/ui_icons/brand/currency/wmatic_symbol.svg',
        label: 'WMATIC',
        address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        decimals: 18,
      },
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': {
        icon: '/ui_icons/brand/currency/weth_symbol.svg',
        label: 'WETH',
        address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        decimals: 18,
      },
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': {
        icon: '/ui_icons/brand/currency/usdc_symbol.svg',
        label: 'USDC',
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        decimals: 6,
      },
      '0xd6df932a45c0f255f85145f286ea0b292b21c90b': {
        icon: '/ui_icons/brand/currency/aave_symbol.svg',
        label: 'AAVE',
        address: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
        decimals: 18,
      },
      '0x282d8efce846a88b159800bd4130ad77443fa1a1': {
        icon: '/ui_icons/brand/currency/ocean_symbol.svg',
        label: 'OCEAN',
        address: '0x282d8efce846a88b159800bd4130ad77443fa1a1',
        decimals: 18,
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-polygon',
    rpcUrls: ['https://polygon-rpc.com/'],
  },
};
