import { WebwalletContext, GitHubTokenContext } from '../../../pages/_app'
import { useEffect, useState, useContext } from "react";

export const useGitHubLogin = () => {
    const { webwallet, setWebwallet } = useContext(WebwalletContext)!
    const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext)!

    const [nonce, setNonce] = useState<string>();
    
    const getUseNonce = async () => {
        let nonce = await getNonce(webwallet);
        return nonce;
    }

    useEffect(() => {
        if (webwallet) {
            getUseNonce()
            .then(nonce => {
                if (!nonce){
                    setNonce("");
                    setIsLoggedIn(false);
                }
                else {
                    setIsLoggedIn(true);
                    setNonce(nonce);
                }
            })
        }
    }, [webwallet]);

    return nonce;
}