import * as React from 'react'

import { SolanaWalletAdapter, WalletConnector, WagmiConnector } from '../../types'

import { useWallet as useWalletSolana } from '@solana/wallet-adapter-react';
import { useConnect as useConnectWagmi } from 'wagmi';

import { useAccount as useAccountWagmi } from "wagmi";
import { useContext } from '../../context'


type State = {
    connector?: WalletConnector
    error?: Error
    loading: boolean
}

const initialState: State = {
    loading: false,
}

export const useConnect = () => {
    const [wagmiInfo, connectWagmi] = useConnectWagmi();
    const [, disconnectWagmi] = useAccountWagmi();
    const solanaInfo = useWalletSolana();
    const context = useContext()

    const connect = React.useCallback(
        async (walletConnector: WalletConnector) => {
            // Disconnecting both Wagmi and Solana
            try {
                if (disconnectWagmi) disconnectWagmi()
                if (solanaInfo.disconnect) await solanaInfo.disconnect()
            }
            catch { }

            if (walletConnector instanceof SolanaWalletAdapter) {
                // For some reason, this doesn't work from the first time
                try{
                    solanaInfo.select(walletConnector.name)
                    
                    // await solanaInfo.connect()
                    await walletConnector.connect()
                }
                catch (e){
                    console.log(e)
                }
            }
            else if (walletConnector instanceof WagmiConnector){
                await connectWagmi(walletConnector);
            }
            else{
                // add all other chains.
            }
        }, [solanaInfo.disconnect, disconnectWagmi, connectWagmi, solanaInfo.select]);

    return [
        {
            data: {
                connected: wagmiInfo.data.connected || solanaInfo.connected,
                connector: wagmiInfo.data.connected ? wagmiInfo.data.connector : (solanaInfo.connected ? solanaInfo.wallet?.adapter : undefined),
                connectors: [...wagmiInfo.data.connectors, ...solanaInfo.wallets.map(x => x.adapter as SolanaWalletAdapter)] as WalletConnector[]
            },
            error: wagmiInfo.error,
            loading: wagmiInfo.loading || solanaInfo.connecting || solanaInfo.disconnecting,
        },
        connect,
    ] as const
}
