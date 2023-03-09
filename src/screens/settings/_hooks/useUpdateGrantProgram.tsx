import { useContext, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import getErrorMessage from 'src/libraries/utils/error'
import logger from 'src/libraries/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { GrantsProgramContext } from 'src/pages/_app'
import { GrantProgramForm } from 'src/screens/settings/_utils/types'

export default function useUpdateGrantProgram(setCurrentStep: (step: number | undefined) => void) {
	const [error, setError] = useState<string>()
	const [loading, setLoading] = useState(false)
	const [transactionHash, setTransactionHash] = useState<string>()
	const { grant } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'workspace', setTransactionStep: setCurrentStep, setTransactionHash: setTransactionHash })

	const customToast = useCustomToast()

	const updateGrantProgram = async(grantProgramData: GrantProgramForm) => {
		setLoading(true)
		// console.log(data)
		try {
			if(!isBiconomyInitialised) {
				throw new Error('Zero wallet is not ready')
			}

			logger.info({ grantProgramData }, 'UpdateWorkspace')
			const { hash: workspaceUpdateIpfsHash } = await validateAndUploadToIpfs('WorkspaceUpdateRequest', grantProgramData)
			if(!workspaceUpdateIpfsHash) {
				throw new Error('Error validating grant data')
			}

			logger.info({ workspaceUpdateIpfsHash }, 'UpdateWorkspace IPFS')

			const args = [grant?.workspace!.id, workspaceUpdateIpfsHash, ]
			await call({ method: 'updateWorkspaceMetadata', args: args })

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
		txHash: transactionHash,
		loading,
		error
	}

}


