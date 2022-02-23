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
  subgraphClient: SubgraphClient;
  validatorApi: ValidationApi;
  workspaceId: string | null;
  setWorkspaceId:(id: string | null) => void;
  workspace: any;
  setWorkspace:(workspace: any) => void;
} | null>(null);

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const [workspace, setWorkspace] = React.useState<{ workspaceId: string; chainId: string }>();
  const client = useMemo(() => new SubgraphClient(), []);

  const validatorApi = useMemo(() => {
    const validatorConfiguration = new Configuration({
      basePath: 'https://api-grant-validator.questbook.app',
    });
    return new ValidationApi(validatorConfiguration);
  }, []);

  const apiClients = useMemo(
    () => ({
      subgraphClient: client,
      validatorApi,
      workspaceId,
      setWorkspaceId,
      workspace,
      setWorkspace,
    }),
    [client, validatorApi, workspaceId, setWorkspaceId, workspace, setWorkspace],
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
