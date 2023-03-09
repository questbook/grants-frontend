import { useEffect, useState } from 'react'
import { PhantomProvider, WindowWithSolana } from 'src/types'

export default function usePhantomWallet() {
	const [ phantomWalletAvailable, setPhantomWalletAvailable ] = useState(false)
	const [phantomWallet, setPhantomWallet] = useState<PhantomProvider>()
	const [phantomWalletConnected, setPhantomWalletConnected] = useState(false)

	useEffect(() => {
		if('solana' in window) {
			const solWindow = window as WindowWithSolana
			if(solWindow?.solana?.isPhantom) {
				setPhantomWallet(solWindow.solana)
				setPhantomWalletAvailable(true)
			}
		}
	}, [])

	useEffect(() => {
		phantomWallet?.on('connect', () => {
			// console.log('phantom wallet connected ')
			setPhantomWalletConnected(true)
		})
		phantomWallet?.on('disconnect', () => {
			// console.log('phantom wallet disconnected')
			setPhantomWalletConnected(false)
		})

	}, [phantomWallet?.isConnected])

	return {
		phantomWalletAvailable,
		phantomWallet,
		phantomWalletConnected,
		setPhantomWalletConnected }
}