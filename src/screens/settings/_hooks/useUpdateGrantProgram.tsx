import { useContext, useEffect, useMemo, useState } from 'react'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { defaultChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { GrantProgramForm } from 'src/screens/settings/_utils/types'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

export default function useUpdateGrantProgram(setCurrentStep: (step: number | undefined) => void, setIsNetworkTransactionModalOpen: (isOpen: boolean) => void) {
	const [error, setError] = useState<string>()
	const [loading, setLoading] = useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = useState(false)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [transactionData, setTransactionData] = useState<any>()
	const { nonce } = useQuestbookAccount()

	const { subgraphClients } = useContext(ApiClientsContext)!
	const { grant } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const workspaceRegistryContract = useQBContract('workspace', chainId)

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

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

	const updateGrantProgram = async(grantProgramData: GrantProgramForm) => {
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

	return {
		updateGrantProgram,
		txHash: transactionData?.transactionHash,
		loading,
		error
	}

}


