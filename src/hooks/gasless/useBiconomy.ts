import { WebwalletContext, GitHubTokenContext, ScwAddressContext } from '../../../pages/_app'
import { useEffect, useState, useContext } from "react";
import { ethers, Contract } from 'ethers';
import { BiconomyWalletClient } from 'src/types/gasless';
import { Biconomy } from '@biconomy/mexa';
import { deploySCW, registerWebHook, sendGaslessTransaction, jsonRpcProvider } from 'src/utils/gaslessUtils';

export const useBiconomy = (data: any) => {
    const { webwallet, setWebwallet } = useContext(WebwalletContext)!
    const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext)!
	const { scwAddress, setScwAddress } = useContext(ScwAddressContext)!
    const [biconomy, setBiconomy] = useState<any>();
    const [biconomyWalletClient, setBiconomyWalletClient] = useState<BiconomyWalletClient>();

    useEffect(() => {
        if (isLoggedIn && webwallet && !biconomy) {
			initiateBiconomy()
				.then(res => console.log(res))
				.catch(error => console.log(error));
		}
    }, [webwallet, isLoggedIn, biconomy])


	const initiateBiconomy = async () => {
		console.log(webwallet, isLoggedIn, biconomy);
		if (webwallet && isLoggedIn && !biconomy) {

			console.log("CREATING BICONOMY OBJ")
			let _biconomy = new Biconomy(jsonRpcProvider,
				{
					apiKey: data.apiKey,
					debug: true
				});

			console.log("BICONOMY OBJ CREATED")
			_biconomy.onEvent(_biconomy.READY, async () => {
				console.log('Inside biconomy ready event');

				// @TODO: here should change the contract

				let _biconomyWalletClient = _biconomy.biconomyWalletClient;
				console.log("biconomyWalletClient", _biconomyWalletClient);

				if(!scwAddress){
					let walletAddress = await deploySCW(webwallet, _biconomyWalletClient);
					setScwAddress(walletAddress);
				}
				else{
					console.log("SCW Wallet already exists at Address", scwAddress);
				}

                setBiconomyWalletClient(_biconomyWalletClient);

			}).onEvent(_biconomy.ERROR, (error: any, message: any) => {
				console.log(message);
				console.log(error);
			});

			setBiconomy(_biconomy);
			console.log("DONE HERE")
		}
	};


    return [
        biconomy,
        biconomyWalletClient,
        scwAddress
    ];
}