import { useContext } from 'react'
import { WebwalletContext } from 'pages/_app'
import type { GrantAbi } from 'src/generated/contracts'
import { useContract } from 'wagmi'
import GrantABI from '../../contracts/abi/GrantAbi.json'

export default function useGrantContract(grantId?: string) {
	const { webwallet: signer } = useContext(WebwalletContext)!
	const grantContract = useContract<GrantAbi>({
		addressOrName: grantId || '0x0000000000000000000000000000000000000000',
		contractInterface: GrantABI,
		signerOrProvider: signer,
	})

	return grantContract
}
