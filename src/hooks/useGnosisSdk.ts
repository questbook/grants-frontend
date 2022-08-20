import { useState } from 'react'
import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { ethers } from 'ethers'

export function useGnosisSDK(safeAddress: string) {
	const [safeSDK, setSafeSDK] = useState()
	const [safeService, setSafeService] = useState()

	async function initializeGnosisSdk(safeAddress: string) {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send('eth_requestAccounts', [])

		const signer = provider.getSigner()
		const ethAdapter = new EthersAdapter({
			ethers,
			signer,
		})

		const txServiceUrl = 'https://safe-transaction.rinkeby.gnosis.io/'
		const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
		//@ts-ignore
		setSafeService(safeService)
		const safeFactory = await SafeFactory.create({ ethAdapter })
		const safeSdk = await Safe.create({ ethAdapter, safeAddress })
		//@ts-ignore
		setSafeSDK(safeSdk)
	}

	initializeGnosisSdk(safeAddress)

	return [safeSDK, safeService]
}

