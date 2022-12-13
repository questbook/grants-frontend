import { useContext, useMemo } from 'react'
import { WorkspaceMemberUpdate } from '@questbook/service-validator-client'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'

interface Props {
    setNetworkTransactionModalStep: (step: number | undefined) => void
    setTransactionHash: (hash: string) => void
}

function useSetupProfile({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { workspace, validatorApi, subgraphClients, chainId } = useContext(ApiClientsContext)!
	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({ chainId: chainId?.toString()! })
	const { nonce } = useQuestbookAccount()
	const workspaceRegistryContract = useQBContract('workspace', chainId)

	const isBiconomyInitialised = useMemo(() => {
		return biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId && biconomy.networkId.toString() === chainId.toString()
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, chainId])

	const toast = useCustomToast()

	const setupProfile = async({ name, email, role }: { name: string, email: string, role: number }) => {
		logger.info({ name, email, scwAddress, webwallet }, 'useSetupProfile')

		try {
			setNetworkTransactionModalStep(0)
			if(!webwallet) {
				throw new Error('webwallet not connected')
			}

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				throw new Error('Biconomy Wallet not initialised properly')
			}

			if(!workspace?.id) {
				throw new Error('Unable to find workspace id')
			}

			const {
				data: { ipfsHash }
			} = await validatorApi.validateWorkspaceMemberUpdate({
				fullName: name,
				// profilePictureIpfsHash: member?.profilePictureIpfsHash,
				publicKey: webwallet.publicKey
			} as WorkspaceMemberUpdate)

			if(!ipfsHash) {
				throw new Error('Failed to upload data to IPFS')
			}

			setNetworkTransactionModalStep(1)

			const methodArgs = [
				workspace.id,
				[scwAddress],
				[role],
				[true],
				[ipfsHash]
			]

			const response = await sendGaslessTransaction(
				biconomy,
				workspaceRegistryContract,
				'updateWorkspaceMembers',
				methodArgs,
				workspaceRegistryContract.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			if(!response) {
				throw new Error('Some error occured on Biconomy side')
			}

			setNetworkTransactionModalStep(2)

			const { txFee, receipt } = await getTransactionDetails(response, chainId.toString())
			setTransactionHash(receipt.transactionHash)
			await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

			setNetworkTransactionModalStep(3)

			await chargeGas(Number(workspace.id), Number(txFee), chainId)
			setNetworkTransactionModalStep(4)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setNetworkTransactionModalStep(undefined)
			const message = getErrorMessage(e)
			toast({
				position: 'top',
				title: message,
			})
		}
	}

	return {
		setupProfile: useMemo(() => setupProfile, [biconomy, biconomyWalletClient, scwAddress, webwallet, chainId, nonce]), isBiconomyInitialised
	}
}

export default useSetupProfile