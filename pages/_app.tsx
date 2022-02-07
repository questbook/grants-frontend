import React, { ReactElement, ReactNode } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { NextPage } from 'next';
import 'draft-js/dist/Draft.css';
import {
  // defaultChains,
  // defaultL2Chains,
  InjectedConnector,
  Provider,
} from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import dynamic from 'next/dynamic';
import theme from '../src/theme';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const infuraId = process.env.INFURA_ID;

// Chains for connectors to support
// const chains = [...defaultChains, ...defaultL2Chains].filter(
//   (chain) => chain.name in ['mainnet', 'polygonMainnet'],
// );

// Set up connectors
const connectors = () => [
  new InjectedConnector({
    // chains,
    options: { shimDisconnect: true },
  }),
  new WalletConnectConnector({
    options: {
      infuraId,
      qrcode: true,
    },
  }),
];

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Provider autoConnect connectors={connectors}>
      <ChakraProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </Provider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
