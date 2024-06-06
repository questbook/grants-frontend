import { createContext, ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { hotjar } from 'react-hotjar'
import { Biconomy } from '@biconomy/mexa'
import { ChakraProvider } from '@chakra-ui/react'
import { ChatWidget } from '@papercups-io/chat-widget'
// import dynamic from 'next/dynamic';
import {
	Configuration,
	ValidationApi,
} from '@questbook/service-validator-client'
import {
	getDefaultConfig,
	RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ethers, Wallet } from 'ethers'
import { NextPage } from 'next'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import favIcon from 'public/favicon.ico'
import {
	ALL_SUPPORTED_CHAIN_IDS,
	defaultChainId,
	SupportedChainId,
} from 'src/constants/chains'
import { SafeProvider } from 'src/contexts/safeContext'
import SubgraphClient from 'src/graphql/subgraph'
import { DAOSearchContextMaker } from 'src/libraries/hooks/DAOSearchContext'
import { QBAdminsContextMaker } from 'src/libraries/hooks/QBAdminsContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { DOMAIN_CACHE_KEY } from 'src/libraries/ui/NavBar/_utils/constants'
import QRCodeModal from 'src/libraries/ui/QRCodeModal'
import { delay } from 'src/libraries/utils'
import { generateToken, verifyToken } from 'src/libraries/utils/authToken'
import { addAuthorizedUser, bicoDapps, getNonce, jsonRpcProviders, networksMapping } from 'src/libraries/utils/gasless'
import { extractInviteInfo, InviteInfo } from 'src/libraries/utils/invite'
import logger from 'src/libraries/utils/logger'
import getSeo from 'src/libraries/utils/seo'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import theme from 'src/theme'
import { GrantProgramContextType, GrantType, MinimalWorkspace, NotificationContextType, Roles } from 'src/types'
import { BiconomyWalletClient } from 'src/types/gasless'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { arbitrum, aurora, base, celo, iotex, mainnet, optimism, polygon, sepolia, zkSync } from 'wagmi/chains'
// import { InjectedConnector } from 'wagmi/connectors/injected'
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// import { infuraProvider } from 'wagmi/providers/infura'
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
// import { publicProvider } from 'wagmi/providers/public'
import { injected, walletConnect } from 'wagmi/connectors'
import '@rainbow-me/rainbowkit/styles.css'
import 'styles/globals.css'
import 'draft-js/dist/Draft.css'
import 'src/libraries/utils/appCopy'

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
};


const client = createConfig({
	chains: [mainnet, base, polygon, arbitrum, optimism, celo, aurora, iotex, zkSync, sepolia],
	syncConnectedChain: true,
	ssr: true,
	connectors: [
		injected({
			shimDisconnect: true,
		}),
		walletConnect({
			projectId: '1a646363ec322c7ba5b21240860f2aec', qrModalOptions: {
				themeVariables: {
					'--wcm-z-index': '10000',
				},
				enableExplorer: false,
			},
			showQrModal: true,
			metadata: {
				name: 'Questbook',
				url: 'https://ens.questbook.app',
				description: 'Discover Opportunities in Web 3.0 and Earn in Crypto',
				icons: ['https://ens.questbook.app/favicon.svg'],
			}
		}),
	],
	transports: {
		[mainnet.id]: http(),
		[base.id]: http(),
		[polygon.id]: http(),
		[arbitrum.id]: http(),
		[optimism.id]: http(),
		[celo.id]: http(),
		[aurora.id]: http(),
		[iotex.id]: http(),
		[zkSync.id]: http(),
		[sepolia.id]: http(),
	},
})

logger.info('client', client)

const config = getDefaultConfig({
	appName: 'Questbook',
	projectId: '1a646363ec322c7ba5b21240860f2aec',
	chains: [mainnet, polygon, optimism, arbitrum, base, celo, aurora, iotex, zkSync, sepolia],
	syncConnectedChain: true,
	appDescription: 'Discover Opportunities in Web 3.0 and Earn in Crypto',
	appUrl: 'https://ens.questbook.app',
	ssr: true, // If your dApp uses server side rendering (SSR)

})


