import { WebwalletContext, GitHubTokenContext, NonceContext } from '../../../pages/_app'
import { useEffect, useState, useContext } from "react";
import { getNonce } from '../../utils/gaslessUtils';
import { Wallet } from 'ethers';

export const useNonce = () => {
    const { webwallet, setWebwallet } = useContext(WebwalletContext)!
    const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext)!
    const { nonce, setNonce } = useContext(NonceContext)!
    
    const getUseNonce = async () => {
        let nonce = await getNonce(webwallet);
        return nonce;
    }

    useEffect(() => {
        // console.log("isLoggedIn or webwallet changed", webwallet, isLoggedIn)
		if (!webwallet) {
			setWebwallet(Wallet.createRandom());
		}

		if (!isLoggedIn && webwallet) {
            console.log("TTTTTTTTTTTTT");
			window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`;
		}
	}, [isLoggedIn, webwallet]);

    useEffect(() => {
        // console.log("What is going on here?????", webwallet, nonce);
        if (webwallet && (!nonce || nonce === "Token expired")) {
            // console.log("NOW GOT HERE")
            getUseNonce()
            .then(_nonce => {
                // console.log("THIS IS NONCE", _nonce, isLoggedIn);
                if (!_nonce){
                    setNonce("");
                    setIsLoggedIn(false);
                }
                else {
                    if(!isLoggedIn)
                        setIsLoggedIn(true);
                    setNonce(_nonce);
                }
            })
        }
    }, [webwallet]);

    return nonce;
}