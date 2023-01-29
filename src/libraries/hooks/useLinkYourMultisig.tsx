import { useContext, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { defaultChainId } from 'src/constants/chains'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import { isValidEthereumAddress } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function useLinkYourMultisig() {
	const { grant } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const [step, setStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>()

	const { call, isBiconomyInitialised } = useFunctionCall({
		chainId,
		contractName: 'workspace',
		setTransactionHash,
		setTransactionStep: setStep,
	})

	const link = async(multisigAddress: string) => {
		if(!grant?.workspace?.id) {
			return
		}

		let safeAddressInBytes: Uint8Array | string = new Uint8Array(32)
		if(isValidEthereumAddress(multisigAddress)) {
			safeAddressInBytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.getAddress(multisigAddress)), 32)
		}

		const methodArgs = [Number(grant?.workspace?.id), safeAddressInBytes, multisigAddress, chainId]
		await call({ method: 'updateWorkspaceSafe', args: methodArgs })
	}

	return { link, isBiconomyInitialised, step, transactionHash }
}

export default useLinkYourMultisig