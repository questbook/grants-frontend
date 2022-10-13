import { useCallback, useContext } from 'react'
import { Contract } from 'ethers'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { ApiClientsContext, BiconomyContext, WebwalletContext } from 'src/pages/_app'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'

export default function useUpdateDaoVisibility() {
	const { nonce } = useQuestbookAccount()

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const workspaceContractGoerli = useQBContract('workspace', SupportedChainId.GOERLI_TESTNET)
	const workspaceContractPolygon = useQBContract('workspace', SupportedChainId.POLYGON_MAINNET)
	const workspaceContractOptimism = useQBContract('workspace', SupportedChainId.OPTIMISM_MAINNET)
	const workspaceContractCelo = useQBContract('workspace', SupportedChainId.CELO_MAINNET)

	const { webwallet, scwAddress } = useContext(WebwalletContext)!

	const { initiateBiconomy, biconomyWalletClients: initialBiconomyWalletClients } = useContext(BiconomyContext)!

	const updateDaoVisibility = useCallback(
		async(
			data: { [_: number]: { [_: string]: boolean } },
			stepsLength: number,
			setCurrentStep?: (step: number | undefined) => void
		) => {
			if(!scwAddress) {
				return undefined!
			}

			const chains = Object.keys(data)

			let chainIdx
			for(chainIdx = 0; chainIdx < chains.length; chainIdx ++) {
				const chain = chains[chainIdx]
				const chainId = +chain

				let workspaceContract: Contract

				switch (chainId) {
				case 5:
					workspaceContract = workspaceContractGoerli
					break
				case 10:
					workspaceContract = workspaceContractOptimism
					break
				case 137:
					workspaceContract = workspaceContractPolygon
					break
				case 42220:
					workspaceContract = workspaceContractCelo
					break
				default:
					continue
				}

				setCurrentStep?.(chainIdx * stepsLength)
				const initBiconomyRes = await initiateBiconomy(chains[chainIdx])

				if(!initBiconomyRes) {
					continue
				}

				const { biconomyWalletClients, biconomyDaoObjs } = initBiconomyRes

				const workspaceIds: string[] = []
				const isVisible: boolean[] = []

				const chainData = data[chainId]

				const keys = Object.keys(chainData)

				keys.forEach((key) => {
					workspaceIds.push(key)
					isVisible.push(chainData[key])
				})

				setCurrentStep?.(chainIdx * stepsLength + 1)

				const response = await sendGaslessTransaction(
					biconomyDaoObjs![chainId],
					workspaceContract,
					'updateWorkspacesVisible',
					[workspaceIds, isVisible],
					WORKSPACE_REGISTRY_ADDRESS[chains[chainIdx] as unknown as SupportedChainId],
					biconomyWalletClients![chainId],
					scwAddress,
					webwallet,
					chains[chainIdx],
					bicoDapps[chains[chainIdx]].webHookId,
					nonce
				)

				setCurrentStep?.(chainIdx * stepsLength + 2)

				if(response) {
					const { receipt, txFee } = await getTransactionDetails(response, chainId.toString())
					setCurrentStep?.(chainIdx * stepsLength + 3)

					await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)
					setCurrentStep?.(chainIdx * stepsLength + 4)

					await chargeGas(Number(workspace?.id), Number(txFee))
				}
			}

			setCurrentStep?.(chainIdx * stepsLength + 1)
		},
		[workspace?.id, workspaceContractGoerli, workspaceContractPolygon, workspaceContractCelo, workspaceContractOptimism, initialBiconomyWalletClients, scwAddress, nonce, webwallet]
	)

	return {
		isBiconomyInitialised: initialBiconomyWalletClients?.[defaultChainId],
		updateDaoVisibility,
	}
}
