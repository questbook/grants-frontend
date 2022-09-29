import React, { createContext, ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Biconomy } from '@biconomy/mexa'
import { ChakraProvider } from '@chakra-ui/react'
import { ChatWidget } from '@papercups-io/chat-widget'
// import dynamic from 'next/dynamic';
import {
	Configuration,
	ValidationApi,
} from '@questbook/service-validator-client'
import { ethers, Wallet } from 'ethers'
import { NextPage } from 'next'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import favIcon from 'public/favicon.ico'
import {
	ALL_SUPPORTED_CHAIN_IDS,
	CHAIN_INFO,
	defaultChainId,
	SupportedChainId,
} from 'src/constants/chains'
import SubgraphClient from 'src/graphql/subgraph'
import MigrateToGasless from 'src/libraries/ui/MigrateToGaslessModal'
import theme from 'src/theme'
import { MinimalWorkspace } from 'src/types'
import { BiconomyWalletClient } from 'src/types/gasless'
import { addAuthorizedUser, bicoDapps, deploySCW, getNonce, jsonRpcProviders, networksMapping } from 'src/utils/gaslessUtils'
import { delay } from 'src/utils/generics'
import logger from 'src/utils/logger'
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
import 'src/utils/appCopy'

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
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
	infuraProvider({ apiKey: infuraId! })
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
	validatorApi: ValidationApi
	workspace?: MinimalWorkspace
	setWorkspace: (workspace?: MinimalWorkspace) => void
	subgraphClients: { [chainId: string]: SubgraphClient }
	connected: boolean
	setConnected: (connected: boolean) => void
		} | null>(null)

export const WebwalletContext = createContext<{
	webwallet?: Wallet
	setWebwallet: (webwallet?: Wallet) => void

	network?: SupportedChainId
	switchNetwork: (newNetwork?: SupportedChainId) => void
	scwAddress?: string
	setScwAddress: (scwAddress?: string) => void

	waitForScwAddress: Promise<string>

	nonce?: string
	setNonce: (nonce?: string) => void
	loadingNonce: boolean
	setLoadingNonce: (loadingNonce: boolean) => void
	importWebwallet: (privateKey: string) => void
	exportWebwallet: () => string
		} | null>(null)

