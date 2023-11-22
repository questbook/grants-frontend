/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { logger } from 'ethers'
import TonWeb from 'tonweb'

export default function usetonWallet() {
	const [tonWalletAvailable, setTonWalletAvailable] = useState(false)
	const [tonWallet, setTonWallet] = useState<any>()
	const [tonWalletConnected, setTonWalletConnected] = useState(false)
	const [tonWalletAddress, setTonWalletAddress] = useState<string>('')

	/*
		const checkTonAvailability = () => {
		  const isBrowser = typeof window !== 'undefined'
		  logger.info(
				'ton wallet is loading',
				isBrowser && 'ton' in window ? 'available' : 'not available'
		  )

		  if(isBrowser && 'ton' in window) {
				setTonWallet(window.ton)
				setTonWalletAvailable(true)
				logger.info('ton wallet is available')
		  } else {
				setTonWalletAvailable(false)
				logger.info('ton wallet not available')
		  }
		}

		const handleTonChange = () => {
		  checkTonAvailability()
		}

		// Function to listen for changes in TON availability
		const listenToTonChanges = () => {
		  // Check initially
		  checkTonAvailability()

		  // Listen for 'tonChange' event
		  window.addEventListener('tonChange', handleTonChange)
		}

		// Check TON availability after a delay to account for asynchronous loading
		const checkAfterDelay = () => {
		  setTimeout(listenToTonChanges, 1000) // Adjust the delay time as needed
		}

		// Run the check after a delay to allow for potential asynchronous loading
		checkAfterDelay()

		// Cleanup: Remove the event listener when component unmounts
		return () => {
		  window.removeEventListener('tonChange', handleTonChange)
		}
	*/
	useEffect(() => {
		let isMounted = false
		const checkTonAvailability = () => {
		  const isBrowser = typeof window !== 'undefined'
		  logger.info(
				'ton wallet is loading',
				isBrowser && 'ton' in window ? 'available' : 'not available'
		  )

		  if('ton' in window) {
				setTonWallet(window.ton)
				setTonWalletAvailable(true)
				isMounted = true
				logger.info('ton wallet is available')
		  } else {
				setTonWalletAvailable(false)
				logger.info('ton wallet not available')
		  }
		}

		// Function to check TON availability after a delay
		const checkTonAfterDelay = () => {
		  !isMounted && setTimeout(checkTonAvailability, 1000)
		}

		// Run the initial check after a delay
	   checkTonAvailability()

		// Event listener for changes in the window object
		const handleWindowChange = () => {
		  checkTonAfterDelay() // Check again if there's a change in window object
		}

		// Listen for window changes (if the user disables the provider and then enables it again, TON might change)
		window.addEventListener('tonChange', handleWindowChange)

		// Cleanup: Remove the event listener when the component unmounts
		return () => {
		  window.removeEventListener('tonChange', handleWindowChange)
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
		setTonWallet,
		setTonWalletAvailable,
		tonWalletAvailable,
		tonWallet,
		tonWalletConnected,
		tonWalletAddress,
		setTonWalletConnected,
		connectTonWallet
	}
}