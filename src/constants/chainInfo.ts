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
        icon: '/ui_icons/brand/currency/dai_icon.svg',
        label: 'DAI',
        address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
        decimals: 18,
      },
      '0xc778417e063141139fce010982780140aa0cd5ab': {
        icon: '/ui_icons/brand/currency/weth_icon.svg',
        label: 'WETH',
        address: '0xc778417e063141139fce010982780140aa0cd5ab',
        decimals: 18,
      },
      '0xeb8f08a975ab53e34d8a0330e0d34de942c95926': {
        icon: '/ui_icons/brand/currency/usdc_icon.svg',
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
        icon: '/ui_icons/brand/currency/dai_icon.svg',
        label: '1DAI',
        address: '0xc27255d7805fc79e4616d5cd50d6f4464aea75a3',
        decimals: 18,
      },
      '0x1e120b3b4af96e7f394ecaf84375b1c661830013': {
        icon: '/ui_icons/brand/currency/weth_icon.svg',
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
      //   icon: '/ui_icons/brand/currency/dai_icon.svg',
      //   label: 'DAI',
      //   address: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
      // },
      '0x9c3c9283d3e44854697cd22d3faa240cfb032889': {
        icon: '/ui_icons/brand/currency/matic_symbol.svg',
        label: 'WMATIC',
        address: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
        decimals: 18,
      },
      // '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa': {
      //   icon: '/ui_icons/brand/currency/weth_icon.svg',
      //   label: 'WETH',
      //   address: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      // },
      '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747': {
        icon: '/ui_icons/brand/currency/usdc_icon.svg',
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
      '0x9c2c5fd7b07e95ee044ddeba0e97a665f142394f': {
        icon: '/ui_icons/brand/currency/inch_symbol.svg',
        label: '1INCH',
        address: '0x9c2c5fd7b07e95ee044ddeba0e97a665f142394f',
        decimals: 18,
      },
      /**
       * verify if ANKR address is correct
       */
      // '0x1B30e875754aaD79A55929EcfC24f4bd1cd40C08': {
      //   icon: '/ui_icons/brand/currency/ankr_symbol.svg',
      //   label: 'ANKR',
      //   address: '0x1B30e875754aaD79A55929EcfC24f4bd1cd40C08',
      //   decimals: 18,
      // },
      '0x6c0ab120dbd11ba701aff6748568311668f63fe0': {
        icon: '/ui_icons/brand/currency/apwine_symbol.svg',
        label: 'APW',
        address: '0x6c0ab120dbd11ba701aff6748568311668f63fe0',
        decimals: 18,
      },
      '0x236ba47c763a8ee1a8f064e867d0751b1714fdf8': {
        icon: '/ui_icons/brand/currency/boba_symbol.svg',
        label: 'BOBA',
        address: '0x236ba47c763a8ee1a8f064e867d0751b1714fdf8',
        decimals: 18,
      },
      '0xd10852df03ea8b8af0cc0b09cac3f7dbb15e0433': {
        icon: '/ui_icons/brand/currency/flux_symbol.svg',
        label: 'FLUX',
        address: '0xd10852df03ea8b8af0cc0b09cac3f7dbb15e0433',
        decimals: 18,
      },
      '0x3962f4a0a0051dcce0be73a7e09cef5756736712': {
        icon: '/ui_icons/brand/currency/livepeer_symbol.svg',
        label: 'LPT',
        address: '0x3962f4a0a0051dcce0be73a7e09cef5756736712',
        decimals: 18,
      },
      '0x62c4b802f2153a281dc87994427f606f561cc620': {
        icon: '/ui_icons/brand/currency/spruce.svg',
        label: 'SPR',
        address: '0x62c4b802f2153a281dc87994427F606f561Cc620',
        decimals: 18,
      },
      '0x980111ae1b84e50222c8843e3a7a038f36fecd2b': {
        icon: '/ui_icons/brand/currency/stackos_symbol.svg',
        label: 'STACK',
        address: '0x980111ae1b84e50222c8843e3a7a038f36fecd2b',
        decimals: 18,
      },
      '0x3066818837c5e6ed6601bd5a91b0762877a6b731': {
        icon: '/ui_icons/brand/currency/uma_symbol.svg',
        label: 'UMA',
        address: '0x3066818837c5e6ed6601bd5a91b0762877a6b731',
        decimals: 18,
      },
      '0xb33eaad8d922b1083446dc23f610c2567fb5180f': {
        icon: '/ui_icons/brand/currency/uniswap_symbol.svg',
        label: 'UNI',
        address: '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
        decimals: 18,
      },
      '0xda537104d6a5edd53c6fbba9a898708e465260b6': {
        icon: '/ui_icons/brand/currency/yearn_symbol.svg',
        label: 'YFI',
        address: '0xda537104d6a5edd53c6fbba9a898708e465260b6',
        decimals: 18,
      },
      '0x9a06db14d639796b25a6cec6a1bf614fd98815ec': {
        icon: '/ui_icons/brand/currency/zkp_icon.svg',
        label: 'ZKP',
        address: '0x9a06db14d639796b25a6cec6a1bf614fd98815ec',
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
      '0x9e1028f5f1d5ede59748ffcee5532509976840e0': {
        icon: '/ui_icons/brand/currency/perp_symbol.svg',
        label: 'PERP',
        address: '0x9e1028f5f1d5ede59748ffcee5532509976840e0',
        decimals: 18,
      },
      '0x8700daec35af8ff88c16bdf0418774cb3d7599b4': {
        icon: '/ui_icons/brand/currency/snx_symbol.svg',
        label: 'SNX',
        address: '0x8700daec35af8ff88c16bdf0418774cb3d7599b4',
        decimals: 18,
      },
      '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9': {
        icon: '/ui_icons/brand/currency/sUSD_symbol.svg',
        label: 'sUSD',
        address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9',
        decimals: 18,
      },
    },
    subgraphClientUrl: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-optimism-mainnet',
    rpcUrls: ['https://mainnet.optimism.io/'],
  },
};
