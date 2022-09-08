import { useCallback, useContext, useEffect, useState } from 'react'
import { Biconomy } from '@biconomy/mexa'
import { BiconomyContext, WebwalletContext } from 'pages/_app'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { BiconomyWalletClient } from 'src/types/gasless'
import { bicoDapps, deploySCW, jsonRpcProviders, networksMapping } from 'src/utils/gaslessUtils'
import MAIN_LOGGER from 'src/utils/logger'

const logger = MAIN_LOGGER.child({ stream: 'biconomy' })

export const useBiconomy = (data: { chainId?: string, shouldRefreshNonce?: boolean }) => {
	const { webwallet, scwAddress, setScwAddress, nonce } = useContext(WebwalletContext)!
	const { biconomyDaoObj, setBiconomyDaoObj, biconomyWalletClient, setBiconomyWalletClient } = useContext(BiconomyContext)!
	const { switchNetwork } = useNetwork()
	const [biconomyInitPromises, setBiconomyInitPromises] = useState<{ [chainId: string]: Promise<void> | undefined }>({})

	const initiateBiconomy = useCallback(async(chainId: string) => {
		if(!webwallet) {
			throw new Error('Attempted init without webwallet')
		}

		if(!nonce) {
			throw new Error('Attempted init without nonce')
		}

		chainId = networksMapping[chainId]

		const _biconomy = new Biconomy(
			jsonRpcProviders[chainId],
			{
				apiKey: bicoDapps[chainId].apiKey,
				debug: true 
			}
		)
		logger.info('initializing biconomy')

		let _biconomyWalletClient: BiconomyWalletClient
		const scwAddress = await new Promise<string>((resolve, reject) => {
			_biconomy.onEvent(_biconomy.READY, async() => {
				logger.info('biconomy ready')

				_biconomyWalletClient = await _biconomy.biconomyWalletClient
				
				const { doesWalletExist, walletAddress } = await _biconomyWalletClient.checkIfWalletExists({ eoa: webwallet.address })
				
				if(doesWalletExist){
					resolve(walletAddress);
				}
				
				const newWalletAddress = await deploySCW(webwallet, _biconomyWalletClient, chainId, nonce!)

				logger.info({ newWalletAddress, chainId }, 'scw deployed')

				resolve(newWalletAddress)
			})

			_biconomy.onEvent(_biconomy.ERROR, (err: Error) => {
				logger.error({ err }, 'biconomy error')
				reject(err)
			})
		})

		setScwAddress(scwAddress)
		setBiconomyWalletClient(_biconomyWalletClient!)
		setBiconomyDaoObj(_biconomy)
		switchNetwork(parseInt(chainId))
	}, [webwallet, data.chainId, nonce])

	useEffect(() => {

		if(typeof window === 'undefined') {
			return
		}

		const chainId = data.chainId

		if(!webwallet || !nonce || !chainId) {
			return
		}

		let disposed = false
		const isLoading = !!biconomyInitPromises[chainId]
		if(!isLoading) {
			const task = initiateBiconomy(chainId)
				.finally(() => {
					if(!disposed) {
						setBiconomyInitPromises(prev => {
							return { ...prev, [chainId]: undefined }
						})
					}
				})
			setBiconomyInitPromises(prev => ({ ...prev, [chainId]: task }))
		}

		return () => {
			disposed = true
		}
	}, [initiateBiconomy, data.chainId, nonce])

	return {
		biconomyDaoObj: biconomyDaoObj,
		biconomyWalletClient: biconomyWalletClient,
		scwAddress: scwAddress,
		loading: !!biconomyInitPromises[data.chainId!],
	}
}