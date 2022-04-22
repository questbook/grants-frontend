
import { useSigner as useSignerWagmi } from "wagmi"
import { Connection as SolanaConnection } from '@solana/web3.js';
import { useConnection as useConnectionSolana, useWallet as useWalletSolana } from "@solana/wallet-adapter-react";
import React from "react";
import { Address, ContractProvider, SolanaProgramProvider, SolanaProgramWallet } from "../../types";
import { useContext } from '../../context'

type State = {
    data?: {
        provider: ContractProvider,
        getAddress: () => (Promise<Address> | Address)
    }
    error?: Error
    loading?: boolean
}

const getConnectionProvider = (wallet: SolanaProgramWallet, network: string) => {
    if (!wallet) return null
    const context = useContext()
    // TODO: add advanced configuration for the connection/provider (or maybe add them as an argument?).
    const commitment = 'processed'

    const connection = new SolanaConnection(
        network,
        commitment
    );
    const provider = new SolanaProgramProvider(
        connection,
        wallet,
        { commitment: commitment }
    );
    return provider;
};

export const useSigner = () => {
    const [wamgiSignerState, getSignerWagmi] = useSignerWagmi()
    const solanaInfo = useWalletSolana();
    const solanaConnection = useConnectionSolana()

    const state = React.useMemo(() => {
        if (wamgiSignerState && wamgiSignerState.data)
            return {
                data: {
                    provider: wamgiSignerState.data,
                    getAddress: wamgiSignerState.data.getAddress
                },
                error: wamgiSignerState.error,
                loading: wamgiSignerState.loading
            } as State

        if (solanaInfo.connected)
            return {
                data: {
                    provider: getConnectionProvider(solanaInfo as SolanaProgramWallet, solanaConnection.connection.rpcEndpoint),
                    getAddress: () => solanaInfo.wallet?.adapter.publicKey
                },
                loading: solanaInfo.connecting || solanaInfo.disconnecting
            } as State

        return {
            data: undefined,
            loading: false
        } as State
    }, [wamgiSignerState, solanaInfo, solanaConnection.connection.rpcEndpoint])

    const getSigner = React.useCallback(() => {
        if (wamgiSignerState)
            getSignerWagmi();

        // TODO: change this to get the Solana signer (if it exists). This 
        // was not implemented yet because it's not needed in grants frontend.
        return
    }, [wamgiSignerState, getSignerWagmi, solanaInfo])

    return [state, getSigner] as const
}