// const defaultChain = chain.polygon
// const { chains, provider } = configureChains(allChains, [
// 	jsonRpcProvider({
// 		rpc: (chain: Chain) => {
// 			const rpcUrl = CHAIN_INFO[chain.id as SupportedChainId]?.rpcUrls[0]
// 			if(!rpcUrl) {
// 				return {
// 					http: CHAIN_INFO[defaultChain.id as SupportedChainId].rpcUrls[0],
// 				}
// 			}

// 			return { http: rpcUrl }
// 		},
// 	}),
// 	infuraProvider({ apiKey: infuraId! }),
// 	publicProvider(),
// ])
const queryClient = new QueryClient()


type InitiateBiconomyReturnType = {
	biconomyDaoObj: typeof BiconomyContext
	biconomyWalletClient: BiconomyWalletClient
}

// Set up client
// const client = createClient({
// 	autoConnect: true,
// 	connectors: [
// 		new InjectedConnector({
// 			chains,
// 			options: {
// 				name: 'Injected',
// 				shimDisconnect: true,
// 				shimChainChangedDisconnect: true
// 			},
// 		}),
// 		new MetaMaskConnector({
// 			chains,
// 			options: {
// 				shimDisconnect: true,
// 				shimChainChangedDisconnect: true
// 			},
// 		}),
// 		new WalletConnectConnector({
// 			chains,
// 			options: {
// 				qrcode: true,
// 				rpc: {
// 					'137': `https://polygon-mainnet.infura.io/v3/${infuraId}`,
// 					'5': `https://goerli.infura.io/v3/${infuraId}`
// 				},
// 			},
// 		}),
// 	],
// 	provider,
// })

export const ApiClientsContext = createContext<{
	validatorApi: ValidationApi
	workspace?: MinimalWorkspace
	setWorkspace: (workspace?: MinimalWorkspace) => void
	subgraphClients: { [chainId: string]: SubgraphClient }
	chainId: SupportedChainId
	inviteInfo: InviteInfo | undefined
	setInviteInfo: (inviteInfo: InviteInfo) => void
	isNewUser: boolean
		} | null>(null)

export const GrantsProgramContext = createContext<GrantProgramContextType | null>(null)

export const NotificationContext = createContext<NotificationContextType | null>(null)

export const SignInMethodContext = createContext<{
	signInMethod: 'newWallet' | 'existingWallet' | 'choosing' | 'externalWallet'
	setSignInMethod: (signInMethod: 'newWallet' | 'existingWallet' | 'choosing' | 'externalWallet') => void

		} | null>(null)
export const SignInContext = createContext<{
	signIn: boolean
	setSignIn: (signIn: boolean) => void
		} | null>(null)

export const SignInTitleContext = createContext<{
	signInTitle: 'admin' | 'reviewer' | 'default' | 'postComment' | 'submitProposal'
	setSignInTitle: (signInTitle: 'admin' | 'reviewer' | 'default' | 'postComment' | 'submitProposal') => void
		} | null>(null)

export const WebwalletContext = createContext<{
	webwallet?: Wallet | null
	setWebwallet: (webwallet?: Wallet | null) => void
	glyph?: Boolean
	setGlyph: (glyph?: Boolean) => void
	network?: SupportedChainId
	switchNetwork: (newNetwork?: SupportedChainId) => void
	scwAddress?: string
	setScwAddress: (scwAddress?: string) => void
	isEOA?: boolean
	setIsEOA: (isEOA?: boolean) => void
	waitForScwAddress: Promise<string>

	nonce?: string
	setNonce: (nonce?: string) => void
	dashboardStep: boolean
	setDashboardStep: (dashboardStep: boolean) => void
	createingProposalStep: number
	setCreatingProposalStep: (createingProposalStep: number) => void
	loadingNonce: boolean
	setLoadingNonce: (loadingNonce: boolean) => void
	importWebwallet: (privateKey: string) => void
	existingWallets: (address: string) => void
	exportWebwallet: () => string
	loadingScw: boolean
	setLoadingScw: (loadingScw: boolean) => void
		} | null>(null)

