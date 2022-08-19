import { useCallback, useContext, useEffect } from 'react'
import { Biconomy } from '@biconomy/mexa'
import SupportedChainId from 'src/generated/SupportedChainId'
import { BiconomyWalletClient } from 'src/types/gasless'
import { bicoDapps, deploySCW, jsonRpcProviders } from 'src/utils/gaslessUtils'
import { BiconomyContext, WebwalletContext } from '../../../pages/_app'
import { useNetwork } from './useNetwork'


export const useBiconomy = (data: { chainId?: string }) => {
	const { webwallet, scwAddress, setScwAddress, nonce, } = useContext(WebwalletContext)!
	const { biconomyDaoObj, setBiconomyDaoObj, biconomyWalletClient, setBiconomyWalletClient, loading, setIsLoading } = useContext(BiconomyContext)!
	const { network, switchNetwork } = useNetwork()

	useEffect(() => {

		console.log('STEP1', biconomyDaoObj, nonce, webwallet, biconomyWalletClient, loading)
		if(
			(!loading && nonce && webwallet && (!biconomyDaoObj || !biconomyWalletClient || !scwAddress)) ||
			(data.chainId && biconomyDaoObj && biconomyDaoObj.networkChainId && data.chainId !== biconomyDaoObj.networkChainId.toString())) {
			setIsLoading(true)
			initiateBiconomy()
				.then((res) => console.log(res))
				.catch(error => console.log(error))
		}


	}, [webwallet, nonce, biconomyDaoObj, biconomyWalletClient, scwAddress, data.chainId])

	const initiateBiconomy = useCallback(async() => {
		console.log('STEP2', webwallet, network, data.chainId)
		if(!webwallet || !network) {
			return
		}

		console.log('DAODAO1', biconomyDaoObj)
		console.log('DAODAO2', biconomyWalletClient)
		console.log('DAODAO3', scwAddress)

		console.log('CREATING BICONOMY OBJ', network.toString())

		let _newChainId = data.chainId ? data.chainId : network
		_newChainId = network.toString()

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
			setIsLoading(false)
			switchNetwork(_newChainId as unknown as SupportedChainId)

		}).onEvent(_biconomy.ERROR, (error: any, message: any) => {
			setIsLoading(false)
			console.log(message)
			console.log(error)
		})

	}, [webwallet, network, data.chainId])

	return {
		biconomyDaoObj: biconomyDaoObj,
		biconomyWalletClient: biconomyWalletClient,
		scwAddress: scwAddress
	}
}