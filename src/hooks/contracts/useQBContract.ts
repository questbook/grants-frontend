import { useContext, useMemo } from 'react'
import { WebwalletContext } from 'src/pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json'
import ApplicationReviewRegistryAbi from 'src/contracts/abi/ApplicationReviewRegistryAbi.json'
import GrantFactoryAbi from 'src/contracts/abi/GrantFactoryAbi.json'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import GrantAbi from 'src/contracts/abi/GrantAbi.json'
import CommunicationAbi from "src/contracts/abi/CommunicationAbi.json"
import { QBContract, QBContractABIMap } from 'src/types'
import { useContract, useSigner } from 'wagmi'

export default function useQBContract<C extends QBContract>(name: C, chainId?: SupportedChainId, isZeroWallet?: boolean) {
	const { webwallet: zeroWalletSigner } = useContext(WebwalletContext)!
	const { data: signer } = useSigner()
	const addressOrName = useMemo(() => {
		const address = CHAIN_INFO[chainId!]?.qbContracts?.[name]
		return address || '0x0000000000000000000000000000000000000000'
	}, [name, chainId])

	const contract = useContract<QBContractABIMap[C]>({
		addressOrName,
		contractInterface: CONTRACT_INTERFACE_MAP[name],
		signerOrProvider: isZeroWallet === false ? signer : zeroWalletSigner,
	})

	return contract
}

export const CONTRACT_INTERFACE_MAP = {
	workspace: WorkspaceRegistryAbi,
	grantFactory: GrantFactoryAbi,
	grant: GrantAbi,
	applications: ApplicationRegistryAbi,
	reviews: ApplicationReviewRegistryAbi,
	communication: CommunicationAbi
} as const
