import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Biconomy } from '@biconomy/mexa'
import { WebwalletContext } from 'src/contexts/WebwalletContext'
import logger from 'src/libraries/logger'
import { BiconomyContextType, InitiateBiconomyReturnType } from 'src/libraries/utils/types'
import { BiconomyWalletClient } from 'src/types/gasless'
import { bicoDapps, deploySCW, jsonRpcProviders, networksMapping } from 'src/utils/gaslessUtils'
import { delay } from 'src/utils/generics'

const BiconomyContext = createContext<BiconomyContextType | null>(null)

const BiconomyContextProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const context = () => {
		return (
			<BiconomyContext.Provider value={biconomyDaoObjContextValue}>
				{children}
			</BiconomyContext.Provider>
		)
	}

	const { setScwAddress, webwallet, nonce, network, switchNetwork } = useContext(WebwalletContext)!

	const [biconomyDaoObjs, setBiconomyDaoObjs] = useState<{[key: string]: typeof BiconomyContext}>()
	const [biconomyWalletClients, setBiconomyWalletClients] = useState<{[key: string]: BiconomyWalletClient}>()
	const [biconomyLoading, setBiconomyLoading] = useState<{ [chainId: string]: boolean }>({})

	// store the chainId that was most recently asked to be init
	const mostRecentInitChainId = useRef<string>()
	// ref to store all the chains that are loading biconomy
	// this is used to prevent multiple calls to biconomy init
	const biconomyInitPromisesRef = useRef<{ [chainId: string]: Promise<InitiateBiconomyReturnType> | undefined }>({})
	// reference to scw address
	// used to poll for scwAddress in "waitForScwAddress"

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
		setBiconomyDaoObjs(prev => ({ ...prev, [chainId]: _biconomy }))

		// only switch the chainId if it's the most recently requested one
		// this prevents race conditions when inititialisation of multiple chains is requested
		// and the most recently requested one finishes later
		if(mostRecentInitChainId.current === chainId) {
			setScwAddress(scwAddress)
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

	useEffect(() => {
		if(webwallet && nonce && nonce !== 'Token expired') {
			initiateBiconomy(network.toString())
		}
	}, [nonce, webwallet, network])

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

	return context()
}

export { BiconomyContext, BiconomyContextProvider }