export const BiconomyContext = createContext<{
	biconomyDaoObjs?: { [key: string]: any }
	setBiconomyDaoObjs: (biconomyDaoObjs: any) => void
	initiateBiconomy: (chainId: string) => Promise<void>
	loadingBiconomyMap: { [_: string]: boolean }
	biconomyWalletClients?: {[key: string]: BiconomyWalletClient}
	setBiconomyWalletClients: (biconomyWalletClients?: {[key: string]: BiconomyWalletClient}) => void
		} | null>(null)

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const [network, switchNetwork] = React.useState<SupportedChainId>(defaultChainId)
	const [webwallet, setWebwallet] = React.useState<Wallet>()
	const [workspace, setWorkspace] = React.useState<MinimalWorkspace>()
	const [scwAddress, setScwAddress] = React.useState<string>()
	const [biconomyDaoObjs, setBiconomyDaoObjs] = React.useState<any>()
	const [biconomyWalletClients, setBiconomyWalletClients] = React.useState<{[key: string]: BiconomyWalletClient}>()
	const [nonce, setNonce] = React.useState<string>()
	const [loadingNonce, setLoadingNonce] = React.useState<boolean>(false)

	const [biconomyLoading, setBiconomyLoading] = useState<{ [chainId: string]: boolean }>({})

	// store the chainId that was most recently asked to be init
	const mostRecentInitChainId = useRef<string>()
	// ref to store all the chains that are loading biconomy
	// this is used to prevent multiple calls to biconomy init
	const biconomyInitPromisesRef = useRef<{ [chainId: string]: Promise<void> | undefined }>({})
	// reference to scw address
	// used to poll for scwAddress in "waitForScwAddress"
	const scwAddressRef = useRef(scwAddress)

	const getUseNonce = useCallback(async() => {
		const _nonce = await getNonce(webwallet)
		return _nonce
	}, [webwallet])

	const initiateBiconomyUnsafe = useCallback(async(chainId: string) => {
		if(!webwallet) {
			throw new Error('Attempted init without webwallet')
		}

		if(!nonce) {
			throw new Error('Attempted init without nonce')
		}

		const _logger = logger.child({ chainId })

		chainId = networksMapping[chainId]

		const _biconomy = new Biconomy(
			jsonRpcProviders[chainId],
			{
				apiKey: bicoDapps[chainId].apiKey,
				debug: true
			}
		)
		_logger.info('initializing biconomy')

		let _biconomyWalletClient: BiconomyWalletClient
		let readyCalled = false
		const scwAddress = await new Promise<string>((resolve, reject) => {
			_biconomy.onEvent(_biconomy.READY, async() => {

				if(readyCalled) {
					_logger.warn('ready called multiple times')
					return
				}

				_logger.info({ clientExists: !!_biconomy.biconomyWalletClient }, 'biconomy ready')
				readyCalled = true

				try {
					do {
						_biconomyWalletClient = _biconomy.biconomyWalletClient
						if(!_biconomyWalletClient) {
							_logger.warn('biconomyWalletClient does not exist')
							await delay(500)
						}
					} while(!_biconomyWalletClient)

					const result = await _biconomyWalletClient
						.checkIfWalletExists({ eoa: webwallet.address })

					let walletAddress = result.walletAddress
					if(!result.doesWalletExist) {
						walletAddress = await deploySCW(webwallet, _biconomyWalletClient, chainId, nonce!)
						_logger.info({ walletAddress }, 'scw deployed')
					}

					resolve(walletAddress)
				} catch(err) {
					_logger.error({ err }, 'error in scw deployment')
					reject(err)
				}
			})

			_biconomy.onEvent(_biconomy.ERROR, (err: Error) => {
				_logger.error({ err }, 'biconomy error')
				reject(err)
			})
		})

		_logger.info({ scwAddress }, 'got scw address')

		setBiconomyWalletClients(prev => ({ ...prev, [chainId]: _biconomyWalletClient }))
		setBiconomyDaoObjs((prev: any) => ({ ...prev, [chainId]: _biconomy }))

		// only switch the chainId if it's the most recently requested one
		// this prevents race conditions when inititialisation of multiple chains is requested
		// and the most recently requested one finishes later
		if(mostRecentInitChainId.current === chainId) {
			setScwAddress(scwAddress)
			_logger.info('switched chain after init')
			const chain = parseInt(chainId)
			switchNetwork(chain)
		}
	}, [webwallet, nonce])

	const initiateBiconomy = useCallback(
		async(chainId: string) => {
			let task = biconomyInitPromisesRef.current[chainId]

			mostRecentInitChainId.current = chainId
			if(!task) {
				setBiconomyLoading(prev => ({ ...prev, [chainId]: true }))

				task = initiateBiconomyUnsafe(chainId)
					.catch(() => {
						biconomyInitPromisesRef.current[chainId] = undefined
					})
					.finally(() => {
						setBiconomyLoading(prev => ({ ...prev, [chainId]: false }))
					})
				biconomyInitPromisesRef.current[chainId] = task
			} else {
				switchNetwork(parseInt(chainId))
			}

			return task
		}, [setBiconomyLoading, biconomyInitPromisesRef, initiateBiconomyUnsafe]
	)

	const importWebwallet = useCallback((privateKey: string) => {
		const newWebwallet = new ethers.Wallet(privateKey)

		// set the webwallet
		localStorage.setItem('webwalletPrivateKey', privateKey)
		setWebwallet(newWebwallet)

		// reset everything else
		setLoadingNonce(false)
		setNonce(undefined)
		setScwAddress(undefined)
		setBiconomyWalletClients({})
		setBiconomyDaoObjs({})
		setBiconomyLoading({})

		biconomyInitPromisesRef.current = {}

	}, [setWebwallet])

	const exportWebwallet = useCallback(() => {

		if(!webwallet) {
			throw new Error('No webwallet to export')
		}

		return webwallet.privateKey

	}, [webwallet])

	useEffect(() => {
		if(!webwallet) {
			return
		}

		if(nonce && nonce !== 'Token expired') {
			return
		}

		async function getNonce(address: string): Promise<string> {
			await addAuthorizedUser(address)
			return await getUseNonce()
		}

		getNonce(webwallet.address)
		 .then(_nonce => setNonce(_nonce))
		 .catch(err => logger.error({ err }, 'Error adding authorized user'))

	}, [webwallet, nonce])

	useEffect(() => {
		setWebwallet(createWebWallet())
		setScwAddress(getScwAddress())
		setNonce(getLocalNonce())
		const network = getNetwork()
		logger.info('SWITCH NETWORK (_app.tsx 1): ', network)
		switchNetwork(network)
	}, [])

	useEffect(() => {
		if(webwallet && nonce && nonce !== 'Token expired') {
			initiateBiconomy(network.toString())
		}
	}, [nonce, webwallet, network])

	useEffect(() => {
		// set the scwaddress ref whenever it changes
		scwAddressRef.current = scwAddress
	}, [scwAddress])

	const getScwAddress = () => {

		const _scwAddress = localStorage.getItem('scwAddress')

		if(!_scwAddress) {
			return undefined
		}

		return _scwAddress
	}

	const getLocalNonce = () => {

		const _nonce = localStorage.getItem('nonce')

		if(!_nonce) {
			return undefined
		}

		return _nonce
	}

	const getNetwork = () => defaultChainId

	const createWebWallet = () => {

		const privateKey = localStorage.getItem('webwalletPrivateKey')

		let newWebwallet = Wallet.createRandom()

		if(!privateKey) {
			localStorage.setItem('webwalletPrivateKey', newWebwallet.privateKey)
			return newWebwallet
		}

		try {
			newWebwallet = new Wallet(privateKey)
			return newWebwallet
		} catch{
			localStorage.setItem('webwalletPrivateKey', newWebwallet.privateKey)
			return newWebwallet
		}
	}

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
			waitForScwAddress: (async() => {
				while(!scwAddressRef.current) {
					await delay(500)
				}

				return scwAddressRef.current
			})(),
			network: network,
			switchNetwork: (newNetwork?: SupportedChainId) => {
				if(newNetwork) {
					localStorage.setItem('network', newNetwork.toString())
				} else {
					localStorage.removeItem('network')
				}

				logger.info('SWITCH NETWORK (_app.tsx 2): ', network)
				switchNetwork(newNetwork!)
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
				// console.log('called nonce: ', newNonce)
				if(newNonce) {
					// console.log('setting nonce', newNonce)
					localStorage.setItem('nonce', newNonce)
				} else {
					// console.log('removing nonce: ', localStorage.getItem('nonce'))
					localStorage.removeItem('nonce')
				}

				setNonce(newNonce)
			},
			loadingNonce,
			setLoadingNonce,
			importWebwallet,
			exportWebwallet
		}),
		[webwallet, setWebwallet, network, switchNetwork, scwAddress, setScwAddress, nonce, setNonce, loadingNonce, setLoadingNonce]
	)

	const biconomyDaoObjContextValue = useMemo(
		() => ({
			biconomyDaoObjs,
			loadingBiconomyMap: biconomyLoading,
			initiateBiconomy,
			setBiconomyDaoObjs,
			biconomyWalletClients,
			setBiconomyWalletClients,
		}),
		[biconomyDaoObjs, biconomyLoading, setBiconomyDaoObjs, initiateBiconomy, biconomyWalletClients, setBiconomyWalletClients]
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
				<link
					rel='shortcut icon'
					href={favIcon.src}
					type='image/x-icon' />
				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-N9KVED0HQZ'
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
								{
									typeof window !== 'undefined' && (
										<MigrateToGasless />
									)
								}
							</ChakraProvider>
						</BiconomyContext.Provider>
					</WebwalletContext.Provider>
				</ApiClientsContext.Provider>
			</WagmiConfig>
			<ChatWidget
				token='5b3b08cf-8b27-4d4b-9c4e-2290f53e04f0'
				inbox='cb5e60c6-dfe5-481d-9dde-3f13e83344cd'
				title='Welcome to Questbook Support'
				subtitle="Have a question? Please feel free to ask here - we'll respond ASAP, hopefully now!"
				primaryColor='#1F1F33'
				newMessagePlaceholder='Type your question ...'
				showAgentAvailability={false}
				agentAvailableText="We're online right now!"
				agentUnavailableText="We're away at the moment."
				requireEmailUpfront={false}
				iconVariant='filled'
				baseUrl='https://app.papercups.io'
			/>

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
