import { useContext, useEffect, useState } from 'react'
import { Biconomy } from '@biconomy/mexa'
import { BiconomyWalletClient } from 'src/types/gasless'
import { deploySCW, jsonRpcProviders } from 'src/utils/gaslessUtils'
import { BiconomyContext, WebwalletContext } from '../../../pages/_app'
import { useNetwork } from './useNetwork'


export const useBiconomy = (data: { apiKey: string, }) => {
	const { webwallet, scwAddress, setScwAddress, nonce, } = useContext(WebwalletContext)!
	const { biconomyDaoObj, setBiconomyDaoObj } = useContext(BiconomyContext)!
	const [biconomyWalletClient, setBiconomyWalletClient] = useState<BiconomyWalletClient>()
	const { network } = useNetwork()

	useEffect(() => {
		console.log('STEP1', nonce, webwallet, biconomyWalletClient);
		if (nonce && webwallet && (!biconomyDaoObj || !biconomyWalletClient || !scwAddress)) {
			initiateBiconomy()
				.then(res => console.log(res))
				.catch(error => console.log(error))
		}
	}, [webwallet, nonce, biconomyDaoObj, biconomyWalletClient, scwAddress])


	const initiateBiconomy = async () => {
		console.log("STEP2", webwallet, network)
		if (!webwallet || !network) {
			return
		}

		console.log(webwallet, nonce, biconomyDaoObj)

		console.log('CREATING BICONOMY OBJ', network.toString())
		let _biconomy = new Biconomy(jsonRpcProviders[network.toString()],
			{
				apiKey: data.apiKey,
				debug: true
			})

		console.log('BICONOMY OBJ CREATED', _biconomy)
		_biconomy.onEvent(_biconomy.READY, async () => {
			console.log('Inside biconomy ready event')

			const _biconomyWalletClient: BiconomyWalletClient = _biconomy.biconomyWalletClient
			console.log('biconomyWalletClient', _biconomyWalletClient)

			if (!scwAddress) {
				const walletAddress = await deploySCW(webwallet, _biconomyWalletClient)
				setScwAddress(walletAddress)
			} else {
				console.log('SCW Wallet already exists at Address', scwAddress)
			}

			if (!biconomyWalletClient) {
				setBiconomyWalletClient(_biconomyWalletClient)
			}

			if (!biconomyDaoObj)
				setBiconomyDaoObj(_biconomy)
		}).onEvent(_biconomy.ERROR, (error: any, message: any) => {
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