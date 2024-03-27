import { defineChainInfo } from "graz";
import { WalletType } from "graz";


export const axelartestnet = defineChainInfo({
  chainId: "axelar-testnet-lisbon-3",
  currencies: [
    {
      coinDenom: "axl",
      coinMinimalDenom: "uaxl",
      coinDecimals: 6,
      coinGeckoId: "axelar"
    },
    {
      coinDenom: "ausdc",
      coinMinimalDenom: "uausdc",
      coinDecimals: 6
    },
    {
      coinDenom: "weth",
      coinMinimalDenom: "eth-wei",
      coinDecimals: 18
    },
    {
      coinDenom: "wglmr",
      coinMinimalDenom: "wglmr-wei",
      coinDecimals: 18
    },
    {
      coinDenom: "wmatic",
      coinMinimalDenom: "wmatic-wei",
      coinDecimals: 18
    },
    {
      coinDenom: "wbnb",
      coinMinimalDenom: "wbnb-wei",
      coinDecimals: 18
    },
    {
      coinDenom: "avax",
      coinMinimalDenom: "wavax-wei",
      coinDecimals: 18
    },
    {
      coinDenom: "ftm",
      coinMinimalDenom: "wftm-wei",
      coinDecimals: 18
    }
  ],
  rest: "https://axelartest-lcd.quickapi.com/",
  rpc: "https://axelartest-rpc.quickapi.com/",
  bech32Config: {
    bech32PrefixAccAddr: "axelar",
    bech32PrefixAccPub: "axelarpub",
    bech32PrefixValAddr: "axelarvaloper",
    bech32PrefixValPub: "axelarvaloperpub",
    bech32PrefixConsAddr: "axelarvalcons",
    bech32PrefixConsPub: "axelarvalconspub"
  },
  chainName: "axelartestnet",
  feeCurrencies: [
    {
      coinDenom: "axl",
      coinMinimalDenom: "uaxl",
      coinDecimals: 6,
      coinGeckoId: "axelar"
    }
  ],
  stakeCurrency: {
    coinDenom: "axl",
    coinMinimalDenom: "uaxl",
    coinDecimals: 6,
    coinGeckoId: "axelar"
  },
  bip44: {
    coinType: 118
  }
});

export const mainnetChains = [
  {
    ...axelartestnet,
    rpc: "https://tm.axelar-testnet.lava.build:443",
    rest: "https://lcd-axelar-testnet.imperator.co/static/openapi/",
  },
];

export const listedWallets = {
  [WalletType.KEPLR]: {
    name: "Keplr",
    imgSrc: "/assets/wallet-icon-keplr.png",
  },
  [WalletType.WC_KEPLR_MOBILE]: {
    name: "Keplr Mobile",
    imgSrc: "/assets/wallet-icon-keplr.png",
    mobile: true,
  },
};

