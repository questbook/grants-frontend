import { useContract, useSigner } from 'wagmi'
import GrantABI from '../../contracts/abi/GrantAbi.json'

export default function useGrantContract(grantId?: string) {
	const [signerStates] = useSigner()
	const grantContract = useContract({
		addressOrName:
      grantId ?? '0x0000000000000000000000000000000000000000',
		contractInterface: GrantABI,
		signerOrProvider: signerStates.data,
	})

	return grantContract
}
