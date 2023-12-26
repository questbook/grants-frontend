import { useContext, useMemo, useState } from 'react'
import { ethers, logger } from 'ethers'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { workspaceUpdateSafeMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import { isValidEthereumAddress } from 'src/libraries/utils/validations'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import TonWeb from 'tonweb'

function toRawAddress(address: string): string {
	return new TonWeb.Address(address).toString(false)
}

function useLinkYourMultisig() {
	const { grant } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const [step, setStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>()
	const router = useRouter()
	const link = async(multisigAddress: string, networkId: string, isTonkey: boolean) => {
		if(!grant?.workspace?.id) {
			return
		}

		let safeAddressInBytes: Uint8Array | string = new Uint8Array(32)
		if(isValidEthereumAddress(multisigAddress)) {
			safeAddressInBytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.getAddress(multisigAddress)), 32)
		}

		logger.info({ safeAddressInBytes, chainId }, 'Safe address in bytes')
		// const methodArgs = [Number(grant?.workspace?.id), safeAddressInBytes, isTonkey ? toRawAddress(multisigAddress) : multisigAddress, networkId]
		const receipt = await executeMutation(workspaceUpdateSafeMutation, { id: grant?.workspace?.id, longSafeAddress:
			isTonkey ? toRawAddress(multisigAddress) : multisigAddress
		, safeChainId: networkId })
		if(!receipt?.workspaceSafeUpdate?.recordId) {
			throw new Error('Unable to update multisig address')
		}

		setTransactionHash(receipt?.workspaceSafeUpdate?.recordId)
		setStep(undefined)
		router.push({
			pathname: '/dashboard',
			query: {
				...router.query,
				grantId: grant?.id,
				chainId: defaultChainId,
			},
		})
	}

	return { link, step, transactionHash }
}

export default useLinkYourMultisig