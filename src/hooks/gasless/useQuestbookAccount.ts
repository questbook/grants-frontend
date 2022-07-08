import {useState, useEffect, useContext} from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useNonce } from 'src/hooks/gasless/useNonce';
import { ApiClientsContext, WebwalletContext, GitHubTokenContext, ScwAddressContext } from '../../../pages/_app';

export const useQuestbookAccount = () => {
    const { webwallet, setWebwallet } = useContext(WebwalletContext)!
    const { scwAddress, setScwAddress } = useContext(ScwAddressContext)!
    const [gaslessData, setGaslessData] = useState<any>();
    const { data: accountData } = useAccount();
    const nonce = useNonce();
	const { data: connectData, isConnecting, isConnected, isReconnecting, isError, connect, connectors } = useConnect()

    useEffect(() => {
        // console.log("HYY", nonce, webwallet, scwAddress);
        if(nonce && webwallet && scwAddress && !gaslessData){
            setGaslessData({
                address: scwAddress,
                connector: {
                    name: 'gasless-webwallet'
                }
            })
        }
        // else if((!isConnecting || !isReconnecting) && connectData && isConnected){
        //     setGaslessData(accountData);
        // }
    }, [nonce, webwallet, scwAddress, gaslessData])

    return { data: gaslessData, nonce: nonce };
}