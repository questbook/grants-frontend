
import * as React from 'react'
import {
    InjectedConnector,
    Provider as WagmiProvider,
    WagmiProviderProps,

} from 'wagmi'
import {
    useLocalStorage,
    WalletProvider as SolanaWalletProvider,
    ConnectionProvider as SolanaConnectionProvider,
    ConnectionProviderProps as SolanaConnectionProviderProps
} from '@solana/wallet-adapter-react';

import { WalletConnector, SolanaWalletAdapter, WagmiConnector } from './types'

type State = {
    connecting?: boolean
    walletConnector?: WalletConnector
}

type ContextValue = {
    state: {
        walletConnectors: WalletConnector[]
    }
    setState: React.Dispatch<React.SetStateAction<State>>
    setLastUsedWalletConnector: (newValue: string | null) => void
}

export const Context = React.createContext<ContextValue | null>(null)

export type Props = {
    /** Enables reconnecting to last used connector on mount */
    autoConnect?: boolean
    /** For Solana Connection provider */
    solanaEndpoint: SolanaConnectionProviderProps['endpoint']
    /**
     * Connectors used for linking accounts
     * @default [new InjectedConnector()]
     */
    walletConnectors?: WalletConnector[]
    /**
     * Interface for connecting to network
     */
    wagmiProvider?: WagmiProviderProps['provider']
    /**
    * Key for saving connector preference to browser
    * @default 'multichain.walletconnector'
   */
    connectorStorageKey?: string
}

export const Provider: React.FC<React.PropsWithChildren<Props>> = ({
    autoConnect = false,
    children,
    solanaEndpoint,
    connectorStorageKey = 'multichain.walletconnector',
    walletConnectors: walletConnectors_ = [new InjectedConnector()],
    wagmiProvider: wagmiProvider_ = null
}) => {
    const [lastUsedConnector, setLastUsedWalletConnector] = useLocalStorage<
        string | null
    >(connectorStorageKey, '')


    const [state, setState] = React.useState<State>({
        connecting: autoConnect,
    })

    const wagmiConnectors: WagmiConnector[] = React.useMemo(() => {
        return walletConnectors_.filter(walletConnector => (walletConnector instanceof WagmiConnector)) as WagmiConnector[]
    }, [walletConnectors_]);

    const solanaWalletAdapters: SolanaWalletAdapter[] = React.useMemo(() => {
        return walletConnectors_.filter(walletConnector => (walletConnector instanceof SolanaWalletAdapter)) as SolanaWalletAdapter[]
    }, [walletConnectors_]);

    const value = {
        state: {
            walletConnectors: walletConnectors_
        },
        setState,
        setLastUsedWalletConnector
    }

    return (
        // <Context.Provider value={value}>
        <SolanaConnectionProvider endpoint={solanaEndpoint} >
            <SolanaWalletProvider wallets={solanaWalletAdapters}>
                {wagmiProvider_ ?
                    <WagmiProvider connectors={wagmiConnectors} provider={wagmiProvider_} >
                        {children}
                    </WagmiProvider> :
                    <WagmiProvider connectors={wagmiConnectors}>
                        {children}
                    </WagmiProvider>
                }
            </SolanaWalletProvider>
        </SolanaConnectionProvider>
        // </Context.Provider>
    );
}

export const useContext = () => {
    const context = React.useContext(Context)
    // if (!context) throw Error('Must be used within Provider')
    return context
}
