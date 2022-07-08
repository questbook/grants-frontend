import React, {
	createContext,
	ReactElement,
	ReactNode,
	useEffect,
	useMemo,
} from 'react'
import { ChakraProvider } from '@chakra-ui/react'
// import dynamic from 'next/dynamic';
import {
	Configuration,
	ValidationApi,
} from '@questbook/service-validator-client'
import { NextPage } from 'next'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO, SupportedChainId } from 'src/constants/chains'
import { MinimalWorkspace } from 'src/types'
import getSeo from 'src/utils/seo'
import {
	allChains,
	Chain,
	chain,
	configureChains,
	createClient,
	WagmiConfig,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import '../styles/globals.css'
import 'draft-js/dist/Draft.css'
import SubgraphClient from '../src/graphql/subgraph'
import theme from '../src/theme'
import { Wallet } from 'ethers'

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const defaultChain = chain.polygon
const { chains, provider } = configureChains(allChains, [
	jsonRpcProvider({
		rpc: (chain: Chain) => {
			const rpcUrl = CHAIN_INFO[chain.id as SupportedChainId]?.rpcUrls[0]
			if (!rpcUrl) {
				return { http: CHAIN_INFO[defaultChain.id as SupportedChainId].rpcUrls[0] }
			}

			return { http: rpcUrl }
		},
	}),
	publicProvider(),
])

// Set up client
const client = createClient({
	autoConnect: true,
	connectors: [
		new InjectedConnector({
			chains,
			options: {
				name: 'Injected',
				shimDisconnect: true,
			},
		}),
		new MetaMaskConnector({
			chains,
			options: {
				shimDisconnect: true,
			},
		}),
		new WalletConnectConnector({
			chains,
			options: {
				infuraId,
				qrcode: true,
			},
		}),
	],
	provider,
})

export const ApiClientsContext = createContext<{
	validatorApi: ValidationApi;
	workspace?: MinimalWorkspace;
	setWorkspace: (workspace?: MinimalWorkspace) => void;
	subgraphClients: { [chainId: string]: SubgraphClient };
	connected: boolean;
	setConnected: (connected: boolean) => void;
} | null>(null);

export const WebwalletContext = createContext<{
	webwallet?: Wallet,
	setWebwallet: (webwallet?: Wallet) => void;
} | null>(null);

export const GitHubTokenContext = createContext<{
	isLoggedIn?: boolean,
	setIsLoggedIn: (isLoggedIn?: boolean) => void;
} | null>(null);

export const ScwAddressContext = createContext<{
	scwAddress?: string,
	setScwAddress: (scwAddress?: string) => void;
} | null>(null);

export const NonceContext = createContext<{
	nonce?: string,
	setNonce: (nonce?: string) => void;
} | null>(null);

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const [webwallet, setWebwallet] = React.useState<Wallet>();
	const [workspace, setWorkspace] = React.useState<MinimalWorkspace>();
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>();
	const [scwAddress, setScwAddress] = React.useState<string>();
	const [nonce, setNonce] = React.useState<string>();

	const getIsLoggedIn = () => {
		if (typeof window === 'undefined')
			return undefined;

		let _isLoggedIn = localStorage.getItem("isLoggedInGitHub");

		if (!_isLoggedIn)
			return undefined;

		if (_isLoggedIn === "1")
			return true;

		return false;
	}

	const getScwAddress = () => {
		if (typeof window === 'undefined')
			return undefined;

		let _scwAddress = localStorage.getItem("scwAddress");

		if (!_scwAddress)
			return undefined;

		return _scwAddress
	}

	const getNonce = () => {
		if (typeof window === 'undefined')
			return undefined;

		let _nonce = localStorage.getItem("nonce");

		if (!_nonce)
			return undefined;

		return nonce
	}

	const nonceContextValue = useMemo(
		() => ({
			nonce: getNonce(),
			setNonce: (newNonce?: string) => {
				if (newNonce) {
					localStorage.setItem('nonce', newNonce);
				} else {
					localStorage.removeItem('nonce')
				}

				setNonce(newNonce);
			}
		})
		, [nonce, setNonce]
	)

	const scwAddressContextValue = useMemo(
		() => ({
			scwAddress: getScwAddress(),
			setScwAddress: (newScwAddress?: string) => {
				if (newScwAddress) {
					localStorage.setItem('scwAddress', newScwAddress);
				} else {
					localStorage.removeItem('scwAddress')
				}

				setScwAddress(newScwAddress);
			}
		})
		, [scwAddress, setScwAddress]
	)

	const githubTokenContextValue = useMemo(
		() => ({
			isLoggedIn: getIsLoggedIn(),
			setIsLoggedIn: (newIsLoggedIn?: boolean) => {
				if (newIsLoggedIn) {
					localStorage.setItem('isLoggedInGitHub', "1");
				} else {
					localStorage.setItem('isLoggedInGitHub', "0")
				}

				setIsLoggedIn(newIsLoggedIn);
			}
		})
		, [isLoggedIn, setIsLoggedIn]
	);

	const createWebWallet = () => {
		if (typeof window === 'undefined')
			return undefined;
		let privateKey = localStorage.getItem("webwalletPrivateKey");
		if (!privateKey)
			return undefined;
		try {
			const newWebwallet = new Wallet(privateKey);
			return newWebwallet;
		}

		catch {
			return undefined;
		}
	}
	const webwalletContextValue = useMemo(
		() => ({
			webwallet: createWebWallet(),
			setWebwallet: (newWebwallet?: Wallet) => {
				if (newWebwallet) {
					localStorage.setItem('webwalletPrivateKey', newWebwallet.privateKey);
				} else {
					localStorage.removeItem('webwalletPrivateKey')
				}

				setWebwallet(newWebwallet);
			}
		}),
		[webwallet, setWebwallet]
	)

	const clients = useMemo(() => {
		const clientsObject = {} as { [chainId: string]: SubgraphClient }
		ALL_SUPPORTED_CHAIN_IDS.forEach((chnId) => {
			clientsObject[chnId] = new SubgraphClient(chnId)
		})
		return clientsObject
	}, [])

	const validatorApi = useMemo(() => {
		const validatorConfiguration = new Configuration({
			basePath: 'https://api-grant-validator.questbook.app',
		})
		return new ValidationApi(validatorConfiguration)
	}, [])

	const [connected, setConnected] = React.useState(false)

	const apiClients = useMemo(
		() => ({
			validatorApi,
			workspace,
			setWorkspace: (newWorkspace?: MinimalWorkspace) => {
				if (newWorkspace) {
					localStorage.setItem('currentWorkspace', newWorkspace.supportedNetworks[0] + '-' + newWorkspace.id)
				} else {
					localStorage.setItem('currentWorkspace', 'undefined')
				}

				setWorkspace(newWorkspace)
			},
			subgraphClients: clients,
			connected,
			setConnected,
		}),
		[validatorApi, workspace, setWorkspace, clients, connected, setConnected]
	)

	const seo = getSeo()
	const getLayout = Component.getLayout ?? ((page) => page)
	return (
		<>
			<DefaultSeo {...seo} />
			<Head>
				<script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-N9KVED0HQZ"
				/>
				<script
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={
						{
							__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '[Tracking ID]', { page_path: window.location.pathname });
            `,
						}
					}
				/>
			</Head>
			<WagmiConfig client={client}>
				<ApiClientsContext.Provider value={apiClients}>
					<WebwalletContext.Provider value={webwalletContextValue}>
						<GitHubTokenContext.Provider value={githubTokenContextValue}>
							<ScwAddressContext.Provider value={scwAddressContextValue}>
								<NonceContext.Provider value={nonceContextValue}>
									<ChakraProvider theme={theme}>
										{getLayout(<Component {...pageProps} />)}
									</ChakraProvider>
								</NonceContext.Provider>
							</ScwAddressContext.Provider>
						</GitHubTokenContext.Provider>
					</WebwalletContext.Provider>
				</ApiClientsContext.Provider>
			</WagmiConfig>
		</>
	)
}

MyApp.getInitialProps = async (appContext: AppContext) => {
	// calls page's `getInitialProps` and fills `appProps.pageProps`
	const appProps = await App.getInitialProps(appContext)
	return { ...appProps }
}

// export default dynamic(() => Promise.resolve(MyApp), {
//   ssr: false,
// });
export default MyApp
