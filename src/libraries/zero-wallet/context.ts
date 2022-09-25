import { createContext } from 'react'
import { Wallet } from 'ethers'
import SupportedChainId from 'src/generated/SupportedChainId'
export const WebwalletContext = createContext<{
	webwallet?: Wallet
	setWebwallet: (webwallet?: Wallet) => void

	network?: SupportedChainId
	switchNetwork: (newNetwork?: SupportedChainId) => void
	scwAddress?: string
	setScwAddress: (scwAddress?: string) => void

	waitForScwAddress: Promise<string>

	nonce?: string
	setNonce: (nonce?: string) => void
	loadingNonce: boolean
	setLoadingNonce: (loadingNonce: boolean) => void
		} | null>(null)