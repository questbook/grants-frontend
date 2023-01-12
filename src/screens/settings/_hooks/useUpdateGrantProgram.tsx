import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { defaultChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { SettingsFormContext } from 'src/screens/settings/Context'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

export default function useUpdateGrantProgram(setCurrentStep: (step: number | undefined) => void, setIsNetworkTransactionModalOpen: (isOpen: boolean) => void) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [transactionData, setTransactionData] = React.useState<any>()
	const { nonce } = useQuestbookAccount()
	const currentChainId = useChainId()

	const { subgraphClients } = useContext(ApiClientsContext)!
	const { grant } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { grantProgramData } = useContext(SettingsFormContext)!

	const workspaceRegistryContract = useQBContract('workspace', chainId)

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = React.useState(false)

	const customToast = useCustomToast()

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])


	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [workspaceRegistryContract])


	async function validate() {
		setLoading(true)
		// console.log(data)
		try {
			setIsNetworkTransactionModalOpen(true)
			setCurrentStep(0)
			if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress || !grant) {
				throw new Error('Zero wallet is not ready')
			}

			logger.info({ grantProgramData }, 'UpdateWorkspace')
			const { hash: workspaceUpdateIpfsHash } = await validateAndUploadToIpfs('WorkspaceUpdateRequest', grantProgramData)
			if(!workspaceUpdateIpfsHash) {
				throw new Error('Error validating grant data')
			}

			logger.info({ workspaceUpdateIpfsHash }, 'UpdateWorkspace IPFS')
			setCurrentStep(1)

			const response = await sendGaslessTransaction(
				biconomy,
				workspaceRegistryContract,
				'updateWorkspaceMetadata',
				[+grant?.workspace!.id,
					workspaceUpdateIpfsHash, ],
				WORKSPACE_REGISTRY_ADDRESS[chainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			setCurrentStep(2)

			if(response) {
				const { receipt, txFee } = await getTransactionDetails(response, chainId.toString())
				setTransactionData(receipt)

				setCurrentStep(3)

				await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

				setCurrentStep(4)
				await chargeGas(Number(grant?.workspace?.id), Number(txFee), chainId)
			}

			setCurrentStep(5)

			setLoading(false)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setCurrentStep(undefined)
			const message = getErrorMessage(e)
			setError(message)
			setLoading(false)
			customToast({
				position: 'top',
				title: message,
				status: 'error',
			})
		}
	}

	const updateGrantProgram = useCallback(validate, [
		workspaceRegistryContract,
		biconomyWalletClient,
		scwAddress,
		chainId,
		biconomy,
		webwallet,
		grant,
		grantProgramData,
	])

	return {
		updateGrantProgram: useMemo(() => {
			return updateGrantProgram
		}, [grantProgramData, workspaceRegistryContract,
			biconomyWalletClient,
			scwAddress,
			chainId,
			biconomy,
			webwallet,
			grant,]),
		txHash: getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
		error
	}

}


