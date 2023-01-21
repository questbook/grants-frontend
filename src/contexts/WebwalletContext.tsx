import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Wallet } from 'ethers'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import logger from 'src/libraries/logger'
import { WebwalletContextType } from 'src/libraries/utils/types'
import { addAuthorizedUser, getNonce } from 'src/utils/gaslessUtils'
import { delay } from 'src/utils/generics'

const WebwalletContext = createContext<WebwalletContextType | null>(null)

const WebwalletContextProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const [network, switchNetwork] = useState<SupportedChainId>(defaultChainId)
	const [webwallet, setWebwallet] = useState<Wallet>()
	const [nonce, setNonce] = useState<string>()
	const [loadingNonce, setLoadingNonce] = useState<boolean>(false)
	const [scwAddress, setScwAddress] = useState<string>()

	const scwAddressRef = useRef<string | undefined>(scwAddress)

	const { setIsNewUser } = useContext(ApiClientsContext)!

	const getNetwork = () => defaultChainId

	const getUseNonce = useCallback(async() => {
		const _nonce = await getNonce(webwallet)
		return _nonce
	}, [webwallet])

	const createWebWallet = () => {
		const privateKey = localStorage.getItem('webwalletPrivateKey')
		let newWebwallet = Wallet.createRandom()

		if(!privateKey) {
			setIsNewUser(true)
			localStorage.setItem('webwalletPrivateKey', newWebwallet.privateKey)
			return newWebwallet
		}

		try {
			newWebwallet = new Wallet(privateKey)
			setIsNewUser(false)
			return newWebwallet
		} catch{
			localStorage.setItem('webwalletPrivateKey', newWebwallet.privateKey)
			setIsNewUser(true)
			return newWebwallet
		}
	}

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

	// const importWebwallet = useCallback((privateKey: string) => {
	// 	const newWebwallet = new ethers.Wallet(privateKey)

	// 	// set the webwallet
	// 	localStorage.setItem('webwalletPrivateKey', privateKey)
	// 	setWebwallet(newWebwallet)

	// 	// reset everything else
	// 	setLoadingNonce(false)
	// 	setNonce(undefined)
	// 	setScwAddress(undefined)
	// 	setBiconomyWalletClients({})
	// 	setBiconomyDaoObjs({})
	// 	setBiconomyLoading({})

	// 	biconomyInitPromisesRef.current = {}

	// }, [setWebwallet])

	// const exportWebwallet = useCallback(() => {

	// 	if(!webwallet) {
	// 		throw new Error('No webwallet to export')
	// 	}

	// 	return webwallet.privateKey

	// }, [webwallet])

	useEffect(() => {
		setWebwallet(createWebWallet())
		setScwAddress(getScwAddress())
		setNonce(getLocalNonce())
		const network = getNetwork()
		logger.info('SWITCH NETWORK (_app.tsx 1): ', network)
		switchNetwork(network)
	}, [])

	useEffect(() => {
		// set the scwaddress ref whenever it changes
		scwAddressRef.current = scwAddress
	}, [scwAddress])

	useEffect(() => {
		if(!webwallet || (nonce && nonce !== 'Token expired')) {
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
			network,
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
		}),
		[webwallet, setWebwallet, network, switchNetwork, scwAddress, setScwAddress, nonce, setNonce, loadingNonce, setLoadingNonce]
	)

	const context = () => {
		return (
			<WebwalletContext.Provider value={webwalletContextValue}>
				{children}
			</WebwalletContext.Provider>
		)
	}

	return context()
}

export { WebwalletContext, WebwalletContextProvider }