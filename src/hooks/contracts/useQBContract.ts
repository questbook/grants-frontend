import { useMemo } from 'react'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import { QBContract, QBContractABIMap } from 'src/types'
import { useContract, useSigner } from 'wagmi'
import WorkspaceRegistryABI from '../../contracts/abi/WorkspaceRegistryAbi.json'
import  GrantFactoryAbi  from '../../contracts/abi/GrantFactoryAbi.json'
import  ApplicationRegistryAbi  from '../../contracts/abi/ApplicationRegistryAbi.json'
import  ApplicationReviewRegistryAbi  from '../../contracts/abi/ApplicationReviewRegistryAbi.json'
import { ContractInterface } from 'ethers'

export default function useQBContract<C extends QBContract>(name: C, chainId?: SupportedChainId) {
	const { data: signer } = useSigner()
	let contractI: ContractInterface = WorkspaceRegistryABI
	const addressOrName = useMemo(() => {
		const address = CHAIN_INFO[chainId!]?.qbContracts?.[name]
		return address || '0x0000000000000000000000000000000000000000'
	}, [name, chainId])

	if (name === "workspace") {
		contractI = WorkspaceRegistryABI
	} else if (name === "grantFactory") {
		contractI = GrantFactoryAbi
	} else if (name === "applications") {
		contractI = ApplicationRegistryAbi
	} else if (name === "reviews") {
		contractI = ApplicationReviewRegistryAbi
	}


	const contract = useContract<QBContractABIMap[C]>({
		addressOrName,
		contractInterface: contractI,
		signerOrProvider: signer,
	})

	return contract
}