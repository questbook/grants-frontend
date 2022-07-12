import type { GrantAbi } from 'src/generated/contracts'
import { useContract, useSigner } from 'wagmi'
import GrantABI from '../../contracts/abi/GrantAbi.json'

export default function useGrantContract(grantId?: string) {
	const { data: signer } = useSigner()
	const grantContract = useContract<GrantAbi>({
		addressOrName: grantId ?? '0x0000000000000000000000000000000000000000',
		contractInterface: GrantABI,
		signerOrProvider: signer,
	})

	return grantContract
}
