import { useContext, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { updateMetadataWorkspaceMutation } from 'src/generated/mutation/updateMetadataWorkspace'
import { executeMutation } from 'src/graphql/apollo'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import getErrorMessage from 'src/libraries/utils/error'
import logger from 'src/libraries/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
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
	logger.info({ chainId }, 'Chain ID')
	// const { isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'workspace', setTransactionStep: setCurrentStep, setTransactionHash: setTransactionHash })

	const customToast = useCustomToast()

	const updateGrantProgram = async(grantProgramData: GrantProgramForm) => {
		setLoading(true)
		// console.log(data)
		try {
			logger.info({ grantProgramData }, 'UpdateWorkspace')
			const data = await executeMutation(updateMetadataWorkspaceMutation, { id: grant?.workspace!.id, metadata: grantProgramData })
			setTransactionHash(data?.updateWorkspaceMetadata?.recordId)
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


