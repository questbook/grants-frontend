import { createContext, ReactNode, useContext, useState } from 'react'
import { EthereumMainnet } from '@questbook/supported-safes/lib/chains/ethereum-mainnet'
import { SolanaMainnet } from '@questbook/supported-safes/lib/chains/solana-mainnet'

export const SafeContext = createContext<{safeObj: EthereumMainnet | SolanaMainnet | undefined, setSafeObj: (safe: EthereumMainnet | SolanaMainnet | undefined) => void} | null>(null)

export const useSafeContext = () => useContext(SafeContext)

export const SafeProvider = ({ children }: {children: ReactNode}) => {
	const [safeObj, setSafeObj] = useState<EthereumMainnet | SolanaMainnet>()

	return (
		<SafeContext.Provider value={{ safeObj, setSafeObj }}>
			    {children}
		</SafeContext.Provider>
	)
}