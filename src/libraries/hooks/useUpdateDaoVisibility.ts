import { useCallback, useContext } from 'react'
import { Contract } from 'ethers'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { useQuestbookAccount } from 'src/libraries/hooks/gasless/useQuestbookAccount'
import useQBContract from 'src/libraries/hooks/useQBContract'
import logger from 'src/libraries/logger'
import { bicoDapps, getTransactionDetails, sendGaslessTransaction } from 'src/libraries/utils/gasless'
import { uploadToIPFS } from 'src/libraries/utils/ipfs'
import { ApiClientsContext, BiconomyContext, WebwalletContext } from 'src/pages/_app'

export default function useUpdateDaoVisibility() {
	const { nonce } = useQuestbookAccount()

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const workspaceContractGoerli = useQBContract('workspace', SupportedChainId.GOERLI_TESTNET)
	const workspaceContractPolygon = useQBContract('workspace', SupportedChainId.POLYGON_MAINNET)
	const workspaceContractOptimism = useQBContract('workspace', SupportedChainId.OPTIMISM_MAINNET)
	const workspaceContractCelo = useQBContract('workspace', SupportedChainId.CELO_MAINNET)

	const contractsMap: { [C in SupportedChainId]: Contract } = {
		[SupportedChainId.GOERLI_TESTNET]: workspaceContractGoerli,
		[SupportedChainId.CELO_MAINNET]: workspaceContractCelo,
		[SupportedChainId.OPTIMISM_MAINNET]: workspaceContractOptimism,
		[SupportedChainId.POLYGON_MAINNET]: workspaceContractPolygon,
	}

	const { webwallet, scwAddress } = useContext(WebwalletContext)!

	const { initiateBiconomy, biconomyWalletClients: initialBiconomyWalletClients } = useContext(BiconomyContext)!

	const updateDaoVisibility = useCallback(
		async(
			data: { [_: number]: { [_: string]: boolean } },
			setCurrentStep?: (step: number | undefined) => void
		) => {

			let currentStep = -1
			const incrementStep = () => {
				currentStep++
				setCurrentStep?.(currentStep)
			}

			if(!scwAddress) {
				return undefined!
			}

			const chains = Object.keys(data)

			let chainIdx
			for(chainIdx = 0; chainIdx < chains.length; chainIdx ++) {
				const chain = chains[chainIdx]
				const chainId = +chain

				const workspaceContract = contractsMap[chain as unknown as SupportedChainId]
				if(!workspaceContract) {
					continue
				}

				incrementStep()
				const initBiconomyRes = await initiateBiconomy(chain)

				if(!initBiconomyRes) {
					continue
				}

				const { biconomyWalletClient, biconomyDaoObj: biconomy } = initBiconomyRes

				const workspaceIds: string[] = []
				const isVisible: boolean[] = []

				const chainData = data[chainId]

				const keys = Object.keys(chainData)

				keys.forEach((key) => {
					workspaceIds.push(key)
					isVisible.push(chainData[key])
				})

				incrementStep()

				const response = await sendGaslessTransaction(
					biconomy,
					workspaceContract,
					'updateWorkspacesVisible',
					[workspaceIds, isVisible],
					WORKSPACE_REGISTRY_ADDRESS[chain as unknown as SupportedChainId],
					biconomyWalletClient,
					scwAddress,
					webwallet,
					chain,
					bicoDapps[chain].webHookId,
					nonce
				)

				incrementStep()

				if(response) {
					const { receipt } = await getTransactionDetails(response, chainId.toString())
					incrementStep()

					await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)
					incrementStep()

					// not charging qb admins when making dao visibility changes
					// if(workspace) {
					// 	await chargeGas(Number(workspace?.id), Number(txFee), getSupportedChainIdFromWorkspace(workspace))
					// }
				}
			}

			incrementStep()
		},
		[workspace?.id, workspaceContractGoerli, workspaceContractPolygon, workspaceContractCelo, workspaceContractOptimism, initialBiconomyWalletClients, scwAddress, nonce, webwallet]
	)

	const updateSection = async(data: { [_: number]: string[] }, sectionName: string, imageFile: {file: File | null, hash?: string}, setCurrentStep?: (step: number) => void) => {
		// update section

		// let currentStep = -1
		// const incrementStep = () => {
		// 	currentStep++
		// 	setCurrentStep?.(currentStep)
		// }

		if(!scwAddress) {
			return undefined!
		}

		const chains = Object.keys(data)

		let chainIdx
		for(chainIdx = 0; chainIdx < chains.length; chainIdx ++) {
			const chain = chains[chainIdx]
			const chainId = +chain

			const workspaceContract = contractsMap[chain as unknown as SupportedChainId]
			if(!workspaceContract) {
				continue
			}

			// incrementStep()
			setCurrentStep?.(0)
			const initBiconomyRes = await initiateBiconomy(chain)

			if(!initBiconomyRes) {
				continue
			}

			const { biconomyWalletClient, biconomyDaoObj: biconomy } = initBiconomyRes

			// const grantIds: string[] = []

			const grantIds = data[chainId]
			const logoIpfsHash = imageFile !== null ? (await uploadToIPFS(imageFile.file)).hash : ''
			logger.info('update section', data, sectionName, grantIds)
			// incrementStep()
			setCurrentStep?.(1)

			logger.info('update section',
				{ biconomy,
					workspaceContract,
					method: 'updateGrantsSection',
					methodArgs: [grantIds, sectionName, logoIpfsHash],
					address: WORKSPACE_REGISTRY_ADDRESS[chain as unknown as SupportedChainId],
					biconomyWalletClient,
					scwAddress,
					webwallet,
					chain,
					webhookId: bicoDapps[chain].webHookId,
					nonce }
			)
			const response = await sendGaslessTransaction(
				biconomy,
				workspaceContract,
				'updateGrantsSection',
				[grantIds, sectionName, logoIpfsHash],
				WORKSPACE_REGISTRY_ADDRESS[chain as unknown as SupportedChainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				chain,
				bicoDapps[chain].webHookId,
				nonce
			)
			logger.info('update section response', response)
			// incrementStep()
			setCurrentStep?.(2)

			if(response) {
				const { receipt } = await getTransactionDetails(response, chainId.toString())
				// incrementStep()

				await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)
				// incrementStep()
				setCurrentStep?.(3)

				// not charging qb admins when making dao visibility changes
				// if(workspace) {
				// 	await chargeGas(Number(workspace?.id), Number(txFee), getSupportedChainIdFromWorkspace(workspace))
				// }
			}
		}


	}

	return {
		isBiconomyInitialised: initialBiconomyWalletClients?.[defaultChainId],
		updateDaoVisibility,
		updateSection,
	}
}
