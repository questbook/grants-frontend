import { useCallback, useContext, useEffect } from 'react'
import { Biconomy } from '@biconomy/mexa'
import SupportedChainId from 'src/generated/SupportedChainId'
import { BiconomyWalletClient } from 'src/types/gasless'
import { bicoDapps, deploySCW, jsonRpcProviders } from 'src/utils/gaslessUtils'
import { BiconomyContext, WebwalletContext } from '../../../pages/_app'
import { useNetwork } from './useNetwork'


export const useBiconomy = (data: { chainId?: string }) => {
	const { webwallet, scwAddress, setScwAddress, nonce, } = useContext(WebwalletContext)!
	const { biconomyDaoObj, setBiconomyDaoObj, biconomyWalletClient, setBiconomyWalletClient } = useContext(BiconomyContext)!
	const { network, switchNetwork } = useNetwork()

	useEffect(() => {
		const isBiconomyLoading = (typeof window !== 'undefined') ? localStorage.getItem('isBiconomyLoading') === 'true' : false
		console.log('STEP3', biconomyDaoObj, nonce, webwallet, biconomyWalletClient, data.chainId, network, isBiconomyLoading)
		console.log('STEP3: CHAIN - ', data.chainId, biconomyDaoObj?.networkId)
		if((!isBiconomyLoading && data.chainId && biconomyDaoObj && biconomyDaoObj.networkId && data.chainId !== biconomyDaoObj.networkId.toString()) ||
		((!isBiconomyLoading && nonce && webwallet && (!biconomyDaoObj || !biconomyWalletClient || !scwAddress)))) {
			if(typeof window !== 'undefined') {
				localStorage.setItem('isBiconomyLoading', 'true')
			}

			console.count('STEP3: trying 2')
			initiateBiconomy()
				.then((res) => console.log(res))
				.catch(error => console.log(error))
		}

		return (() => {
			if(typeof window !== 'undefined') {
				console.log("hasan")
				localStorage.setItem('isBiconomyLoading', 'false')
			}
		})

	}, [data.chainId, nonce])


	const initiateBiconomy = useCallback(async() => {
		console.log('STEP2', webwallet, network, data.chainId)
		if(!webwallet) {
			return
		}

		console.log('DAODAO1', biconomyDaoObj)
		console.log('DAODAO2', biconomyWalletClient)
		console.log('DAODAO3', scwAddress)

		console.log('CREATING BICONOMY OBJ')

		const _newChainId = data.chainId ? data.chainId : network!.toString()

		const _biconomy = new Biconomy(jsonRpcProviders[_newChainId],
			{
				apiKey: bicoDapps[_newChainId].apiKey,
				debug: true
			})

		console.log('BICONOMY OBJ CREATED', _biconomy)
		_biconomy.onEvent(_biconomy.READY, async() => {
			console.log('Inside biconomy ready event')

			const _biconomyWalletClient: BiconomyWalletClient = await _biconomy.biconomyWalletClient
			console.log('biconomyWalletClient', _biconomyWalletClient)

			if(_biconomyWalletClient) {
				const walletAddress = await deploySCW(webwallet, _biconomyWalletClient)
				setScwAddress(walletAddress)
				console.log('SCWSCW', walletAddress, scwAddress)
			}

			setBiconomyWalletClient(_biconomyWalletClient)
			setBiconomyDaoObj(_biconomy)
			if(typeof window !== 'undefined') {
				localStorage.setItem('isBiconomyLoading', 'false')
			}

			switchNetwork(_newChainId as unknown as SupportedChainId)

		}).onEvent(_biconomy.ERROR, (error: any, message: any) => {
			// setIsLoading(false)
			if(typeof window !== 'undefined') {
				localStorage.setItem('isBiconomyLoading', 'false')
			}

			console.log(message)
			console.log(error)
		})

	}, [webwallet, data.chainId])

	return {
		biconomyDaoObj: biconomyDaoObj,
		biconomyWalletClient: biconomyWalletClient,
		scwAddress: scwAddress,
		loading: typeof window !== 'undefined' ? localStorage.getItem('isBiconomyLoading') === 'true' : false,
	}
}