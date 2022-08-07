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
		console.log('EHERE', biconomyDaoObj)
		if(nonce && webwallet && (!biconomyDaoObj || !biconomyWalletClient || !scwAddress)) {
			initiateBiconomy()
				.then(res => console.log(res))
				.catch(error => console.log(error))
		}
	}, [webwallet, nonce, biconomyDaoObj, biconomyWalletClient, scwAddress])


	const initiateBiconomy = async() => {
		if(!webwallet || !network) {
			return
		}

		console.log(webwallet, nonce, biconomyDaoObj)

		console.log('CREATING BICONOMY OBJ', network.toString())
		let _biconomy: any

		jsonRpcProviders[network.toString()].getBalance("0x9C910261B77bEeaa84289D098EbD309Ec748E9EF")
		.then(res => console.log("quertt", network.toString(), res));
		if(!biconomyDaoObj) {
			_biconomy = new Biconomy(jsonRpcProviders[network.toString()],
				{
					apiKey: data.apiKey,
					debug: true
				})
		} else {
			_biconomy = biconomyDaoObj
		}


		console.log('BICONOMY OBJ CREATED', _biconomy)
		_biconomy.onEvent(_biconomy.READY, async() => {
			console.log('Inside biconomy ready event')

			const _biconomyWalletClient: BiconomyWalletClient = _biconomy.biconomyWalletClient
			console.log('biconomyWalletClient', _biconomyWalletClient)

			if(!scwAddress) {
				const walletAddress = await deploySCW(webwallet, _biconomyWalletClient)
				setScwAddress(walletAddress)
			} else {
				console.log('SCW Wallet already exists at Address', scwAddress)
			}

			if(!biconomyWalletClient) {
				setBiconomyWalletClient(_biconomyWalletClient)
			}
		}).onEvent(_biconomy.ERROR, (error: any, message: any) => {
			console.log(message)
			console.log(error)
		})

		if(!biconomyDaoObj) {
			setBiconomyDaoObj(_biconomy)
		}

	}

	return {
		biconomyDaoObj: biconomyDaoObj,
		biconomyWalletClient: biconomyWalletClient,
		scwAddress: scwAddress
	}
}