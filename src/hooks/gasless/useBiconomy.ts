import { useContext, useEffect, useState } from 'react'
import { Biconomy } from '@biconomy/mexa'
import { BiconomyWalletClient } from 'src/types/gasless'
import { deploySCW, jsonRpcProvider } from 'src/utils/gaslessUtils'
import { GitHubTokenContext, ScwAddressContext, WebwalletContext } from '../../../pages/_app'

export const useBiconomy = (data: any) => {
	const { webwallet, setWebwallet } = useContext(WebwalletContext)!
	const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext)!
	const { scwAddress, setScwAddress } = useContext(ScwAddressContext)!
	const [biconomy, setBiconomy] = useState<any>()
	const [biconomyWalletClient, setBiconomyWalletClient] = useState<BiconomyWalletClient>()

	useEffect(() => {
		if(isLoggedIn && webwallet && !biconomy) {
			initiateBiconomy()
				.then(res => console.log(res))
				.catch(error => console.log(error))
		}
	}, [webwallet, isLoggedIn, biconomy])


	const initiateBiconomy = async() => {
		console.log(webwallet, isLoggedIn, biconomy)
		if(webwallet && isLoggedIn && !biconomy) {

			console.log('CREATING BICONOMY OBJ')
			const _biconomy = new Biconomy(jsonRpcProvider,
				{
					apiKey: data.apiKey,
					debug: true
				})

			console.log('BICONOMY OBJ CREATED')
			_biconomy.onEvent(_biconomy.READY, async() => {
				console.log('Inside biconomy ready event')

				// @TODO: here should change the contract

				const _biconomyWalletClient = _biconomy.biconomyWalletClient
				console.log('biconomyWalletClient', _biconomyWalletClient)

				if(!scwAddress) {
					const walletAddress = await deploySCW(webwallet, _biconomyWalletClient)
					setScwAddress(walletAddress)
				} else {
					console.log('SCW Wallet already exists at Address', scwAddress)
				}

				setBiconomyWalletClient(_biconomyWalletClient)

			}).onEvent(_biconomy.ERROR, (error: any, message: any) => {
				console.log(message)
				console.log(error)
			})

			setBiconomy(_biconomy)
			console.log('DONE HERE')
		}
	}


	return [
		biconomy,
		biconomyWalletClient,
		scwAddress
	]
}