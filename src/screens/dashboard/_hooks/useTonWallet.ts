/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { logger } from 'ethers'
import TonWeb from 'tonweb'

export default function usetonWallet() {
	const [tonWalletAvailable, setTonWalletAvailable] = useState(false)
	const [tonWallet, setTonWallet] = useState<any>()
	const [tonWalletConnected, setTonWalletConnected] = useState(false)
	const [tonWalletAddress, setTonWalletAddress] = useState<string>('')

	useEffect(() => {
		if(typeof window !== 'undefined') {
			if('ton' in window) {
				setTonWallet(window.ton)
				setTonWalletAvailable(true)
				logger.info('ton wallet is available')
			} else {
				setTonWalletAvailable(false)
				logger.info('ton wallet not available')
			}
		}
	}, [])

	const connectTonWallet = async(): Promise<boolean> => {
		if(!tonWalletAvailable) {
			return false
		}

		const accounts = await tonWallet.send('ton_requestAccounts')
		if(accounts.length === 0) {
			return false
		}

		const account = accounts[0]
		logger.info('tonWalletAddress', account)
		const userRawAddress = new TonWeb.Address(account).toString(false)
		setTonWalletAddress(userRawAddress)
		setTonWalletConnected(true)
		return true
	}

	return {
		tonWalletAvailable,
		tonWallet,
		tonWalletConnected,
		tonWalletAddress,
		setTonWalletConnected,
		connectTonWallet
	}
}