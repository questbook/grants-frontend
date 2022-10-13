import { useCallback, useContext, useEffect, useState } from 'react'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { ApiClientsContext, BiconomyContext, WebwalletContext } from 'src/pages/_app'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'

export default function useUpdateDaoVisibility() {
	const { nonce } = useQuestbookAccount()

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const workspaceContract = useQBContract('workspace', chainId)

	const { webwallet } = useContext(WebwalletContext)!

	const { initiateBiconomy } = useContext(BiconomyContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()!
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
      biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised])

	const updateDaoVisibility = useCallback(
		async(
			data: { [_: number]: { [_: string]: boolean } },
			stepsLength: number,
			setCurrentStep?: (step: number | undefined) => void
		) => {
			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress || !chainId) {
				return undefined!
			}

			const chains = Object.keys(data)

			let chainIdx
			for(chainIdx = 0; chainIdx < chains.length; chainIdx ++) {
				const chain = chains[chainIdx]
				const chainId = +chain

				setCurrentStep?.(chainIdx * stepsLength)
				await initiateBiconomy(chains[chainIdx])

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
					biconomy,
					workspaceContract,
					'updateWorkspacesVisible',
					[workspaceIds, isVisible],
					WORKSPACE_REGISTRY_ADDRESS[chains[chainIdx] as unknown as SupportedChainId],
					biconomyWalletClient,
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
		[workspace?.id, workspaceContract, biconomyWalletClient, chainId, scwAddress, biconomy, nonce, webwallet]
	)

	return {
		isBiconomyInitialised,
		updateDaoVisibility,
	}
}
