import { useContext, useEffect } from 'react'
import { Biconomy } from '@biconomy/mexa'
import { BiconomyWalletClient } from 'src/types/gasless'
import { deploySCW, jsonRpcProviders } from 'src/utils/gaslessUtils'
import { BiconomyContext, WebwalletContext } from '../../../pages/_app'
import { useNetwork } from './useNetwork'


export const useBiconomy = (data: { apiKey: string, }) => {
	const { webwallet, scwAddress, setScwAddress, nonce, } = useContext(WebwalletContext)!
	const { biconomyDaoObj, setBiconomyDaoObj, biconomyWalletClient, setBiconomyWalletClient, loading, setIsLoading } = useContext(BiconomyContext)!
	const { network } = useNetwork()

	useEffect(() => {
		console.log('STEP1', nonce, webwallet, biconomyWalletClient)
		if(!loading && nonce && webwallet && network && (!biconomyDaoObj || !biconomyWalletClient || !scwAddress)) {
			setIsLoading(true)
			initiateBiconomy()
				.then(res => console.log(res))
				.catch(error => console.log(error))
		}
	}, [webwallet, nonce, biconomyDaoObj, biconomyWalletClient, scwAddress, network])

	const initiateBiconomy = async() => {
		console.log('STEP2', webwallet, network)
		if(!webwallet || !network) {
			return
		}

		console.log('DAODAO1', biconomyDaoObj)
		console.log('DAODAO2', biconomyWalletClient)
		console.log('DAODAO3', scwAddress)

		console.log('CREATING BICONOMY OBJ', network.toString())
		const _biconomy = new Biconomy(jsonRpcProviders[network.toString()],
			{
				apiKey: data.apiKey,
				debug: true
			})

		console.log('BICONOMY OBJ CREATED', _biconomy)
		_biconomy.onEvent(_biconomy.READY, async() => {
			console.log('Inside biconomy ready event')

			const _biconomyWalletClient: BiconomyWalletClient = _biconomy.biconomyWalletClient
			console.log('biconomyWalletClient', _biconomyWalletClient)

			const walletAddress = await deploySCW(webwallet, _biconomyWalletClient)
			console.log("SCWSCW", walletAddress, scwAddress);
			if(walletAddress === scwAddress)
				setScwAddress(walletAddress)
			else console.log('SCW Wallet already exists at Address', scwAddress)
			

			if(!biconomyWalletClient) {
				setBiconomyWalletClient(_biconomyWalletClient)
			}

			if(!biconomyDaoObj) {
				setBiconomyDaoObj(_biconomy)
			}

			setIsLoading(false)
		}).onEvent(_biconomy.ERROR, (error: any, message: any) => {
			setIsLoading(false)
			console.log(message)
			console.log(error)
		})

	}

	return {
		biconomyDaoObj: biconomyDaoObj,
		biconomyWalletClient: biconomyWalletClient,
		scwAddress: scwAddress
	}
}