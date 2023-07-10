import { createContext, ReactNode, useContext, useState } from 'react'
import { EthereumMainnet } from '@questbook/supported-safes/lib/chains/ethereum-mainnet'
import { SolanaMainnet } from '@questbook/supported-safes/lib/chains/solana-mainnet'
import { TonKeyMainnet } from '@questbook/supported-safes/lib/chains/tonkey-mainnet'
export const SafeContext = createContext<{safeObj: EthereumMainnet | SolanaMainnet | TonKeyMainnet| undefined, setSafeObj: (safe: EthereumMainnet | SolanaMainnet | TonKeyMainnet | undefined) => void} | null>(null)

export const useSafeContext = () => useContext(SafeContext)

export const SafeProvider = ({ children }: {children: ReactNode}) => {
	const [safeObj, setSafeObj] = useState<EthereumMainnet | SolanaMainnet>()
	return (
		<SafeContext.Provider value={{ safeObj, setSafeObj }}>
			    {children}
		</SafeContext.Provider>
	)
}