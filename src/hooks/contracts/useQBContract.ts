import { useMemo } from 'react'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import { QBContract, QBContractABIMap } from 'src/types'
import { useContract, useSigner } from 'wagmi'
import WorkspaceRegistryABI from '../../contracts/abi/WorkspaceRegistryAbi.json'

export default function useQBContract<C extends QBContract>(name: C, chainId?: SupportedChainId) {
	const { data: signer } = useSigner()
	const addressOrName = useMemo(() => {
		const address = CHAIN_INFO[chainId!]?.qbContracts?.[name]
		return address || '0x0000000000000000000000000000000000000000'
	}, [name, chainId])

	const contract = useContract<QBContractABIMap[C]>({
		addressOrName,
		contractInterface: WorkspaceRegistryABI,
		signerOrProvider: signer,
	})

	return contract
}