/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo } from 'react'
import { SupportedChainId } from 'src/constants/chains'
import { CHAIN_INFO } from 'src/constants/chains'
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json'
import ApplicationReviewRegistryAbi from 'src/contracts/abi/ApplicationReviewRegistryAbi.json'
import CommunicationAbi from 'src/contracts/abi/CommunicationAbi.json'
import GrantAbi from 'src/contracts/abi/GrantAbi.json'
import GrantFactoryAbi from 'src/contracts/abi/GrantFactoryAbi.json'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import { WebwalletContext } from 'src/pages/_app'
import { QBContract, QBContractABIMap } from 'src/types'
import { getContract } from 'viem'
import { useWalletClient } from 'wagmi'

export default function useQBContract<C extends QBContract>(name: C, chainId?: SupportedChainId, isZeroWallet?: boolean) {
	const { webwallet: zeroWalletSigner } = useContext(WebwalletContext)!
	const { data: signer } = useWalletClient()
	const addressOrName = useMemo(() => {
		const address = CHAIN_INFO[chainId!]?.qbContracts?.[name]
		return address || '0x0000000000000000000000000000000000000000'
	}, [name, chainId])
	//@ts-ignore
	const contract = getContract<QBContractABIMap[C]>({
		address: addressOrName as `0x${string}`,
		abi: CONTRACT_INTERFACE_MAP[name as keyof QBContractABIMap],
		client: {
			public: isZeroWallet === false ? signer : zeroWalletSigner as any,
			wallet: isZeroWallet === false ? signer : zeroWalletSigner as any
		}
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
