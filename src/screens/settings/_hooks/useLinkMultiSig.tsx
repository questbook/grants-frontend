import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { logger } from 'ethers'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'

interface Props {
    multisigAddress: string
    selectedSafeNetwork: SafeSelectOption | undefined
}

function useLinkMultiSig({ multisigAddress, selectedSafeNetwork }: Props) {

	const { subgraphClients, workspace, chainId } = useContext(ApiClientsContext)!
	const { webwallet } = useContext(WebwalletContext)!

	const { nonce } = useQuestbookAccount()
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString(),
	})

	const workspaceContract = useQBContract('workspace', getSupportedChainIdFromWorkspace(workspace!))

	const [isMultisigLinked, setIsMultisigLinked] = useState(false)

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && workspace?.id &&
            biconomy.networkId && biconomy.networkId.toString() === workspace?.id.toString()) {
			setIsBiconomyInitialised(true)
		}

	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, workspace])


	const customToast = useCustomToast()

	const linkMultisig = useCallback(async() => {

		try {
			if(!selectedSafeNetwork) {
				throw new Error('No Safe selected')
			}

			logger.info({ selectedSafeNetwork }, 'Selected Safe')

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				logger.info({ biconomyWalletClient, scwAddress }, 'Biconomy State')
				throw new Error('Biconomy wallet client not initialised')
			}

			const chainId = getSupportedChainIdFromWorkspace(workspace!)

			if(!chainId) {
				throw new Error('No network specified')
			}

			logger.info('method args', [Number(workspace?.id), new Uint8Array(32), multisigAddress, parseInt(selectedSafeNetwork.networkId)])
			const transactionHash = await sendGaslessTransaction(
				biconomy,
				workspaceContract,
				'updateWorkspaceSafe',
				[Number(workspace?.id), new Uint8Array(32), multisigAddress, parseInt(selectedSafeNetwork.networkId)],
				WORKSPACE_REGISTRY_ADDRESS[chainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			if(!transactionHash) {
				throw new Error('Transaction hash not received')
			}

			const { receipt } = await getTransactionDetails(transactionHash, chainId.toString())

			await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

			setIsMultisigLinked(true)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {

			const message = getErrorMessage(e)
			customToast({
				position: 'top',
				status: 'error',
				title: message
			})
		}
	}, [workspace, chainId, biconomy, biconomyWalletClient, scwAddress, webwallet, nonce, selectedSafeNetwork])

	return {
		linkMultisig: useMemo(() => {
			return linkMultisig
		}, [workspace, chainId, biconomy, biconomyWalletClient, scwAddress, webwallet, nonce, selectedSafeNetwork]),
		isMultisigLinked
	}

}

export default useLinkMultiSig