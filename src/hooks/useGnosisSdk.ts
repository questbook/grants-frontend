import { useEffect, useState } from 'react'
import Safe, { SafeConfig, SafeFactory } from '@gnosis.pm/safe-core-sdk'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient, { SafeServiceClientConfig } from '@gnosis.pm/safe-service-client'
import { ethers } from 'ethers'

export function useGnosisSDK(safeAddress: string) {
	const [safeSDK, setSafeSDK] = useState<SafeConfig>()
	const [safeService, setSafeService] = useState<SafeServiceClientConfig>()

	async function initializeGnosisSdk(safeAddress: string) {
		//@ts-ignore
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send('eth_requestAccounts', [])

		const signer = provider.getSigner()
		const ethAdapter = new EthersAdapter({
			ethers,
			signer,
		})

		const txServiceUrl = 'https://safe-transaction.rinkeby.gnosis.io/'
		const _safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
		console.log('Safe service', _safeService)
		//@ts-ignore
		setSafeService(_safeService)
		const safeFactory = await SafeFactory.create({ ethAdapter })
		const safeSdk = await Safe.create({ ethAdapter, safeAddress })
		//@ts-ignore
		setSafeSDK(safeSdk)
		console.log('safe sdk', safeSdk)
	}

	useEffect(() => {
		initializeGnosisSdk(safeAddress)
	}, [safeAddress])


	return [safeSDK, safeService]
}

