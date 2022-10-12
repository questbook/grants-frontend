import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'

export default function useUpdateDaoVisibility() {
	const [transactionData, setTransactionData] = useState<TransactionReceipt>()
	const { nonce } = useQuestbookAccount()

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!
	const currentChainId = useChainId()

	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const workspaceContract = useQBContract('workspace', chainId)
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const { webwallet } = useContext(WebwalletContext)!

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
			data: { [_: string]: boolean } | undefined,
			setCurrentStep?: (step: number | undefined) => void
		) => {
			setCurrentStep?.(0)
			try {
				if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress || !chainId) {
					return undefined!
				}

				const keys = Object.keys(data!)

				const workspaceIds: string[] = []
				const isVisible: boolean[] = []

				keys.forEach((key) => {
					workspaceIds.push(key)
					isVisible.push(data![key])
				})

				const response = await sendGaslessTransaction(
					biconomy,
					workspaceContract,
					'updateWorkspacesVisible',
					[workspaceIds, isVisible],
					WORKSPACE_REGISTRY_ADDRESS[currentChainId],
					biconomyWalletClient,
					scwAddress,
					webwallet,
					currentChainId.toString(),
					bicoDapps[currentChainId].webHookId,
					nonce
				)

				setCurrentStep?.(1)

				if(response) {
					const { receipt, txFee } = await getTransactionDetails(response, currentChainId.toString())
					setCurrentStep?.(2)

					await subgraphClients[currentChainId].waitForBlock(receipt?.blockNumber)
					setCurrentStep?.(3)

					setTransactionData(receipt)

					await chargeGas(Number(workspace?.id), Number(txFee))
				}

				setCurrentStep?.(5)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch(e) {
				const message = getErrorMessage(e as Error)
				toastRef.current = toast({
					position: 'top',
					render: () => ErrorToast({
						content: message,
						close: () => {
							if(toastRef.current) {
								toast.close(toastRef.current)
							}
						},
					}),
				})
			}
		},
		[workspace?.id, workspaceContract, biconomyWalletClient, chainId, scwAddress, biconomy, nonce, webwallet]
	)

	return {
		isBiconomyInitialised,
		updateDaoVisibility,
		txnLink: getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
	}
}
