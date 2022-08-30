import { useContext, useMemo } from 'react'
import { WebwalletContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json'
import ApplicationReviewRegistryAbi from 'src/contracts/abi/ApplicationReviewRegistryAbi.json'
import GrantFactoryAbi from 'src/contracts/abi/GrantFactoryAbi.json'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import { QBContract, QBContractABIMap } from 'src/types'
import { useContract } from 'wagmi'

export default function useQBContract<C extends QBContract>(name: C, chainId?: SupportedChainId) {
	const { webwallet: signer } = useContext(WebwalletContext)!
	const addressOrName = useMemo(() => {
		const address = CHAIN_INFO[chainId!]?.qbContracts?.[name]
		return address || '0x0000000000000000000000000000000000000000'
	}, [name, chainId])

	const contract = useContract<QBContractABIMap[C]>({
		addressOrName,
		contractInterface: CONTRACT_INTERFACE_MAP[name],
		signerOrProvider: signer,
	})

	return contract
}

const CONTRACT_INTERFACE_MAP = {
	workspace: WorkspaceRegistryAbi,
	grantFactory: GrantFactoryAbi,
	applications: ApplicationRegistryAbi,
	reviews: ApplicationReviewRegistryAbi,
} as const
