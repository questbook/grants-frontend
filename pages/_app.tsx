import React, { createContext, ReactElement, ReactNode, useEffect, useMemo } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
// import dynamic from 'next/dynamic';
import {
	Configuration,
	ValidationApi,
} from '@questbook/service-validator-client'
import { Wallet } from 'ethers'
import { NextPage } from 'next'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import {
	ALL_SUPPORTED_CHAIN_IDS,
	CHAIN_INFO,
	SupportedChainId,
} from 'src/constants/chains'
import SubgraphClient from 'src/graphql/subgraph'
import theme from 'src/theme'
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
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import 'styles/globals.css'
import 'draft-js/dist/Draft.css'
import { jsonRpcProviders } from 'src/utils/gaslessUtils'


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
			if(!rpcUrl) {
				return {
					http: CHAIN_INFO[defaultChain.id as SupportedChainId].rpcUrls[0],
				}
			}

			return { http: rpcUrl }
		},
	}),
	publicProvider(),
	infuraProvider({ infuraId })
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
				qrcode: true,
				rpc: {
					'137': `https://polygon-mainnet.infura.io/v3/${infuraId}`,
					'4': `https://rinkeby.infura.io/v3/${infuraId}`
				},
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
		} | null>(null)

export const WebwalletContext = createContext<{
	webwallet?: Wallet;
	setWebwallet: (webwallet?: Wallet) => void;
	network?: SupportedChainId;
	switchNetwork: (newNetwork: SupportedChainId) => void;
	scwAddress?: string;
	setScwAddress: (scwAddress?: string) => void;
	nonce?: string;
	setNonce: (nonce?: string) => void;
		} | null>(null)

export const BiconomyContext = createContext<{
	biconomyDaoObj: any,
	setBiconomyDaoObj: (biconomyDaoObj: any) => void;
		} | null>(null)

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const [network, switchNetwork] = React.useState<SupportedChainId>()
	const [webwallet, setWebwallet] = React.useState<Wallet>()
	const [workspace, setWorkspace] = React.useState<MinimalWorkspace>()
	const [scwAddress, setScwAddress] = React.useState<string>()
	const [biconomyDaoObj, setBiconomyDaoObj] = React.useState<any>()
	const [nonce, setNonce] = React.useState<string>()

	useEffect(() => {
		setWebwallet(createWebWallet());
		setScwAddress(getScwAddress());
		setNonce(getNonce());
		switchNetwork(getNetwork());
	}, [setWebwallet, setScwAddress, setNonce, switchNetwork]);

	const getScwAddress = () => {

		const _scwAddress = localStorage.getItem('scwAddress')

		if(!_scwAddress) {
			return undefined
		}

		return _scwAddress
	}

	const getNonce = () => {

		const _nonce = localStorage.getItem('nonce')

		if(!_nonce) {
			return undefined
		}

		return _nonce
	}

	const getNetwork = () => {

		const _network = localStorage.getItem('network')

		if(!_network) {
			return undefined
		}

		return parseInt(_network)
	}

	const createWebWallet = () => {	

		const privateKey = localStorage.getItem('webwalletPrivateKey');
		
		let newWebwallet = Wallet.createRandom();
		newWebwallet = newWebwallet.connect(jsonRpcProviders["80001"]);

		if(!privateKey) {
			localStorage.setItem('webwalletPrivateKey', newWebwallet.privateKey)
			return newWebwallet;
		}

		try {
			newWebwallet = new Wallet(privateKey);
			newWebwallet = newWebwallet.connect(jsonRpcProviders["80001"]);
			return newWebwallet
		} catch{
			localStorage.setItem('webwalletPrivateKey', newWebwallet.privateKey)
			return newWebwallet;
		}
	}

	// const getBiconomyDaoObj = () => {
	// 	if (typeof window === 'undefined') {
	// 		return undefined
	// 	}

	// 	let _biconomyDaoObj = localStorage.getItem('biconomyDaoObj')
	// 	if (!_biconomyDaoObj) {
	// 		return undefined
	// 	}

	// 	try {
	// 		_biconomyDaoObj = JSON.parse(_biconomyDaoObj)
	// 		return _biconomyDaoObj
	// 	} catch {
	// 		return undefined
	// 	}
	// }

	const webwalletContextValue = useMemo(
		() => ({
			webwallet: webwallet,
			setWebwallet: (newWebwallet?: Wallet) => {
				if(newWebwallet) {
					localStorage.setItem('webwalletPrivateKey', newWebwallet.privateKey)
				} else {
					localStorage.removeItem('webwalletPrivateKey')
				}

				setWebwallet(newWebwallet)
			},
			network: network,
			switchNetwork: (newNetwork?: SupportedChainId) => {
				if(newNetwork) {
					localStorage.setItem('network', newNetwork.toString())
				} else {
					localStorage.removeItem('network')
				}

				switchNetwork(newNetwork)
			},
			scwAddress: scwAddress,
			setScwAddress: (newScwAddress?: string) => {
				if(newScwAddress) {
					localStorage.setItem('scwAddress', newScwAddress)
				} else {
					localStorage.removeItem('scwAddress')
				}

				setScwAddress(newScwAddress)
			},
			nonce: nonce,
			setNonce: (newNonce?: string) => {
				console.log('called nonce: ', newNonce)
				if(newNonce) {
					console.log('setting nonce', newNonce)
					localStorage.setItem('nonce', newNonce)
				} else {
					console.log('removing nonce: ', localStorage.getItem('nonce'))
					localStorage.removeItem('nonce')
				}

				setNonce(newNonce)
			}
		}),
		[webwallet, setWebwallet, network, switchNetwork, scwAddress, setScwAddress, nonce, setNonce]
	)

	const biconomyDaoObjContextValue = useMemo(
		() => ({
			biconomyDaoObj,
			setBiconomyDaoObj
		}),
		[biconomyDaoObj, setBiconomyDaoObj]
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
	const [grantsCount, setGrantsCount] = React.useState(0)

	const apiClients = useMemo(
		() => ({
			validatorApi,
			workspace,
			setWorkspace: (newWorkspace?: MinimalWorkspace) => {
				if(newWorkspace) {
					localStorage.setItem(
						'currentWorkspace',
						newWorkspace.supportedNetworks[0] + '-' + newWorkspace.id
					)
				} else {
					localStorage.setItem('currentWorkspace', 'undefined')
				}

				setWorkspace(newWorkspace)
			},
			subgraphClients: clients,
			connected,
			setConnected,
			grantsCount,
			setGrantsCount,
		}),
		[validatorApi, workspace, setWorkspace, clients, connected, setConnected]
	)

	const seo = getSeo()



	const getLayout = Component.getLayout || ((page) => page)
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
						<BiconomyContext.Provider value={biconomyDaoObjContextValue}>
							<ChakraProvider theme={theme}>
								{getLayout(<Component {...pageProps} />)}
							</ChakraProvider>
						</BiconomyContext.Provider>
					</WebwalletContext.Provider>
				</ApiClientsContext.Provider>
			</WagmiConfig>
		</>
	)
}

MyApp.getInitialProps = async(appContext: AppContext) => {
	// calls page's `getInitialProps` and fills `appProps.pageProps`
	const appProps = await App.getInitialProps(appContext)
	return { ...appProps }
}

// export default dynamic(() => Promise.resolve(MyApp), {
//   ssr: false,
// });
export default MyApp