export const BiconomyContext = createContext<{
	biconomyDaoObjs?: { [key: string]: typeof Biconomy }
	setBiconomyDaoObjs: (biconomyDaoObjs: { [key: string]: typeof Biconomy }) => void
	initiateBiconomy: (chainId: string) => Promise<InitiateBiconomyReturnType | undefined>
	loadingBiconomyMap: { [_: string]: boolean }
	biconomyWalletClients?: { [key: string]: BiconomyWalletClient }
	setBiconomyWalletClients: (biconomyWalletClients?: { [key: string]: BiconomyWalletClient }) => void
		} | null>(null)

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const [network, switchNetwork] = useState<SupportedChainId>(defaultChainId)
	const [webwallet, setWebwallet] = useState<Wallet | null>()
	const [workspace, setWorkspace] = useState<MinimalWorkspace>()
	const [inviteInfo, setInviteInfo] = useState<InviteInfo>()

	const [grant, setGrant] = useState<GrantType>()
	const [role, setRole] = useState<Roles>('community')
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [glyph, setGlyph] = useState<boolean>(false)
	const [isEOA, setIsEOA] = useState<boolean>(false)
	const [scwAddress, setScwAddress] = useState<string>()
	const [loadingScw, setLoadingScw] = useState<boolean>(true)
	const [biconomyDaoObjs, setBiconomyDaoObjs] = useState<{ [key: string]: typeof BiconomyContext }>()
	const [biconomyWalletClients, setBiconomyWalletClients] = useState<{ [key: string]: BiconomyWalletClient }>()
	const [nonce, setNonce] = useState<string>()
	const [loadingNonce, setLoadingNonce] = useState<boolean>(false)
	const [isNewUser, setIsNewUser] = useState<boolean>(true)
	// const { isConnected } = useAccount()
	const [qrCodeText, setQrCodeText] = useState<string>()
	const [dashboardStep, setDashboardStep] = useState<boolean>(false)
	const [createingProposalStep, setCreatingProposalStep] = useState<number>(1)
	const [biconomyLoading, setBiconomyLoading] = useState<{ [chainId: string]: boolean }>({})
	const [signInMethod, setSignInMethod] = useState<'newWallet' | 'existingWallet' | 'choosing' | 'externalWallet'>('choosing')
	const [signInTitle, setSignInTitle] = useState<'admin' | 'reviewer' | 'default' | 'postComment' | 'submitProposal'>('default')
	const [signIn, setSignIn] = useState<boolean>(false)
	// store the chainId that was most recently asked to be init
	const mostRecentInitChainId = useRef<string>()
	// ref to store all the chains that are loading biconomy
	// this is used to prevent multiple calls to biconomy init
	const biconomyInitPromisesRef = useRef<{ [chainId: string]: Promise<InitiateBiconomyReturnType> | undefined }>({})
	// reference to scw address
	// used to poll for scwAddress in "waitForScwAddress"
	const scwAddressRef = useRef(scwAddress)

	const getUseNonce = useCallback(async() => {
		const _nonce = await getNonce(webwallet)
		return _nonce
	}, [webwallet])

	useEffect(() => {
		hotjar.initialize(3167823, 6)
	}, [])

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

					logger.info({ result }, 'checkIfWalletExists')
					let walletAddress = result.walletAddress
					logger.info({ walletAddress }, 'already deployed')
					if(!result.doesWalletExist) {
						// walletAddress = await deploySCW(webwallet, _biconomyWalletClient, chainId, nonce!)
						walletAddress = webwallet.address
						_logger.info({ walletAddress }, 'scw deployed')
					}

					const authToken = localStorage.getItem('authToken')
					const jwtRegex = new RegExp('^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_.+/=]*$')
					const isEOA = localStorage.getItem('isEOA')
					if(!authToken?.match(jwtRegex)) {
						const token = await generateToken(!result.doesWalletExist ? walletAddress : webwallet.address)
						if(token && !isEOA) {
							const sign = await webwallet.signMessage(token?.nonce)
							const tokenData = await verifyToken(token?.id, sign)

							if(tokenData) {
								localStorage.setItem('authToken', tokenData) // Storing the verified token directly
							}
						}
						// else if(token && isEOA){
						// 	await signMessage({
						// 		message: token?.nonce
						// 	})
						// 	if (variables?.message && signMessageData) {
						// 		const tokenData = await verifyToken(token?.id, signMessageData)
						// 		if(tokenData){
						// 			localStorage.setItem('authToken', tokenData)
						// 		}
						// 	}

						// }
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
		setBiconomyDaoObjs(prev => ({ ...prev, [chainId]: _biconomy }))

		// only switch the chainId if it's the most recently requested one
		// this prevents race conditions when inititialisation of multiple chains is requested
		// and the most recently requested one finishes later
		if(mostRecentInitChainId.current === chainId) {
			setScwAddress(scwAddress)
			setLoadingScw(false)
			localStorage.setItem('scwAddress', scwAddress)
			_logger.info('switched chain after init')
			const chain = parseInt(chainId)
			switchNetwork(chain)
		}

		return { biconomyDaoObj: _biconomy, biconomyWalletClient: _biconomyWalletClient! }
	}, [webwallet, nonce])

	const initiateBiconomy = useCallback(
		async(chainId: string) => {
			let task = biconomyInitPromisesRef.current[chainId]

			mostRecentInitChainId.current = chainId
			if(!task) {
				setBiconomyLoading(prev => ({ ...prev, [chainId]: true }))

				// @ts-ignore
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

			if(task) {
				return await task
			}
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
		setLoadingScw(true)
		setBiconomyWalletClients({})
		setBiconomyDaoObjs({})
		setBiconomyLoading({})

		biconomyInitPromisesRef.current = {}

	}, [setWebwallet])

	const existingWallets = useCallback((address: string) => {
		const walletObj = {
			address: address,
			privateKey: address,
			provider: ethers.getDefaultProvider(),
			publicKey: address
		}
		setWebwallet(walletObj as never as Wallet)
		setLoadingNonce(false)
		setNonce(undefined)
		setScwAddress(undefined)
		setLoadingScw(true)
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

		(async() => {
			try {
				await addAuthorizedUser(webwallet?.address!)
				const newNonce = await getUseNonce()
				setNonce(newNonce)
			} catch(err) {
				logger.error({ err }, 'error in adding authorized user')
			}
		})()

	}, [webwallet, nonce])

	useEffect(() => {
		setWebwallet(createWebWallet())
		setScwAddress(getScwAddress())
		setLoadingScw(false)
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
			return null
		}

		try {
			newWebwallet = new Wallet(privateKey)
			setIsNewUser(false)
			return newWebwallet
		} catch{
			return undefined
		}
	}

	const SignInMethodContextValue = useMemo(() => ({
		signInMethod,
		setSignInMethod
	}), [signInMethod, setSignInMethod])
	const SignInContextValue = useMemo(() => ({
		signIn,
		setSignIn
	}), [signIn, setSignIn])
	const SignInTitleContextValue = useMemo(() => ({
		signInTitle,
		setSignInTitle
	}), [signInTitle, setSignInTitle])
	const webwalletContextValue = useMemo(
		() => ({
			webwallet: webwallet,
			setWebwallet: (newWebwallet?: Wallet | null) => {
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
				setLoadingScw(false)
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
			glyph: glyph,
			setGlyph: (newGlyph?: Boolean) => {
				if(newGlyph) {
					localStorage.setItem('glyph', newGlyph.toString())
				} else {
					localStorage.removeItem('glyph')
				}

				setGlyph(newGlyph as boolean)
			},
			isEOA: isEOA,
			setIsEOA: (newIsEOA?: boolean) => {
				if(newIsEOA) {
					localStorage.setItem('isEOA', newIsEOA.toString())
				} else {
					localStorage.removeItem('isEOA')
				}

				setIsEOA(newIsEOA as boolean)
			},
			dashboardStep,
			setDashboardStep,
			createingProposalStep,
			setCreatingProposalStep,
			loadingNonce,
			setLoadingNonce,
			loadingScw,
			setLoadingScw,
			importWebwallet,
			existingWallets,
			exportWebwallet
		}),
		[dashboardStep, createingProposalStep, setCreatingProposalStep, setDashboardStep, webwallet, setWebwallet, network, switchNetwork, scwAddress, setScwAddress, nonce, setNonce, loadingNonce, setLoadingNonce, loadingScw, setLoadingScw, glyph, setGlyph]
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
		})
		return new ValidationApi(validatorConfiguration)
	}, [])

	const [connected, setConnected] = useState(false)

	const chainId = useMemo(() => {
		const chainId = getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
		switchNetwork(chainId)
		return chainId
	}, [workspace])

	const toast = useCustomToast()

	useEffect(() => {
		try {
			const inviteInfo = extractInviteInfo()
			if(inviteInfo) {
				setInviteInfo(inviteInfo)
			}
		} catch(error) {
			toast({
				title: `Invalid invite "${(error as Error).message}"`,
				status: 'error',
				duration: 9000,
				isClosable: true,
			})
		}
	}, [])

	const apiClients = useMemo(
		() => ({
			validatorApi,
			workspace,
			setWorkspace: (newWorkspace?: MinimalWorkspace) => {
				if(newWorkspace) {
					localStorage.setItem(
						DOMAIN_CACHE_KEY,
						newWorkspace.supportedNetworks[0] + '-' + newWorkspace.id
					)
				} else {
					localStorage.setItem(DOMAIN_CACHE_KEY, 'undefined')
				}
			},
			chainId,
			inviteInfo,
			setInviteInfo,
			subgraphClients: clients,
			isNewUser,
		}),
		[validatorApi, workspace, setWorkspace, clients, connected, setConnected, chainId, inviteInfo, isNewUser]
	)

	const seo = getSeo()

	const grantProgram = useMemo(() => {
		return {
			grant,
			setGrant,
			role,
			setRole,
			isLoading,
			setIsLoading
		}
	}, [grant, setGrant, role, setRole, isLoading, setIsLoading])

	const notificationContext = useMemo(() => {
		return {
			qrCodeText,
			setQrCodeText,
		}
	}, [qrCodeText, setQrCodeText])

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
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<RainbowKitProvider initialChain={1}>
						<ApiClientsContext.Provider value={apiClients}>
							<NotificationContext.Provider value={notificationContext}>
								<SignInContext.Provider value={SignInContextValue}>
									<SignInTitleContext.Provider value={SignInTitleContextValue}>
										<SignInMethodContext.Provider value={SignInMethodContextValue}>
											<WebwalletContext.Provider value={webwalletContextValue}>
												<BiconomyContext.Provider value={biconomyDaoObjContextValue}>
													<SafeProvider>
														<>
															<DAOSearchContextMaker>
																<GrantsProgramContext.Provider value={grantProgram}>
																	<QBAdminsContextMaker>
																		<ChakraProvider theme={theme}>
																			{getLayout(<Component {...pageProps} />)}
																			<QRCodeModal />
																		</ChakraProvider>
																	</QBAdminsContextMaker>
																</GrantsProgramContext.Provider>

															</DAOSearchContextMaker>
														</>
													</SafeProvider>
												</BiconomyContext.Provider>
											</WebwalletContext.Provider>
										</SignInMethodContext.Provider>
									</SignInTitleContext.Provider>
								</SignInContext.Provider>
							</NotificationContext.Provider>
						</ApiClientsContext.Provider>
					</RainbowKitProvider>
				</QueryClientProvider>
			</WagmiProvider>
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
			<Script src='https://scripts.simpleanalyticscdn.com/latest.js' />
			<noscript>
				<img
					src='https://queue.simpleanalyticscdn.com/noscript.gif'
					alt=''
					referrerPolicy='no-referrer-when-downgrade'
				/>
			</noscript>
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