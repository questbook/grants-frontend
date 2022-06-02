
/* eslint-disable consistent-return */
import React, { useEffect } from 'react'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import { useContract, useSigner } from 'wagmi'
import WorkspaceRegistryABI from '../../contracts/abi/WorkspaceRegistryAbi.json'

export default function useWorkspaceRegistryContract(chainId?: SupportedChainId) {
	const [addressOrName, setAddressOrName] = React.useState<string>()
	const { data: signer } = useSigner()
	useEffect(() => {
		if(!chainId) {
			return
		}

		setAddressOrName(WORKSPACE_REGISTRY_ADDRESS[chainId])
	}, [chainId])

	const workspaceRegistryContract = useContract({
		addressOrName:
      addressOrName ?? '0x0000000000000000000000000000000000000000',
		contractInterface: WorkspaceRegistryABI,
		signerOrProvider: signer,
	})

	return workspaceRegistryContract
}
