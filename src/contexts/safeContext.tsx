import { createContext, ReactNode, useContext, useState } from 'react'
import { EthereumMainnet } from '@questbook/supported-safes/lib/chains/ethereum-mainnet'
import { SolanaMainnet } from '@questbook/supported-safes/lib/chains/solana-mainnet'
import { TonKeyTestnet } from '@questbook/supported-safes/lib/chains/tonkey-testnet'
export const SafeContext = createContext<{safeObj: EthereumMainnet | SolanaMainnet | TonKeyTestnet| undefined, setSafeObj: (safe: EthereumMainnet | SolanaMainnet | TonKeyTestnet | undefined) => void} | null>(null)

export const useSafeContext = () => useContext(SafeContext)

export const SafeProvider = ({ children }: {children: ReactNode}) => {
	const [safeObj, setSafeObj] = useState<EthereumMainnet | SolanaMainnet>()
	return (
		<SafeContext.Provider value={{ safeObj, setSafeObj }}>
			    {children}
		</SafeContext.Provider>
	)
}