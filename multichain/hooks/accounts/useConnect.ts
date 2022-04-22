import * as React from 'react'

import { SolanaWalletAdapter, WalletConnector } from '../../types'

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
    const [wagmiInfo] = useConnectWagmi();
    const [accountState, disconnectWagmi] = useAccountWagmi();
    const solanaInfo = useWalletSolana();

    const [state, setState] = React.useState<State>(initialState)

    const connect = React.useCallback(
        async (walletConnector: WalletConnector) => {
            // Disconnecting both Wagmi and Solana

            disconnectWagmi()
            await solanaInfo.disconnect()

            // Connecting the wallet connector.
            walletConnector?.connect()
        }, [solanaInfo, wagmiInfo.data]);

    React.useEffect(() => {
    }, [wagmiInfo.data.connected, solanaInfo.connected])

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
