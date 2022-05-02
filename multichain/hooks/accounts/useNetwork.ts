import { Chain, SwitchChainError, allChains } from 'wagmi-core'

import { useNetwork as useNetworkWagmi } from "wagmi";
import { useConnection as useConnectionSolana, useWallet as useWalletSolana } from "@solana/wallet-adapter-react";
import { CHAIN_ID } from "../../constants";
import { useContext } from '../../context'
import { useCallback } from 'react';

type State = {
    data: {
        chain?: {
            id: number
        }
    },
    error: Error,
    loading: boolean
}

export const useNetwork = () => {
    const [{ data: wagmiNetworkData, error: wagmiError, loading: wagmiLoading }, switchNetworkWagmi] = useNetworkWagmi();
    const { connection: solanaConnection } = useConnectionSolana();
    const solanaInfo = useWalletSolana()

    const context = useContext()

    const switchNetwork = useCallback(async (chainId: number) => {
        // @TODO: add solana network switcher (does such thing exist?).
        // if (chainId === CHAIN_ID['SOLANA']){
        //     try {
        //         if (disconnectWagmi) disconnectWagmi()
        //         if (solanaInfo.disconnect) await solanaInfo.disconnect()
        //     }
        //     catch { }
        //     try{
        //         solanaInfo.select()
                
        //         // await solanaInfo.connect()
        //         await walletConnector.connect()
        //     }
        //     catch (e){
        //         console.log(e)
        //     }
        // }
        if (wagmiNetworkData.chain?.id && switchNetworkWagmi){
            switchNetworkWagmi(chainId)
        }
    }, [wagmiNetworkData.chain, switchNetworkWagmi])

    return [
        {
            data: {
                chain: wagmiNetworkData.chain?.id ? {
                    id: wagmiNetworkData.chain?.id
                } : (solanaInfo.connected ? {
                    id: CHAIN_ID['SOLANA']
                } : undefined),
        },
        // TODO: add solana network network error. 
        error: wagmiError,
        loading: wagmiLoading || solanaInfo.connecting || solanaInfo.disconnecting,
        } as State,
    // TODO: add solana network switcher (does such thing exist?). 
    switchNetworkWagmi
    ] as const
};
