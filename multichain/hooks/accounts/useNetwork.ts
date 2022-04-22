
import { useNetwork as useNetworkWagmi } from "wagmi";
import { useConnection as useConnectionSolana, useWallet as useWalletSolana } from "@solana/wallet-adapter-react";
import { CHAIN_ID } from "../../constants";
import { useContext } from '../../context'

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

    return [
        {
            data: {
                chain: wagmiNetworkData.chain?.id ? {
                    id: wagmiNetworkData.chain?.id
                } : (solanaConnection?.rpcEndpoint ? {
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
