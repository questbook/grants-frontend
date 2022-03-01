import React, {
  ReactElement, ReactNode, createContext, useMemo,
} from 'react';
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
import Head from 'next/head';
import {
  Configuration,
  ValidationApi,
} from '@questbook/service-validator-client';
import { MinimalWorkspace } from 'src/types';
import { ALL_SUPPORTED_CHAIN_IDS } from 'src/constants/chains';
import theme from '../src/theme';
import SubgraphClient from '../src/graphql/subgraph';

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

export const ApiClientsContext = createContext<{
  validatorApi: ValidationApi;
  workspace?: MinimalWorkspace;
  setWorkspace:(workspace?: MinimalWorkspace) => void;
  subgraphClients: { [chainId: string]: SubgraphClient };
} | null>(null);

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [workspace, setWorkspace] = React.useState<MinimalWorkspace>();

  const clients = useMemo(() => {
    const clientsObject = {} as { [chainId: string]: SubgraphClient };
    ALL_SUPPORTED_CHAIN_IDS.forEach((chnId) => {
      clientsObject[chnId] = new SubgraphClient(chnId);
    });
    return clientsObject;
  }, []);

  const validatorApi = useMemo(() => {
    const validatorConfiguration = new Configuration({
      basePath: 'https://api-grant-validator.questbook.app',
    });
    return new ValidationApi(validatorConfiguration);
  }, []);

  const apiClients = useMemo(
    () => ({
      validatorApi,
      workspace,
      setWorkspace,
      subgraphClients: clients,
    }),
    [validatorApi, workspace, setWorkspace, clients],
  );

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Provider autoConnect connectors={connectors}>
      <ApiClientsContext.Provider value={apiClients}>
        <ChakraProvider theme={theme}>
          <Head>
            <link rel="icon" href="/favicon.png" />
            <link rel="icon" href="/favicon.svg" />
          </Head>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </ApiClientsContext.Provider>
    </Provider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
